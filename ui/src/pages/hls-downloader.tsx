import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useForm } from '@refinedev/react-hook-form'
import { Download, Play } from 'lucide-react'
import { useState } from 'react'

const api_endpoint = 'http://127.0.0.1:3000/api/v1/download'

export const HLSDownloader = () => {
	const { toast } = useToast()
	const [progress, setProgress] = useState(0)
	const [isDownloading, setIsDownloading] = useState(false)

	const { register, handleSubmit, setValue, watch } = useForm({
		defaultValues: {
			url: '',
			proxy: 'none',
			threads: 1,
			directory: '',
			filename: '',
			headers: ''
		}
	})

	const threads = watch('threads')

	const onSubmit = (data: any) => {
		if (isDownloading) {
			toast({ title: '下载进行中', description: '请等待当前任务完成' })
			return
		}

		const body = { ...data, headers: data.headers ? JSON.parse(data.headers) : { 'user-agent': navigator.userAgent } }

		fetchEventSource(api_endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body),
			onmessage(ev) {
				const eventData = JSON.parse(ev.data)
				if (!eventData.completed) {
					const percent = (100 * eventData.Downloaded) / eventData.Total
					eventData.completed !== 1 && setProgress(Number(percent.toFixed(0)))
					return
				}
				setIsDownloading(false)
				setProgress(100)
				toast({ title: '下载完成', description: '文件已成功下载', duration: Infinity })
			},
			onopen() {
				setIsDownloading(true)
				return Promise.resolve()
			},
			onclose() {
				setIsDownloading(false)
			},
			onerror(err) {
				console.log('error', err)
				return 3600 * 1000
			}
		})
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 overflow-hidden">
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxsaW5lIHgxPSIwIiB5PSIwIiB4Mj0iMCIgeTI9IjQwIiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]" />
			<Card className="w-full max-w-3xl bg-gray-900/70 backdrop-blur-xl border-gray-700 shadow-2xl relative z-10">
				<CardHeader className="border-b border-gray-700">
					<CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">HLS Downloader</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
						<div className="relative">
							<Input {...register('url')} required placeholder="https://example.com/video.m3u8" className="bg-gray-800/50 border-gray-600 text-gray-100 pr-32" />
							<button type="submit" className="absolute right-1 top-1 bottom-1 w-28 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center overflow-hidden">
								{isDownloading ? (
									<div className="absolute inset-0 flex items-center justify-center">
										<div
											className="absolute inset-0 bg-gray-900"
											style={{
												clipPath: `inset(0 ${100 - progress}% 0 0)`,
												transition: 'clip-path 0.3s ease-in-out'
											}}
										/>
										<span className="text-white font-bold relative z-10">{progress}%</span>
									</div>
								) : (
									<span className="text-white font-bold flex items-center">
										<Download className="mr-2 h-4 w-4" /> Download
									</span>
								)}
							</button>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="proxy" className="text-gray-300">
									Proxy
								</Label>
								<Select onValueChange={(value) => setValue('proxy', value)}>
									<SelectTrigger id="proxy" className="bg-gray-800/50 border-gray-600 text-gray-100">
										<SelectValue placeholder="Select proxy" />
									</SelectTrigger>
									<SelectContent className="bg-gray-800 border-gray-600">
										<SelectItem value="none">None</SelectItem>
										<SelectItem value="http">HTTP</SelectItem>
										<SelectItem value="socks5">SOCKS5</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="threads" className="text-gray-300">
									Threads
								</Label>
								<div className="flex items-center space-x-2">
									<Slider value={[threads]} onValueChange={(value) => setValue('threads', value[0])} id="threads" min={1} max={16} step={1} className="flex-grow" />
									<span className="text-gray-300 w-8 text-center">{threads}</span>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="output" className="text-gray-300">
								Output Directory
							</Label>
							<Input {...register('directory')} id="output" placeholder="/path/to/output" className="bg-gray-800/50 border-gray-600 text-gray-100" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="filename" className="text-gray-300">
								Filename
							</Label>
							<Input {...register('filename')} id="filename" placeholder="video.mp4" className="bg-gray-800/50 border-gray-600 text-gray-100" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="headers" className="text-gray-300">
								Custom Headers
							</Label>
							<Textarea {...register('headers')} id="headers" placeholder="user-agent: Mozilla/5.0..." className="h-24 bg-gray-800/50 border-gray-600 text-gray-100" />
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex justify-end border-t border-gray-700 p-6">
					<Button variant="outline" className="bg-gray-800/50 text-gray-100 border-gray-600 hover:bg-gray-700">
						<Play className="mr-2 h-4 w-4" /> Preview
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
