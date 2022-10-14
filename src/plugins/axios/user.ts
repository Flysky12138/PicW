import axios from '@/plugins/axios/api'

/**
 * @see https://docs.github.com/en/rest/users/users#get-a-user
 * @description 获取 GitHub 帐户的公开信息
 */
interface UserInfo {
  avatar_url: string
}
const userInfo = async (username: string) => {
  try {
    const { data } = await axios.get<UserInfo>(`/users/${username}`)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * @description 验证用户令牌的有效性
 */
const userToken = async (token: string) => {
  try {
    await axios.get(`/?access_token=${token}`)
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * @see https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user
 * @description 列出用户的公共存储库
 */
interface UserRepos {
  id: number
  name: string
  size: number
}
const userRepos = async (username: string) => {
  try {
    const { data } = await axios.get<UserRepos[]>(`/users/${username}/repos`)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export type { UserRepos }
export { userInfo, userToken, userRepos }
