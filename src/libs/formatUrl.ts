const formatUrl = (url: string) => url.replaceAll(/(?<!:)\/{2,}/g, '/')

export default formatUrl
