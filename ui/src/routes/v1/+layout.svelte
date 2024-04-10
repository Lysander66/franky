<script>
	import '../../app.pcss'
	import Layout from '../../dashboard/Layout.svelte'
	import { Toaster } from 'svelte-sonner'
</script>

<Layout>
	<slot />
</Layout>

<Toaster richColors position="top-right" />
