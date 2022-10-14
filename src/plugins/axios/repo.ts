import axios from '@/plugins/axios/api'

/**
 * @see https://docs.github.com/en/rest/repos/contents#get-repository-content
 * @description 获取存储库中文件或目录的内容
 */
interface RepoPathContent {
  name: string
  path: string
  sha: string
  size: number
  type: 'file' | 'dir'
  children?: RepoPathContent[]
}
const repoPathContent = async (owner: string, repo: string, path = '') => {
  try {
    const { data } = await axios.get<RepoPathContent[]>(`/repos/${owner}/${repo}/contents/${path}`)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * @description 获取存储库某路径下的所有内容
 */
const repoContent = async (owner: string, repo: string, path = '', flat = false) => {
  try {
    const result = await repoPathContent(owner, repo, path)
    const childrenResult: RepoPathContent[] = []
    for (let index = 0; index < result.length; index++) {
      if (result[index].type == 'dir') {
        if (flat) {
          childrenResult.push(...(await repoContent(owner, repo, result[index].path)))
        } else {
          result[index].children = await repoContent(owner, repo, result[index].path)
        }
      }
    }
    result.push(...childrenResult)
    return result
  } catch (error) {
    return Promise.reject(error)
  }
}

export type { RepoPathContent }
export { repoPathContent, repoContent }
