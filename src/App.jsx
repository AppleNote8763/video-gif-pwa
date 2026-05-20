import { useEffect, useMemo, useState } from 'react'
import { fetchFile } from '@ffmpeg/ffmpeg'
import FileUploadCard from './components/FileUploadCard'
import VideoPreview from './components/VideoPreview'
import GifPreview from './components/GifPreview'
import { useFFmpeg } from './hooks/useFFmpeg'
import { validateVideoFile } from './utils/ffmpegHelpers'
import { formatSeconds } from './utils/formatTime'

const MAX_FILE_SIZE = 150 * 1024 * 1024

export default function App() {
  const { ffmpeg, ready, loading: ffmpegLoading, progress: ffmpegProgress, error: ffmpegError } = useFFmpeg()
  const [file, setFile] = useState(null)
  const [videoURL, setVideoURL] = useState('')
  const [videoDuration, setVideoDuration] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [fps, setFps] = useState(10)
  const [width, setWidth] = useState(480)
  const [gifURL, setGifURL] = useState('')
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const statusText = useMemo(() => {
    if (ffmpegError) return `FFmpeg 로드 오류: ${ffmpegError}`
    if (ffmpegLoading) return 'FFmpeg를 로드 중입니다. 잠시만 기다려주세요.'
    if (!ready) return 'FFmpeg 준비 중...'
    return 'FFmpeg 준비 완료 - 파일을 업로드하고 변환하세요.'
  }, [ffmpegError, ffmpegLoading, ready])

  useEffect(() => {
    return () => {
      if (videoURL) URL.revokeObjectURL(videoURL)
      if (gifURL) URL.revokeObjectURL(gifURL)
    }
  }, [videoURL, gifURL])

  useEffect(() => {
    setProgress(Math.round(ffmpegProgress * 100))
  }, [ffmpegProgress])

  useEffect(() => {
    if (file && videoDuration > 0 && endTime === 0) {
      setEndTime(Math.min(10, videoDuration))
    }
  }, [file, videoDuration, endTime])

  const handleFile = (selectedFile) => {
    setError('')
    setSuccessMessage('')
    const validation = validateVideoFile(selectedFile, MAX_FILE_SIZE)
    if (validation) {
      setError(validation)
      return
    }
    setFile(selectedFile)
    setGifURL('')
    setVideoDuration(0)
    setStartTime(0)
    setEndTime(0)
    const url = URL.createObjectURL(selectedFile)
    setVideoURL(url)
  }

  const handleMetadata = (event) => {
    const duration = Math.floor(event.target.duration || 0)
    setVideoDuration(duration)
    if (endTime === 0 || endTime > duration) {
      setEndTime(duration)
    }
  }

  const handleConvert = async () => {
    setError('')
    setSuccessMessage('')
    if (!file) {
      setError('동영상 파일을 먼저 업로드해주세요.')
      return
    }
    if (!ready) {
      setError('FFmpeg 준비가 완료될 때까지 기다려주세요.')
      return
    }
    if (startTime < 0 || endTime <= 0 || startTime >= endTime) {
      setError('시작 시간과 종료 시간을 올바르게 설정해주세요.')
      return
    }
    if (videoDuration > 0 && endTime > videoDuration) {
      setError('종료 시간이 영상 길이를 넘지 않도록 설정해주세요.')
      return
    }
    setConverting(true)
    setProgress(0)

    const extension = file.name.split('.').pop() || 'mp4'
    const inputName = `input.${extension}`
    const paletteName = 'palette.png'
    const outputName = 'output.gif'

    try {
      ;[inputName, paletteName, outputName].forEach((name) => {
        try {
          ffmpeg.FS('unlink', name)
        } catch {
          // The file may not exist yet.
        }
      })

      ffmpeg.FS('writeFile', inputName, await fetchFile(file))

      const videoFilter = `fps=${fps},scale=${width}:-1:flags=lanczos`

      await ffmpeg.run(
        '-ss', `${startTime}`,
        '-to', `${endTime}`,
        '-i', inputName,
        '-vf', `${videoFilter},palettegen`,
        paletteName
      )

      await ffmpeg.run(
        '-ss', `${startTime}`,
        '-to', `${endTime}`,
        '-i', inputName,
        '-i', paletteName,
        '-filter_complex', `${videoFilter}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5`,
        '-f', 'gif',
        outputName
      )

      const data = ffmpeg.FS('readFile', outputName)
      const blob = new Blob([data], { type: 'image/gif' })
      const url = URL.createObjectURL(blob)
      setGifURL(url)
      setSuccessMessage('GIF 변환이 완료되었습니다.')
      setTimeout(() => {
        document.getElementById('resultSection')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (conversionError) {
      setError(`GIF 생성 실패: ${conversionError.message || conversionError}`)
    } finally {
      ;[inputName, paletteName, outputName].forEach((name) => {
        try {
          ffmpeg.FS('unlink', name)
        } catch {
          // Ignore cleanup failures.
        }
      })
      setConverting(false)
    }
  }

  const handleDownload = () => {
    if (!gifURL) return
    const link = document.createElement('a')
    link.href = gifURL
    link.download = 'video-to-gif.gif'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 sm:mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Video → GIF 변환기</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            설치형 브라우저 GIF 변환 앱
          </h1>
          <p className="mt-4 max-w-3xl text-slate-300 sm:text-lg">
            MP4 / MOV / WEBM을 브라우저에서 바로 GIF로 변환하세요. 빠른 변환, 미리보기, 다운로드, 그리고 PWA 설치 지원.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <section className="space-y-6">
            <FileUploadCard
              onFileSelect={handleFile}
              fileName={file?.name}
              error={error}
              maxSize={MAX_FILE_SIZE}
              disabled={converting || ffmpegLoading}
            />

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-soft">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">영상 미리보기</h2>
                  <p className="text-sm text-slate-400">업로드한 영상의 재생 시간을 확인하고 값을 조정하세요.</p>
                </div>
                <div className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
                  {videoDuration ? `총 길이 ${formatSeconds(videoDuration)}` : '영상 등록 후 길이 확인'}
                </div>
              </div>
              <VideoPreview previewURL={videoURL} onLoadedMetadata={handleMetadata} />
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-soft">
              <h2 className="mb-4 text-xl font-semibold text-white">변환 옵션</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>시작 시간 (초)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={startTime}
                    onChange={(e) => setStartTime(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>종료 시간 (초)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={endTime}
                    onChange={(e) => setEndTime(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>FPS 설정</span>
                    <span className="text-slate-400">{fps}</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="24"
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value))}
                    className="w-full accent-sky-400"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span>GIF 폭 (px)</span>
                  <input
                    type="number"
                    min="160"
                    max="960"
                    step="16"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                  />
                </label>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-soft">
              <h2 className="mb-4 text-xl font-semibold text-white">변환 컨트롤</h2>
              <p className="mb-6 text-sm text-slate-400">변환 중에는 버튼이 비활성화됩니다. FFmpeg 로딩 상태를 확인하세요.</p>
              <div className="space-y-4">
                <button
                  onClick={handleConvert}
                  disabled={!file || converting || ffmpegLoading || !!ffmpegError}
                  className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-500 px-5 py-4 text-base font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                >
                  {converting ? 'GIF 변환 중...' : 'GIF 변환 시작'}
                </button>
                <div className="rounded-3xl bg-slate-950/70 p-4 text-sm text-slate-300">
                  <p className="mb-2 font-medium text-white">상태</p>
                  <p>{statusText}</p>
                </div>
                <div className="rounded-3xl bg-slate-950/70 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                    <span>진행률</span>
                    <span>{Math.min(progress, 100)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-sky-400 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                {successMessage && <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">{successMessage}</div>}
                {error && <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}
              </div>
            </div>

            <div id="resultSection">
              <GifPreview gifURL={gifURL} onDownload={handleDownload} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
