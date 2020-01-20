import wretch, { Wretcher } from 'wretch'
import { Auth } from 'aws-amplify'

let api: Wretcher

if (process.env.NODE_ENV === 'production') {
  api = wretch()
    .url('https://api.frontoffice.app')
    .defer((w, url, options) => {
      const { token } = options.context
      return w.auth(`Basic ${token.idToken.jwtToken}`)
    })
} else {
  api = wretch()
    .url('/api')
    .defer((w, url, options) => {
      const { token } = options.context
      return w.auth(`Basic ${token.idToken.jwtToken}`)
    })
}

export const postData = async (url: string, body: any) => {
  let token = await Auth.currentSession()
  return api
    .options({ context: { token } })
    .url(url)
    .post({ ...body })
    .json()
}

export const fetchData = async (
  url: string,
  callback: (data: { [key: string]: any }) => void
) => {
  let token = await Auth.currentSession()
  await api
    .options({ context: { token } })
    .url(url)
    .get()
    .json(json => {
      callback(json)
    })
}

export default api
