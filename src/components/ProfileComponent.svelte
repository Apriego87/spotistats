<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar'
	import * as Card from '$lib/components/ui/card'

	export let profileInfo, currentlyPlayingContent
</script>

<Card.Root
	class="max-w-screen isolate w-full rounded-xl bg-white/20 text-white shadow-lg ring-1 ring-black/5 backdrop-blur sm:h-1/3 md:h-1/3 lg:h-auto"
>
	<Card.Header>
		<Card.Title>
			<p class="text-3xl">Tu Perfil</p>
		</Card.Title>
		<Card.Content class="p-0 lg:p-5">
			<div class="mt-2 flex w-full flex-col items-center gap-4 md:flex-row lg:flex-row">
				<div class="flex w-full flex-row">
					<div class="flex w-1/3 flex-col items-center justify-center">
						<!-- <Avatar.Root class="size-24 border-2 md:size-24 lg:size-36">
							<Avatar.Image src={profileInfo.images[1].url} alt="" />
							<Avatar.Fallback>U</Avatar.Fallback>
						</Avatar.Root> -->
					</div>
					<div
						class="flex w-2/3 flex-col justify-center text-center md:text-left lg:w-2/4 lg:text-left"
					>
						<p class="text-3xl">{profileInfo.display_name}</p>
						<p class="text-sm">{profileInfo.followers.total} seguidores</p>
					</div>
				</div>
				{#if currentlyPlayingContent}
					<div class="whitespace-nowrap w-full text-center lg:w-auto lg:min-w-[20vw]">
						<Card.Root class="w-full border bg-transparent text-white">
							<Card.Header>
								<Card.Title>
									<p class="text-xl">Escuchando ahora:</p>
								</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="flex w-full flex-row items-center gap-4">
									{#if currentlyPlayingContent.currently_playing_type === 'episode'}
										<div class="flex flex-row items-center gap-4">
											<Avatar.Root class="animation-duration-10 size-mx animate-spin-slow">
												<Avatar.Image src={currentlyPlayingContent.item.images[0].url} alt="" />
												<Avatar.Fallback></Avatar.Fallback>
											</Avatar.Root>
											<div class="flex w-full flex-col">
												<p class="lg:whitespace-nowrap">{currentlyPlayingContent.item.name}</p>
												<p class="text-sm">
													{currentlyPlayingContent.item.show.name}
												</p>
											</div>
										</div>
									{:else}
										<Avatar.Root class="animation-duration-10 size-mx animate-spin-slow size-12 lg:size-20">
											<Avatar.Image src={currentlyPlayingContent.item.album.images[0].url} alt="" />
											<Avatar.Fallback></Avatar.Fallback>
										</Avatar.Root>
										<div class="flex flex-col items-start">
											<p class="text-lg font-bold lg:text-xl">
												{currentlyPlayingContent.item.name}
											</p>
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
