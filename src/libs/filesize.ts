const M = 1024 * 1024

const filesize = (size: number) => (size < M ? `${(size / 1024).toFixed(2)} K` : `${(size / M).toFixed(2)} M`)

export default filesize
