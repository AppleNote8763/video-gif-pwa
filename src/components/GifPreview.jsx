export default function GifPreview({ gifURL, onDownload }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-soft">
      <h2 className="mb-4 text-xl font-semibold text-white">GIF 결과</h2>
      {gifURL ? (
        <div className="space-y-4">
          <div className="flex max-h-[52vh] min-h-[180px] items-center justify-center overflow-hidden rounded-3xl border border-slate-700 bg-black p-3">
            <img src={gifURL} alt="GIF preview" className="max-h-[48vh] max-w-full object-contain" />
          </div>
          <button
            onClick={onDownload}
            className="w-full rounded-3xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            GIF 다운로드
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-400">변환이 완료되면 결과 GIF가 이곳에 표시됩니다.</p>
      )}
    </div>
  )
}
