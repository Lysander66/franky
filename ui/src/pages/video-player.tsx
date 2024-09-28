import ReactPlayer from 'react-player'
import { useSearchParams } from 'react-router-dom'
import styles from './video-player.module.css'

export const VideoPlayer = () => {
	let [searchParams] = useSearchParams()
	const url = searchParams.get('u') || 'https://test-streams.mux.dev/x36xhzz/url_8/193039199_mp4_h264_aac_fhd_7.m3u8'
	return (
		<div className={styles.container}>
			<div className={styles.video}>
				<ReactPlayer url={url} width="1920" height="1080" playing controls />
			</div>
		</div>
	)
}
