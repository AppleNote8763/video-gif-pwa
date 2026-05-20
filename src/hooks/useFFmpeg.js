import { createFFmpeg } from '@ffmpeg/ffmpeg'
import { useEffect, useMemo, useState } from 'react'

export function useFFmpeg() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const ffmpeg = useMemo(() => {
    return createFFmpeg({
      corePath: `${import.meta.env.BASE_URL}ffmpeg/ffmpeg-core.js`,
      log: false,
      progress: ({ ratio }) => {
        setProgress(ratio)
      }
    })
  }, [])

  useEffect(() => {
    ffmpeg
      .load()
      .then(() => {
        setReady(true)
        setLoading(false)
      })
      .catch((loadError) => {
        setError(loadError.message || 'FFmpeg를 불러오는 중 오류가 발생했습니다.')
        setLoading(false)
      })
  }, [ffmpeg])

  return { ffmpeg, ready, loading, progress, error }
}
