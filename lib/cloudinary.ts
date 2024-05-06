export function extractCloudinaryId(url: string) {
  const regex = /\/v(\d+)\/(.+?)\./
  const match = url.match(regex)
  if (match) {
    return `v${match[1]}/${match[2]}`
  }
  return null
}
