<script>
	import { onMount, onDestroy, afterUpdate } from 'svelte'
	import Hls from 'hls.js'

	export let streamURL
	let videoElement
	let player

	onMount(() => {
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

	// https://github.com/video-dev/hls.js
	function initPlayer() {
		if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
			videoElement.src = streamURL
			videoElement.addEventListener('canplay', () => {
				videoElement.play()
			})
			console.log('native browser')
			return
		}

		if (Hls.isSupported()) {
			player = new Hls()
			player.loadSource(streamURL)
			player.attachMedia(videoElement)
			player.on(Hls.Events.MANIFEST_PARSED, () => {
				videoElement.play()
			})
			console.log('HLS.js')
			return
		}
	}
</script>

<video bind:this={videoElement} controls autoplay>
	<track default kind="captions" />
</video>
