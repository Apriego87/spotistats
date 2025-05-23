<script lang="ts">
	import { browser } from '$app/environment'
	import ArtistsComponent from '../../components/ArtistsComponent.svelte'
	import SongsComponent from '../../components/SongsComponent.svelte'
	import ProfileComponent from '../../components/ProfileComponent.svelte'
	import GenresComponent from '../../components/GenresComponent.svelte'
	import * as Select from '$lib/components/ui/select'
	import * as Drawer from '$lib/components/ui/drawer'
	import * as Popover from '$lib/components/ui/popover'
	import { Button } from '$lib/components/ui/button'
	import { onMount, onDestroy } from 'svelte'
	import { goto } from '$app/navigation'

	let datos: any = null
	let profileInfo: any[] = []
	let artists: any[] = []
	let songs: any[] = []
	let genres: any[] = []
	let currentlyPlayingContent: any[] = []
	let recently_played: any[] = []
	let timeRange: string = 'medium_term'
	let limit: number = 20

	import { CaretUp } from 'svelte-radix'

	let intervalId: number

	if (browser) {
		const expires = localStorage.getItem('expires')

		if (expires) {
			if (new Date(expires) <= new Date()) {
				goto(`/refreshToken?refresh_token=${localStorage.getItem('refresh_token')}`)
			}
		} else {
			goto('/')
		}
	}

	async function getProfileInfo() {
		let accessToken = localStorage.getItem('access_token')
		const response = await fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: 'Bearer ' + accessToken
			}
		})
		const data = await response.json()
		return data
	}

	async function getRecentlyPlayed() {
		let accessToken = localStorage.getItem('access_token')
		const response = await fetch(
			`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
			{
				headers: {
					Authorization: 'Bearer ' + accessToken
				}
			}
		)
		const data = await response.json()
		return data
	}

	async function getCurrentlyPlaying() {
		let accessToken = localStorage.getItem('access_token')
		let data
		const response = await fetch(
			'https://api.spotify.com/v1/me/player/currently-playing?additional_types=episode',
			{
				headers: {
					Authorization: 'Bearer ' + accessToken
				}
			}
		)
		if (response.status === 204) {
			return null
		} else {
			data = await response.json()
		}
		return data
	}

	async function getTopArtists(timeRange: string, limit: number) {
		let accessToken = localStorage.getItem('access_token')
		const response = await fetch(
			`https://api.spotify.com/v1/me/top/artists?limit=${limit}&offset=0&time_range=${timeRange}`,
			{
				headers: {
					Authorization: 'Bearer ' + accessToken
				}
			}
		)
		const data = await response.json()

		const genreToArtistsMap: { [genre: string]: string[] } = {}

		data.items.forEach((artist) => {
			artist.genres.forEach((genre) => {
				if (!genreToArtistsMap[genre]) {
					genreToArtistsMap[genre] = []
				}
				genreToArtistsMap[genre].push(artist.name)
			})
		})

		const genresWithArtists = Object.keys(genreToArtistsMap).map((genre) => ({
			genre,
			artists: genreToArtistsMap[genre]
		}))

		const limitedGenres = genresWithArtists.slice(0, limit)

		return { data, genres: limitedGenres }
	}

	async function getTopSongs(timeRange: string, limit: number) {
		let accessToken = localStorage.getItem('access_token')
		const response = await fetch(
			`https://api.spotify.com/v1/me/top/tracks?limit=${limit}&offset=0&time_range=${timeRange}&market=ES`,
			{
				headers: {
					Authorization: 'Bearer ' + accessToken
				}
			}
		)
		const data = await response.json()
		return data
	}

	async function fetchData() {
		if (browser) {
			if (localStorage.getItem('access_token')) {
				try {
					const [profile, topArtists, topSongs, currentlyPlaying, recentlyPlayed] =
						await Promise.all([
							getProfileInfo(),
							getTopArtists(timeRange, limit),
							getTopSongs(timeRange, limit),
							getCurrentlyPlaying(),
							getRecentlyPlayed()
						])
					datos = profile
					profileInfo = profile
					artists = topArtists.data.items
					genres = new Set(topArtists.genres)
					songs = topSongs.items
					currentlyPlayingContent = currentlyPlaying
					recently_played = recentlyPlayed
				} catch (error) {
					console.error('Error fetching data:', error)
				}
			}
		}
	}

	function handleTimeRangeChange(event: Event) {
		timeRange = event.value
		fetchData()
	}

	function handleLimitChange(event: Event) {
		limit = parseInt(event.value, 10)
		fetchData()
	}

	async function checkSongChanges() {
		const newCurrentlyPlaying = await getCurrentlyPlaying()
		if (
			newCurrentlyPlaying &&
			JSON.stringify(newCurrentlyPlaying) !== JSON.stringify(currentlyPlayingContent)
		) {
			await fetchData()
		}
	}

	const pollingInterval = 3000

	onMount(() => {
		fetchData()
		intervalId = setInterval(checkSongChanges, pollingInterval)
	})

	onDestroy(() => {
		clearInterval(intervalId)
	})

	let selected_time = { value: 'medium_term', label: '6 meses' }
	let selected_amount = { value: '20', label: '20' }
</script>

<div
	class="flex flex-col items-center justify-between gap-4 bg-gradient-to-b from-green-700 from-10% via-green-900 via-20% to-black p-5 text-secondary"
>
	<!-- <a href="/refreshToken?refresh_token={localStorage.getItem('refresh_token')}">Refrescar token</a> -->
	{#if datos}
		<ProfileComponent {profileInfo} {currentlyPlayingContent} />
		<div class="sticky top-0 isolate z-10 flex w-full flex-row justify-end gap-4">
			{#if window.matchMedia('(max-width: 768px)').matches}
				<Drawer.Root>
					<Drawer.Trigger class="fixed bottom-6 right-6 z-50">
						<Button
							variant="secondary"
							class="flex h-10 w-10 items-center justify-center rounded-full p-0 shadow-lg"
						>
							<CaretUp></CaretUp>
						</Button>
					</Drawer.Trigger>
					<Drawer.Content>
						<Drawer.Header>
							<Drawer.Title>Filtros de contenido</Drawer.Title>
							<Drawer.Description>
								<p>
									Aquí puedes elegir cuántos elementos mostrar, y desde cuándo filtrar los datos.
								</p>
							</Drawer.Description>
						</Drawer.Header>
						<div class="flex w-full flex-row justify-between gap-4 p-5">
							<Select.Root bind:selected={selected_amount} onSelectedChange={handleLimitChange}>
								<Select.Trigger class="min-w-1/2 w-1/2">
									<Select.Value placeholder="Cantidad" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="10">10</Select.Item>
									<Select.Item value="20">20</Select.Item>
									<Select.Item value="50">50</Select.Item>
								</Select.Content>
							</Select.Root>

							<Select.Root bind:selected={selected_time} onSelectedChange={handleTimeRangeChange}>
								<Select.Trigger class="min-w-1/2 w-1/2">
									<Select.Value placeholder="Tiempo" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="short_term">4 semanas</Select.Item>
									<Select.Item value="medium_term">6 meses</Select.Item>
									<Select.Item value="long_term">siempre</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>
					</Drawer.Content>
				</Drawer.Root>
			{:else}
				<Popover.Root>
					<Popover.Trigger class="fixed bottom-6 right-6 z-50">
						<Button
							variant="secondary"
							class="flex h-10 w-10 items-center justify-center rounded-full p-0 shadow-lg"
						>
							<CaretUp></CaretUp>
						</Button>
					</Popover.Trigger>

					<Popover.Content
						class="flex w-auto flex-row rounded-xl border-transparent bg-white/20 p-0 text-white"
					>
						<div
							class="flex w-full flex-col gap-4 rounded-xl border bg-white p-5 text-center text-black shadow-lg ring-1 ring-black/5 lg:w-auto lg:min-w-[33vw]"
						>
							<h1><b>Filtros de contenido</b></h1>
							<p>Aquí puedes elegir cuántos elementos mostrar, y desde cuándo filtrar los datos.</p>
							<div class="flew-row flex w-full gap-4">
								<Select.Root bind:selected={selected_amount} onSelectedChange={handleLimitChange}>
									<Select.Trigger class="min-w-1/2 w-1/2">
										<Select.Value placeholder="Cantidad" />
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="10">10</Select.Item>
										<Select.Item value="20">20</Select.Item>
										<Select.Item value="50">50</Select.Item>
									</Select.Content>
								</Select.Root>
								<Select.Root bind:selected={selected_time} onSelectedChange={handleTimeRangeChange}>
									<Select.Trigger class="min-w-1/2 w-1/2">
										<Select.Value placeholder="Tiempo" />
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="short_term">4 semanas</Select.Item>
										<Select.Item value="medium_term">6 meses</Select.Item>
										<Select.Item value="long_term">siempre</Select.Item>
									</Select.Content>
								</Select.Root>
							</div>
						</div>
					</Popover.Content>
				</Popover.Root>
			{/if}
		</div>
		<ArtistsComponent {artists} />
		<GenresComponent {genres} />
		<SongsComponent {songs} {recently_played} />
	{:else}
		<div class="flex h-screen flex-col items-center justify-center">
			<p>Cargando...</p>
		</div>
	{/if}
</div>
