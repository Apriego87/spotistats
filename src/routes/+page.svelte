<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import spotify from '$lib/spotify.svg'

	export let data

	const clientId = data.clientID
	const redirectUri = data.redirectURI
	const state = 'some-random-state'
	const scopes =
		'user-read-private user-read-playback-state user-read-email user-top-read user-read-currently-playing user-read-recently-played user-modify-playback-state'

	const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`

	function login() {
		window.location.href = url
	}
</script>

<main
	class="flex h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-green-700 from-10% via-green-900 via-20% to-black p-5 text-secondary"
>
	<div
		class="flex h-1/4 w-full flex-col items-center justify-center gap-4 rounded-xl bg-white/20 text-white shadow-lg ring-1 ring-black/5 md:w-1/4"
	>
		<div class="flex flex-col">
			<h1 class="text-center text-4xl text-white">
				Spoti<span
					class="bg-gradient-to-r from-green-200 to-green-500 bg-clip-text text-transparent"
					>Stats</span
				>
			</h1>
			<i class="text-l text-center text-white">by toñ</i>
		</div>
		<div>
			<Button class="bg-green-700" on:click={login}>Iniciar sesión</Button>
		</div>
	</div>
</main>
