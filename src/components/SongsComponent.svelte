<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js'
	import * as Card from '$lib/components/ui/card'
	import * as Tabs from '$lib/components/ui/tabs'

	export let songs, recently_played

	let search_term = ''
	$: indexed_songs = songs.map((song, index) => ({ ...song, original_index: index + 1 }))
	$: indexed_recents = recently_played.items.map((song, index) => ({
		...song,
		original_index: index + 1
	}))

	// Function to normalize string by removing special characters
	function normalize_string(str: string) {
		return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
	}

	// Filtered songs based on search term
	$: filtered_songs = indexed_songs.filter((song) => {
		const normalized_search = normalize_string(search_term.toLowerCase())

		// Check if the search term matches song name or any artist's name
		return (
			normalize_string(song.name.toLowerCase()).includes(normalized_search) ||
			song.artists.some((artist) =>
				normalize_string(artist.name.toLowerCase()).includes(normalized_search)
			)
		)
	})

	$: filtered_recents = indexed_recents.filter((song) => {
		const normalized_search = normalize_string(search_term.toLowerCase())

		return (
			normalize_string(song.track.name.toLowerCase()).includes(normalized_search) ||
			song.track.artists.some((artist) =>
				normalize_string(artist.name.toLowerCase()).includes(normalized_search)
			)
		)
	})
</script>

<Card.Root
	class={`max-w-screen isolate flex w-full flex-col overflow-hidden rounded-xl border bg-white/20 text-white shadow-lg ring-1 ring-black/5 ${
		filtered_songs && filtered_songs.length === 0 ? 'h-auto' : 'h-[67vh]'
	}`}
>
	<Card.Header class="flex-shrink-0">
		<Card.Title>
			<div class="flex flex-col items-center gap-2 md:flex-row">
				<p class="w-full text-3xl md:w-1/5">Tus Canciones</p>
				<!-- Search Bar -->
				<div class="w-full md:w-4/5">
					<input
						type="text"
						bind:value={search_term}
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
					{#if filtered_songs.length == 0 || filtered_songs == null || filtered_songs == ''}
						<div
							class="flex-column m-2 flex h-full w-full items-center justify-center p-2 text-center"
						>
							<b>No se han encontrado resultados</b>
						</div>
					{:else}
						{#each filtered_songs as song}
							<div class="w-fit">
								<a
									href={song.external_urls.spotify}
									target="_blank"
									class="flex w-full flex-row items-center gap-4 p-2"
								>
									<p class="font-bold">{song.original_index}</p>
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
							{#if song.original_index < songs.length}
								<Separator class="my-2" />
							{/if}
						{/each}
					{/if}
				</div>
			</Tabs.Content>
			<Tabs.Content value="recent">
				{#if filtered_songs.length == 0 || filtered_songs == null || filtered_songs == ''}
					<div
						class="flex-column m-2 flex h-full w-full items-center justify-center p-2 text-center"
					>
						<b>No se han encontrado resultados</b>
					</div>
				{:else}
					{#each filtered_recents as song}
						<div class="w-fit">
							<a
								href={song.track.external_urls.spotify}
								target="_blank"
								class="flex w-full flex-row items-center gap-4 p-2"
							>
								<p>{song.original_index}</p>
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
										{(() => {
											const date = new Date(song.played_at)
											const day = String(date.getDate()).padStart(2, '0')
											const month = String(date.getMonth() + 1).padStart(2, '0')
											const hours = String(date.getHours()).padStart(2, '0') // Local hours
											const minutes = String(date.getMinutes()).padStart(2, '0')
											return `${day}/${month}, ${hours}:${minutes}`
										})()}
									</p>
								</div>
							</a>
						</div>
						{#if song.original_index < songs.length}
							<Separator class="my-2" />
						{/if}
					{/each}
				{/if}
			</Tabs.Content>
		</Tabs.Root>
	</Card.Content>
</Card.Root>
