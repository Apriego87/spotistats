<script lang="ts">
	import type { PageData } from '../$types'
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	export let data: PageData

	if (browser) {
		localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('expires', data.expires)

		goto('/profile')
	}

	console.log(data)
</script>
