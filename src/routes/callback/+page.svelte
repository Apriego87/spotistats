<script lang="ts">
	import type { PageData } from '../$types'
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	export let data: PageData

	if (browser) {
		const accessToken = localStorage.getItem('access_token')

		if (!accessToken) {
			localStorage.setItem('access_token', data.access_token)
			localStorage.setItem('refresh_token', data.refresh_token)
			localStorage.setItem('expires_in', data.expires_in)
			localStorage.setItem('expires', data.expiry)
			console.log(data)
		}

		goto('/profile')
	}
</script>

<main class="flex h-screen w-full flex-col items-center justify-center text-white">
	<h1>Authenticating...</h1>
</main>
