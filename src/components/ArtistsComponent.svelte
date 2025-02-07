<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar'
	import * as Card from '$lib/components/ui/card'

	export let artists
</script>

<Card.Root
	class="max-w-screen isolate w-full rounded-xl bg-white/20 text-white shadow-lg ring-1 ring-black/5  sm:h-1/3 md:h-1/3 lg:h-auto"
>
	<Card.Header>
		<Card.Title>
			<p class="text-3xl">Tus Artistas Top</p>
		</Card.Title>
	</Card.Header>
	<Card.Content class="h-fit w-full">
		<div class="custom-scrollbar flex h-full flex-row gap-8 overflow-auto lg:gap-16 p-1">
			{#each artists as artist}
				<div class="grid h-full gap-2 text-center">
					<a href={artist.external_urls.spotify} target="_blank">
						<Avatar.Root class="size-24 border-2 lg:size-36">
							<Avatar.Image src={artist.images[1]?.url} alt={artist.name} />
							<Avatar.Fallback>{artist.name.charAt(0)}</Avatar.Fallback>
						</Avatar.Root>
					</a>
					<p class="text-sm">{artist.name}</p>
				</div>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
