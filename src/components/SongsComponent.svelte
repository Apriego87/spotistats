<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js'
	import * as Card from '$lib/components/ui/card'
	import * as Tabs from '$lib/components/ui/tabs'

	export let songs, recentlyPlayedSongs

	let searchTerm = ''

	// Function to normalize string by removing special characters
	function normalizeString(str: string) {
		return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
	}

	// Filtered songs based on search term
	$: filteredSongs = songs.filter((song) => {
		const normalizedSearch = normalizeString(searchTerm.toLowerCase())

		// Check if the search term matches song name or any artist's name
		return (
			normalizeString(song.name.toLowerCase()).includes(normalizedSearch) ||
			song.artists.some((artist) =>
				normalizeString(artist.name.toLowerCase()).includes(normalizedSearch)
			)
		)
	})
</script>

<Card.Root
	class="max-w-screen isolate flex h-[50vh] w-full flex-col overflow-hidden rounded-xl border bg-white/20 text-white shadow-lg ring-1 ring-black/5 "
>
	<Card.Header class="flex-shrink-0">
		<Card.Title>
			<div class="flex flex-col items-center gap-2 md:flex-row">
				<p class="w-full text-3xl md:w-1/5">Tus Canciones</p>
				<!-- Search Bar -->
				<div class="w-full md:w-4/5">
					<input
						type="text"
						bind:value={searchTerm}
						placeholder="Busca por canción o artista..."
						class="w-full rounded border-white bg-white/20 p-2 text-white shadow-lg ring-1"
					/>
				</div>
			</div>
		</Card.Title>
	</Card.Header>
	<Card.Content class="no-scrollbar flex-grow overflow-auto">
		<Tabs.Root value="top" class="w-full">
			<Tabs.List class="bg-white/20 text-white shadow-lg ring-1 ring-black/5 ">
				<Tabs.Trigger value="top">Top</Tabs.Trigger>
				<Tabs.Trigger value="recent">Recientes</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="top">
				<div class="no-scrollbar">
					{#each filteredSongs as song, index}
						<div class="w-fit">
							<a
								href={song.external_urls.spotify}
								target="_blank"
								class="flex w-full flex-row items-center gap-4 p-2"
							>
								<p class="font-bold">{index + 1}</p>
								<img
									class="size-12 rounded-full object-cover"
									src={song.album.images[0].url}
									alt={song.name}
								/>
								<div>
									<p class="font-bold">{song.name}</p>
									<div class="flex flex-row flex-wrap">
										{#each song.artists as artist, index}
											<p class="text-sm">
												{artist.name}{index !== song.artists.length - 1 ? ', ' : ''}
											</p>
										{/each}
									</div>
								</div>
							</a>
						</div>
						{#if index < filteredSongs.length - 1}
							<Separator class="my-2" />
						{/if}
					{/each}
				</div>
			</Tabs.Content>
			<Tabs.Content value="recent">
				{#each recentlyPlayedSongs.items as song, index}
					<div class="w-fit">
						<a
							href={song.track.external_urls.spotify}
							target="_blank"
							class="flex w-full flex-row items-center gap-4 p-2"
						>
							<p>{index + 1}</p>
							<img
								class="size-12 rounded-full object-cover"
								src={song.track.album.images[0].url}
								alt={song.name}
							/>
							<div>
								<p class="font-bold">{song.track.name}</p>

								<div class="flex flex-row flex-wrap">
									{#each song.track.artists as artist, index}
										<p class="text-sm">
											{artist.name}{index !== song.track.artists.length - 1 ? ', ' : ''}
										</p>
									{/each}
								</div>
								<p class="text-xs">
									{`${new Date(song.played_at).getUTCDate()}/${new Date(song.played_at).getUTCMonth() + 1}, ${new Date(song.played_at).getUTCHours()}:${new Date(song.played_at).getUTCMinutes()}`}
								</p>
							</div>
						</a>
					</div>
					{#if index < songs.length - 1}
						<Separator class="my-2" />
					{/if}
				{/each}
			</Tabs.Content>
		</Tabs.Root>
	</Card.Content>
</Card.Root>
