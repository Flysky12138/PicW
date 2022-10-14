const blob2Base64 = (file: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result?.toString() || ''
      resolve(base64.slice(base64.indexOf(',') + 1))
    }
    reader.onerror = error => reject(error)
  })
}

export default blob2Base64
