<script>
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import * as utils from '$lib/utils.js'
	import HLSPlayer from '$lib/components/HLSPlayer.svelte'
	import FLVPlayer from '$lib/components/FLVPlayer.svelte'

	let streamURL = $page.url.searchParams.get('u')
	let streamType = ''

	onMount(() => {
		if (streamURL) {
			streamType = utils.detectUrlType(streamURL)
			console.log(streamURL)
			console.log(streamType)
		}
	})
</script>

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
		background-image: url('deepsea.webp');
		background-size: cover;
		background-position: center;
		min-height: 100vh;
		min-width: 100vw;
	}

	.video {
		margin: 0 0 7rem 0;
	}
</style>
