function detectUrlType (rawURL) {
  const url = new URL(rawURL)
  if (url.pathname.endsWith('.m3u8')) {
    return 'm3u8'
  }
  if (url.pathname.endsWith('.flv')) {
    return 'flv'
  }
  if (url.pathname.endsWith('.xs')) {
    return 'xs'
  }
  return ''
}

export { detectUrlType }
