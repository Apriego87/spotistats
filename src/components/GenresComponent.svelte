<script lang="ts">
	import { Badge } from '$lib/components/ui/badge'
	import * as Card from '$lib/components/ui/card'
	import * as Popover from '$lib/components/ui/popover'

	export let genres
</script>

<Card.Root
	class="max-w-screen isolate w-full max-h-auto overflow-auto no-scrollbar rounded-xl border bg-white/20 text-white shadow-lg ring-1 ring-black/5 "
>
	<Card.Header>
		<Card.Title>
			<p class="text-3xl">Tus Géneros Top</p>
		</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="no-scrollbar flex flex-row flex-wrap gap-2 overflow-auto">
			{#each genres as genre}
				<Popover.Root>
					<Popover.Trigger>
						<Badge
							class="bg-white/20 p-1 text-sm text-white shadow-lg ring-1 ring-black/5"
							>{genre.genre}</Badge
						>
					</Popover.Trigger>
					<Popover.Content class="w-auto text-sm">
						{#each genre.artists as artist}
							<div class="flex flex-col items-center">
								{artist}
							</div>
						{/each}
					</Popover.Content>
				</Popover.Root>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
