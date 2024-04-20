<script>
	import { DOWNLOAD_HLS_URL } from '$lib/api'
	import { toast } from 'svelte-sonner'
	import { fetchEventSource } from '@microsoft/fetch-event-source'

	const placeholder = `{
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
}`

	let formData = {
		url: '',
		name: '',
		directory: '',
		num_parallel: 1,
		use_proxy: 1
	}

	// https://svelte.dev/examples/tweened
	let progress = 0
	let downloading = false

	async function handleSubmit() {
		if (downloading) {
			toast.info('请等待下载完成')
			return
		}

		const data = {
			url: formData.url,
			name: formData.name,
			directory: formData.directory,
			num_parallel: formData.num_parallel,
			use_proxy: formData.use_proxy
		}
		if (formData.headers && formData.headers != '') {
			data.headers = JSON.parse(formData.headers)
		} else {
			data.headers = { 'user-agent': navigator.userAgent }
		}

		fetchEventSource(DOWNLOAD_HLS_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			onmessage(ev) {
				const eventData = JSON.parse(ev.data)
				if (eventData.completed !== 1) {
					progress = ((100 * eventData.n) / eventData.total).toFixed(1)
				}
			},
			onopen() {
				downloading = true
			},
			onclose() {
				downloading = false
			},
			onerror(err) {
				console.log('error', err)
				return 3600 * 1000
			}
		})
	}
</script>

<svelte:head>
	<title>m3u8 下载</title>
</svelte:head>

<div
	class="radial-progress float-left ml-20 mt-20 text-success"
	style="--value:{progress}; --size:12rem; --thickness: 5px;"
	role="progressbar"
>
	{progress}%
</div>

<div class="relative mx-auto my-6 w-2/4 max-w-3xl">
	<div
		style="background-color: rgba(158, 158, 158, 0.3)"
		class="relative flex w-full flex-col rounded-lg border-0 shadow-lg outline-none focus:outline-none"
	>
		<form on:submit|preventDefault={handleSubmit}>
			<div class="relative flex-auto p-6">
				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text"></span>
					</div>
					<select bind:value={formData.use_proxy} class="select select-bordered">
						<option value={0}> 直连 </option>
						<option value={1}> 代理 </option>
					</select>
				</label>

				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">协程数</span>
					</div>
					<input
						bind:value={formData.num_parallel}
						type="number"
						min="1"
						max="50"
						class="input input-bordered w-full"
					/>
				</label>

				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">目录</span>
					</div>
					<input bind:value={formData.directory} type="text" class="input input-bordered w-full" />
				</label>

				<label class="form-control w-full max-w-xs">
					<div class="label">
						<span class="label-text">文件名</span>
					</div>
					<input bind:value={formData.name} type="text" class="input input-bordered w-full" />
				</label>

				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">URL</span>
					</div>
					<input
						bind:value={formData.url}
						required
						type="text"
						class="input input-bordered w-full"
					/>
				</label>

				<label class="form-control">
					<div class="label">
						<span class="label-text">Headers</span>
					</div>
					<textarea
						bind:value={formData.headers}
						class="textarea textarea-bordered h-48"
						{placeholder}
					/>
				</label>
			</div>
			<div
				class="border-blueGray-200 flex items-center justify-end rounded-b border-t border-solid p-6"
			>
				<button class="btn btn-primary">Download</button>
			</div>
		</form>
	</div>
</div>

<style>
	select {
		background-color: #f0f0f0;
	}
	input {
		background-color: #f0f0f0;
	}
	textarea {
		background-color: #f0f0f0;
	}
</style>
