const download = async (url: string, filename: string) => {
  const blob = await fetch(url).then(val => val.blob())
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: filename
  })
  a.click()
  URL.revokeObjectURL(a.href)
}

export default download
