import { render as renderAmis, Schema } from 'amis'
import { ToastComponent, AlertComponent, toast } from 'amis-ui'
import axios from 'axios'
import copy from 'copy-to-clipboard'

interface Props {
  schema: Schema
}

const Amis = ({ schema }: Props) => {
  const theme = 'cxd'
  const locale = 'zh-CN'
  return (
    <>
      <ToastComponent
        theme={theme}
        key="toast"
        position={'top-center'}
        locale={locale}
      />
      <AlertComponent theme={theme} key="alert" locale={locale} />
      {renderAmis(
        schema,
        {},
        {
          theme: 'cxd',
          updateLocation: (to: unknown, replace: unknown) => {
            console.log(to)
            console.log(replace)
          },
          fetcher: ({
            url, 
            method, 
            data, 
            responseType,
            config, 
            headers, 
          }: any) => {
            config = config || {}
            config.withCredentials = true
            responseType && (config.responseType = responseType)

            if (config.cancelExecutor) {
              config.cancelToken = new (axios as any).CancelToken(
                config.cancelExecutor
              )
            }

            config.headers = headers || {}

            axios.defaults.baseURL = 'http://localhost:3000'

            if (method !== 'post' && method !== 'put' && method !== 'patch') {
              if (data) {
                config.params = data
              }

              return (axios as any)[method](url, config)
            } else if (data && data instanceof FormData) {
              config.headers = config.headers || {}
              config.headers['Content-Type'] = 'multipart/form-data'
            } else if (
              data &&
              typeof data !== 'string' &&
              !(data instanceof Blob) &&
              !(data instanceof ArrayBuffer)
            ) {
              data = JSON.stringify(data)
              config.headers = config.headers || {}
              config.headers['Content-Type'] = 'application/json'
            }

            return (axios as any)[method](url, data, config)
          },
          isCancel: (value: any) => (axios as any).isCancel(value),
          copy: (content) => {
            copy(content)
            toast.success('内容已复制到粘贴板')
          },
        }
      )}
    </>
  )
}

export default Amis
