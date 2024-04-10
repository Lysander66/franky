<script>
	import '../../app.pcss'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import * as utils from '$lib/utils.js'
	import HLSPlayer from '$lib/components/HLSPlayer.svelte'
	import FLVPlayer from '$lib/components/FLVPlayer.svelte'

	let streamURL =
		$page.url.searchParams.get('u') ||
		'https://test-streams.mux.dev/x36xhzz/url_8/193039199_mp4_h264_aac_fhd_7.m3u8'

	let streamType = ''

	onMount(() => {
		if (streamURL) {
			streamType = utils.detectUrlType(streamURL)
		}
	})
</script>

<svelte:head>
	<title>播放器</title>
</svelte:head>

<div class="container">
	<div class="video">
		{#if streamType === 'm3u8'}
			<HLSPlayer {streamURL} />
		{:else if streamType === 'flv'}
			<FLVPlayer {streamURL} />
		{/if}
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		background-image: url('/images/deepsea.webp');
		background-size: cover;
		background-position: center;
		min-height: 100vh;
		min-width: 100vw;
	}

	.video {
		margin: 0 0 7rem 0;
	}
</style>
