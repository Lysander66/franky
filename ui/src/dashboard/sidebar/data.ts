import AllAppsIcon from './icons/AllAppsIcon.svelte'
import DocumentationIcon from './icons/DocumentationIcon.svelte'
import EventsIcon from './icons/EventsIcon.svelte'
import MediasIcon from './icons/MediasIcon.svelte'
import PicturesIcon from './icons/PicturesIcon.svelte'
import RecycleBin from './icons/RecycleBin.svelte'
import StatisticsIcon from './icons/StatisticsIcon.svelte'
import TerminalIcon from './icons/TerminalIcon.svelte'
import UpdatesIcon from './icons/UpdatesIcon.svelte'
import UserIcon from './icons/UserIcon.svelte'

export const data = [
	{
		section: 'Apps',
		content: [
			{
				title: 'HOME',
				icon: AllAppsIcon,
				link: '/'
			},
			{
				title: 'Calendar',
				icon: EventsIcon,
				link: '/v1/calendar'
			},
			{
				title: 'Live Stream',
				icon: PicturesIcon,
				link: '/v1/stream'
			},
			{
				title: 'HLS Downloader',
				icon: PicturesIcon,
				link: '/v1/hls-downloader'
			}
		]
	},
	{
		section: 'Categories',
		content: [
			{
				title: 'Stream Player',
				icon: MediasIcon,
				link: '/player'
			}
		]
	}
]
