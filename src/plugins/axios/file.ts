import axios from './api'

/**
 * @see https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
 * @description 在存储库中创建一个新文件
 */
const uploadFile = async (owner: string, repo: string, path: string, filename: string, content: string) => {
  try {
    const { data } = await axios.put(`/repos/${owner}/${repo}/contents/${path}/${filename}`, {
      content,
      message: `Upload ${filename} by PicW - ${new Date().toLocaleString()}`
    })
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * @see https://docs.github.com/en/rest/repos/contents#delete-a-file
 * @description 删除存储库中的一个文件
 */
const deleteFile = async (owner: string, repo: string, path: string, filename: string, sha: string) => {
  try {
    const { data } = await axios.delete(`/repos/${owner}/${repo}/contents/${path}`, {
      data: {
        sha,
        message: `Delete ${filename} by PicW - ${new Date().toLocaleString()}`
      }
    })
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export { uploadFile, deleteFile }
