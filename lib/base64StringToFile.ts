export function base64StringToFile(
  base64String: string,
  filename: string,
): File | null {
  if (!base64String) return null
  const byteString = atob(base64String.split(",")[1])
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  const blob = new Blob([ab], { type: "image/jpeg" })
  return new File([blob], filename)
}
