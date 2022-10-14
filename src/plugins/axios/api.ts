import { useUserStore } from '@/plugins/stores/user'
import axios from 'axios'

const request = axios.create({
  baseURL: 'https://api.github.com/'
})

request.interceptors.request.use(
  config => {
    config.url = config.url?.replaceAll(/\/{2,}/g, '/')
    const { token } = useUserStore()
    if (token) {
      Object.assign(config, {
        headers: {
          Authorization: `token ${token}`
        }
      })
    }
    return config
  },
  error => Promise.reject(error)
)

export default request
