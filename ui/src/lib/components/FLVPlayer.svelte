<script>
	import { onMount, onDestroy, afterUpdate } from 'svelte'

	// 在客户端渲染时加载 https://github.com/xqq/mpegts.js
	let mpegts

	let player
	let videoElement
	export let streamURL

	onMount(async () => {
		mpegts = (await import('mpegts.js')).default
		initPlayer()
	})

	afterUpdate(() => {
		if (streamURL) {
			initPlayer()
		}
	})

	onDestroy(() => {
		if (player) {
			player.destroy()
		}
	})

	function initPlayer() {
		player = mpegts.createPlayer({
			type: 'mse', // could also be mpegts, m2ts, flv
			isLive: true,
			url: streamURL
		})
		player.attachMediaElement(videoElement)
		player.load()
		player.play()
	}
</script>

<video bind:this={videoElement} controls autoplay>
	<track default kind="captions" />
</video>
