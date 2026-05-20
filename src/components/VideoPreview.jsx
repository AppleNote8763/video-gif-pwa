export default function VideoPreview({ previewURL, onLoadedMetadata }) {
  if (!previewURL) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center text-slate-500">
        업로드한 영상 미리보기가 여기에 표시됩니다.
      </div>
    )
  }

  return (
    <div className="aspect-video max-h-[52vh] min-h-[220px] overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 shadow-soft">
      <video
        src={previewURL}
        controls
        onLoadedMetadata={onLoadedMetadata}
        className="h-full w-full bg-black object-contain"
      />
    </div>
  )
}
