<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ params }) => {

		const conversationId = params.conversation_id;

		return {
			status: 200,
			props: {
				conversationId
			}
		};
	};
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import ChatMessages from '$lib/chat-messages.svelte';
    import { activeConversation } from '$stores/conversations';
    import ConversationHeader from '$lib/conversation-header.svelte';
    import SidebarChat from '$lib/sidebar-chat.svelte';
    import ChatControls from '$lib/chat-controls.svelte';
	import { user } from '$stores/sessionStore';

	import LoaderPage from "$lib/loader-page.svelte";
	import { conversationParticipants, setParticipants } from '$stores/participants';
	import { getParticipants } from '../../services/fetch-participants';
	import { getConversation } from '../../services/get-conversation';

	export let conversationId:string = "";

	let loading = true;

	
	onMount(async()=>{
		loading = true;
		try{
	
			const conversation = await getConversation($user.id,conversationId)

			activeConversation.set(conversation)

			await $activeConversation.setAllMessagesRead()
	
			const users = await getParticipants($activeConversation)
			
			setParticipants(users)
			
			if($conversationParticipants.length > 0){
				const participant = users.find( u => u.id === $user.id)?.participant
				user.update(value=>{
					value.participant = participant
					return value
				})
			}
	
			if ($activeConversation.status !== 'joined') {
				await $activeConversation.join();
			}

			if($user.participant !== undefined){
				$activeConversation.emit('participantJoined',$user.participant)
				$user.participant.updateAttributes({
					status:'online'
				})
			}
		}
		catch(error){
			console.log(error)
		}
		finally{
			loading = false;
		}
	})

	onDestroy(async ()=>{
		await $activeConversation.setAllMessagesRead()
		if($user.participant){
			$activeConversation.emit('participantLeft',$user.participant)
			$user.participant.updateAttributes({
				status:'offline'
			})
		}
		user.update(value=>{
			value.participant = undefined
			return value
		})
	})

</script>

<svelte:head>
	<title>Conversacion - {conversationId}</title>
</svelte:head>


<div class="app_container">
	{#if loading}
	<LoaderPage/>
	{:else}
	<ConversationHeader/>
	<SidebarChat/>
	<ChatMessages/>
	<ChatControls/>
	{/if}
</div>

<style>
	.app_container {
		height: 100vh;

		background-color: var(--color-gray-5);
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto 1fr auto;
	}

</style>
