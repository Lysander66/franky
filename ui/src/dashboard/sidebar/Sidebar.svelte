<script>
	import { sidebarOpen } from '../store.ts'
	import SidebarItems from './SidebarItems.svelte'
	import SidebarHeader from './SidebarHeader.svelte'

	const style = {
		mobileOrientation: {
			start: 'left-0',
			end: 'right-0'
		}
	}

	export let mobileOrientation = 'end'
</script>

<aside
	class={`
	  	scrollbar
	  	top-0
	  	h-screen
      overflow-y-auto
      bg-gray-200
      lg:relative lg:block lg:w-64 lg:bg-transparent
      ${style.mobileOrientation[mobileOrientation]}
      ${$sidebarOpen ? 'absolute z-40 w-8/12 sm:w-5/12' : 'hidden'}
   `}
>
	<div class="pb-32 lg:pb-6">
		<SidebarHeader />
		<SidebarItems />
	</div>
</aside>

<style>
	.scrollbar::-webkit-scrollbar {
		width: 0;
		background: transparent; /* hide Sidebar scrollbar on Chrome, Opera and other webkit Browsers*/
	}
	.scrollbar {
		-ms-overflow-style: none;
	}
</style>
