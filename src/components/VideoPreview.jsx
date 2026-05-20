export default function VideoPreview({ previewURL, onLoadedMetadata }) {
  if (!previewURL) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center text-slate-500">
        업로드한 영상 미리보기가 여기에 표시됩니다.
      </div>
    )
  }

  return (
    <div className="flex aspect-video max-h-[52vh] min-h-[180px] w-full max-w-full min-w-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 shadow-soft sm:min-h-[220px]">
      <video
        src={previewURL}
        controls
        onLoadedMetadata={onLoadedMetadata}
        className="block h-full w-full max-w-full bg-black object-contain"
      />
    </div>
  )
}
