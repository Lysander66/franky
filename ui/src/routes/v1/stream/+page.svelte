<script>
	import { onMount } from 'svelte'
	import { MEDIA_LIST_URL } from '$lib/api'
	import { formatTimeOnly } from '$lib/time'
	import { define } from '$lib/enum'
	import { toast } from 'svelte-sonner'

	let data = {}

	let app = ''

	const defaultColumns = [
		'#',
		'region',
		'local',
		'alive',
		'remote',
		'vcodec',
		'resolution',
		'bit rate',
		'publish time',
		'fps',
		'sample',
		'createdAt',
		'url'
	]

	onMount(async () => {
		await fetchData()
	})

	async function fetchData() {
		const rawURL = MEDIA_LIST_URL + `?app=${app}`
		const response = await fetch(rawURL)
		const resp = await response.json()
		// if (resp.code !== 0) { }
		data = resp.data
		return resp.data
	}

	function handleAppChange(event) {
		// event.target.value
		fetchData()
	}

	function copyToClipboard(url) {
		navigator.clipboard
			.writeText(url)
			.then(() => {
				toast.success('Copied')
			})
			.catch((error) => {
				toast.error('复制到剪贴板时出错')
				console.error('复制到剪贴板时出错:', error)
			})
	}
</script>

<svelte:head>
	<title>直播流</title>
</svelte:head>

<div>
	<div
		class="flex w-full flex-wrap items-center justify-between rounded-2xl px-12 py-6 md:flex-nowrap"
	>
		<h3 class="m-0 flex items-center text-lg font-medium">电竞/体育 视频直播</h3>

		<div class="text-end">
			<form class="flex w-full space-x-3">
				<div class="relative flex items-center">
					<select
						bind:value={app}
						on:change={() => handleAppChange()}
						id="subscription-type"
						class="mr-2 appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
					>
						{#each define.apps as v}
							<option value={v.id}>
								{v.text}
							</option>
						{/each}
					</select>
					<input
						type="text"
						id="form-subscribe-Filter"
						class="w-full flex-1 appearance-none rounded-lg border border-gray-300 border-transparent bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
						placeholder="Filter..."
					/>
				</div>
				<button
					on:click={() => fetchData()}
					type="button"
					class="flex-shrink-0 rounded-lg bg-gray-600 px-4 py-2 text-base font-semibold text-white shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
				>
					Search
				</button>
			</form>
		</div>
	</div>

	{#if data.list && data.list.length > 0}
		<div class="mt-8 rounded-2xl" style="background-color: rgba(158, 158, 158, 0.3)">
			<div class="container mx-auto">
				<div class="py-8">
					<div class="py-4">
						<div class="overflo·w-x-auto max-w-full rounded-lg">
							<table class="w-full leading-normal text-black">
								<thead>
									<tr>
										{#each defaultColumns as v}
											<th
												scope="col"
												class="border-b border-gray-200 px-5 py-3 text-left text-sm font-normal uppercase"
											>
												{v}
											</th>
										{/each}
									</tr>
								</thead>
								<tbody>
									{#each data.list as v, i}
										<tr>
											<td class="border-b border-gray-200 px-5 py-5 text-sm"> {i + 1}</td>

											<td class="border-b border-gray-200 px-5 py-5 text-sm"
												><a
													href="http://{v.ip}:8281/api/v1/stat/allGroup?schema=rtmp"
													target="_blank">{v.region}</a
												></td
											>

											<td class="border-b border-gray-200 px-5 py-5 text-sm">
												<a
													href="/player?u=http://{v.ip}:8280/{v.app}/{v.stream}/hls.m3u8"
													target="_blank">{v.stream}</a
												></td
											>

											<td class="border-b border-gray-200 px-5 py-5 text-sm">
												{Math.floor(v.alive_second / 60) + 'm ' + (v.alive_second % 60) + 's'}</td
											>

											<td class="border-b border-gray-200 px-5 py-5 text-sm">
												<a href="/player?u={v.link}" target="_blank">{v.link ? 'play' : ''}</a></td
											>

											<td class="border-b border-gray-200 px-5 py-5 text-sm"> {v.vcodec}</td>

											<td class="border-b border-gray-200 px-5 py-5 text-sm">
												{`${v.width} x ${v.height}`}</td
											>

											<td class="border-b border-gray-200 px-5 py-5 text-sm">
												{((v.bytes_speed * 8) / 1000 / 1000).toFixed(2)} Mbps</td
											>

											<td class="border-b border-gray-200 px-5 py-5 text-sm"> {v.publish_time}</td>

											<td class="border-b border-gray-200 px-5 py-5 text-sm"> {v.fps}</td>

											<td class="border-b border-gray-200 px-5 py-5 text-sm">
												{`${v.sample_rate} x ${v.sample_bit}`}</td
											>

											<td class="border-b border-gray-200 px-5 py-5 text-sm">
												{formatTimeOnly(v.create_stamp)}</td
											>

											<td class="border-b border-gray-200 px-5 py-5 text-sm">
												<button
													on:click={() =>
														copyToClipboard(v.origin_url.replace(/\?\?referer=.*?&&/, ''))}
													class="text-indigo-600 hover:text-indigo-900"
												>
													copy
												</button>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<p>No data</p>
	{/if}
</div>

<style>
	a {
		/* color: #0000ff; */
		/* text-decoration: underline; */
	}

	a:hover {
		color: #0000ff;
		text-decoration: underline;
	}

	a:visited {
		color: #800080;
	}

	a:visited:hover {
		color: #800080;
		text-decoration: underline;
	}
</style>
