export function validateVideoFile(file, maxSize) {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
  const allowedExtensions = ['mp4', 'mov', 'webm']
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
    return '지원되지 않는 파일 형식입니다. MP4, MOV, WEBM만 지원됩니다.'
  }
  if (file.size > maxSize) {
    return `파일 용량이 너무 큽니다. 최대 ${Math.round(maxSize / 1024 / 1024)}MB까지 업로드 가능합니다.`
  }
  return null
}
