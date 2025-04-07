<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar'
	import * as Card from '$lib/components/ui/card'
	import Badge from '$lib/components/ui/badge/badge.svelte';

	export let profileInfo, currentlyPlayingContent

	async function pause() {
		let accessToken = localStorage.getItem('access_token')
		await fetch('https://api.spotify.com/v1/me/player/pause', {
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + accessToken
			}
		})
	}

	async function play() {
		let accessToken = localStorage.getItem('access_token')
		await fetch('https://api.spotify.com/v1/me/player/play', {
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + accessToken
			}
		})
	}
</script>

<Card.Root
	class="max-w-screen isolate w-full rounded-xl bg-white/20 text-white shadow-lg ring-1 ring-black/5  sm:h-1/3 md:h-1/3 lg:h-auto"
>
	<Card.Header>
		<Card.Title>
			<p class="text-3xl">Tu Perfil</p>
		</Card.Title>
		<Card.Content class="p-0 lg:p-5">
			<div class="mt-2 flex w-full flex-col items-center gap-4 md:flex-row lg:flex-row">
				<div class="flex w-full flex-row">
					<div class="flex w-1/3 flex-col items-center justify-center">
						<Avatar.Root
								class="size-24 overflow-hidden rounded-full border-2 md:size-24 lg:size-36"
							>
								<Avatar.Image
									src={profileInfo.images[0]?.url}
									alt=""
									class="h-full w-full object-cover"
								/>
								<Avatar.Fallback>U</Avatar.Fallback>
							</Avatar.Root>
					</div>
					<div
						class="flex w-2/3 flex-col justify-center text-center items-center md:items-start gap-2 md:text-left lg:w-2/4 lg:text-left"
					>
						<p class="text-3xl">{profileInfo.display_name}</p>
						<p class="text-sm">{profileInfo.followers.total} seguidores</p>
						<Badge variant="outline" class="text-white w-fit bg-white/20">{profileInfo.product}</Badge>
					</div>
				</div>
				{#if currentlyPlayingContent}
					<div class="w-full lg:w-auto lg:min-w-[30vw] mt-2 md:mt-0">
						<Card.Root class="w-full border bg-transparent text-white">
							<Card.Header>
								<Card.Title>
									<p class="text-center text-xl">Escuchando ahora:</p>
								</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="flex w-full flex-row items-center gap-4">
									{#if currentlyPlayingContent.currently_playing_type === 'episode'}
										<button on:click={currentlyPlayingContent.is_playing ? pause : play}>
											<Avatar.Root
												class="animation-duration-10 size-mx size-12 {currentlyPlayingContent.is_playing
													? 'animate-spin-slow'
													: 'grayscale'} lg:size-20"
											>
												<Avatar.Image src={currentlyPlayingContent.item.images[0].url} alt="" />

												<Avatar.Fallback></Avatar.Fallback>
											</Avatar.Root>
										</button>
										<div class="flex flex-col items-start">
											<!-- <p class="text-lg font-bold lg:text-xl">
												{currentlyPlayingContent.item.name}
											</p> -->
											<a
												href={currentlyPlayingContent.item.external_urls.spotify}
												class="text-lg font-bold lg:text-xl"
											>
												{currentlyPlayingContent.item.name}
											</a>
											<p class="text-sm">
												{currentlyPlayingContent.item.show.name}
											</p>
										</div>
									{:else}
										<button on:click={currentlyPlayingContent.is_playing ? pause : play}>
											<Avatar.Root
												class="animation-duration-10 size-mx size-12 {currentlyPlayingContent.is_playing
													? 'animate-spin-slow'
													: 'grayscale'} lg:size-20"
											>
												<Avatar.Image
													src={currentlyPlayingContent.item.album.images[0]?.url}
													alt=""
												/>

												<Avatar.Fallback></Avatar.Fallback>
											</Avatar.Root>
										</button>

										<div class="flex flex-col items-start">
											<a
												href={currentlyPlayingContent.item.external_urls.spotify}
												class="text-lg font-bold lg:text-xl"
											>
												{currentlyPlayingContent.item.name}
											</a>
											<div class="flex flex-row flex-wrap">
												{#each currentlyPlayingContent.item.artists as artist, index}
													<p class="lg:text-md text-sm">
														{artist.name}{index !== currentlyPlayingContent.item.artists.length - 1
															? ','
															: ''}
													</p>
												{/each}
											</div>
										</div>
									{/if}
								</div>
							</Card.Content>
						</Card.Root>
					</div>
				{/if}
			</div>
		</Card.Content>
	</Card.Header>
</Card.Root>
