<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import spotify from '$lib/spotify.svg'

	const clientId = 'a8424c358de44bfc9a1a344985cc703a'
	const redirectUri = 'http://localhost:5173/callback'
	const state = 'some-random-state' // A random state string for CSRF protection
	const scopes = 'user-read-private user-read-email user-top-read user-read-currently-playing user-read-recently-played'

	const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`

	function login() {
		window.location.href = url
	}
</script>

<main
	class="flex h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-green-700 from-10% via-green-900 via-20% to-black p-5 text-secondary"
>
	<div
		class="flex h-1/4 w-full flex-col items-center justify-center gap-4 rounded-xl bg-white/20 text-white shadow-lg ring-1 ring-black/5 backdrop-blur md:w-1/4"
	>
		<div>
			<h1 class="text-center text-4xl text-white">
				Spoti<span
					class="bg-gradient-to-r from-green-200 to-green-500 bg-clip-text text-transparent"
					>Stats</span
				>
			</h1>
		</div>
		<div>
			<Button class="bg-green-700" on:click={login}>Iniciar sesión</Button>
		</div>
	</div>
</main>
