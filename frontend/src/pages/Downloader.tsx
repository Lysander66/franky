// @ts-nocheck
import './style/Downloader.scss'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { toast } from 'sonner'

const api_endpoint = 'http://127.0.0.1:3000/api/v1/download'

const placeholder = `{
	"user-agent": ${navigator.userAgent}
}`

export default function Downloader() {
  const [progress, setProgress] = useState('0')
  const [downloading, setDownloading] = useState(false)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name:'test',
      url: 'https://test-streams.mux.dev/x36xhzz/url_8/193039199_mp4_h264_aac_fhd_7.m3u8',
      num_parallel: 1,
      use_proxy: 1,
    },
  })

  const onSubmit = (formData) => {
    if (downloading) {
      toast.info('请等待下载完成')
      return
    }

    const data = {
      url: formData.url,
      name: formData.name,
      directory: formData.directory,
      num_parallel: Number.parseInt(formData.num_parallel),
      use_proxy: Number.parseInt(formData.use_proxy),
      headers:
        formData.headers && formData.headers != ''
          ? JSON.parse(formData.headers)
          : { 'user-agent': navigator.userAgent },
    }

    fetchEventSource(api_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      onmessage(ev) {
        const eventData = JSON.parse(ev.data)
        eventData.completed !== 1 &&
          setProgress(((100 * eventData.n) / eventData.total).toFixed(1))
      },
      onopen() {
        setDownloading(true)
      },
      onclose() {
        setDownloading(false)
      },
      onerror(err) {
        console.log('error', err)
        return 3600 * 1000
      },
    })
  }

  return (
    <>
      <div
        className="radial-progress float-left ml-20 mt-20 text-success"
        style={{
          '--value': progress,
          '--size': '12rem',
          '--thickness': '5px',
        }}
        role="progressbar">
        {progress}%
      </div>

      <div className="relative mx-auto my-6 w-2/4 max-w-3xl">
        <div
          style={{ backgroundColor: 'rgba(158, 158, 158, 0.3)' }}
          className="relative flex w-full flex-col rounded-lg border-0 shadow-lg outline-none focus:outline-none">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative flex-auto p-6">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text"></span>
                </div>
                <select
                  {...register('use_proxy')}
                  className="select select-bordered">
                  <option value={0}> 直连 </option>
                  <option value={1}> 代理 </option>
                </select>
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">协程数</span>
                </div>
                <input
                  {...register('num_parallel')}
                  type="number"
                  min="1"
                  max="50"
                  className="input input-bordered w-full"
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">目录</span>
                </div>
                <input
                  {...register('directory')}
                  type="text"
                  className="input input-bordered w-full"
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">文件名</span>
                </div>
                <input
                  {...register('name')}
                  type="text"
                  className="input input-bordered w-full"
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">URL</span>
                </div>
                <input
                  {...register('url')}
                  required
                  type="text"
                  className="input input-bordered w-full"
                />
              </label>

              <label className="form-control">
                <div className="label">
                  <span className="label-text">Headers</span>
                </div>
                <textarea
                  {...register('headers')}
                  className="textarea textarea-bordered h-48"
                  placeholder={placeholder}
                />
              </label>
            </div>
            <div className="border-blueGray-200 flex items-center justify-end rounded-b border-t border-solid p-6">
              <button className="btn btn-primary">Download</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
