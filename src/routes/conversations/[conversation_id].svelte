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
	import {
		Client,
		Message,
		Participant,
		type ConversationStatus,
		type Paginator
	} from '@twilio/conversations';
	import { onDestroy, onMount } from 'svelte';
	import { API_HOST } from '$utils/config';
	import ChatMessages from '$lib/chat-messages.svelte';
    import { activeConversation } from '$stores/conversations';
    import ConversationHeader from '$lib/conversation-header.svelte';
    import SidebarChat from '$lib/sidebar-chat.svelte';
    import ChatControls from '$lib/chat-controls.svelte';
    import {messageList} from '$stores/messages';
	import { user } from '$stores/sessionStore';

	import LoaderPage from "$lib/loader-page.svelte";
	import { setParticipants } from '$stores/participants';
	import { getParticipants } from '../../services/fetch-participants';

	export let conversationId:string = "";
	
	let messagesPaginator: Paginator<Message>;
	let isTopChat = false;
	let isLoadingMessages = false;
	let loading = true;

	
	onMount(async()=>{
		loading = true;
		try{
			 

			const accesTokenResponse = await fetch(`${API_HOST}/access-token?identity=${$user.id}`);
			if (!accesTokenResponse.ok) {
				console.log('Error on get Access Token');
			}
	
			const accesToken = await accesTokenResponse.text();
	
			const client = new Client(accesToken);

			const conversation = await client.getConversationBySid(conversationId)

			activeConversation.set(conversation)

			await $activeConversation.setAllMessagesRead()

			const participants: Participant[] = await $activeConversation.getParticipants();

			let participant = participants.find(par=>par.identity === $user.id)
	
			if(participant != undefined ){
				user.update(value=>{
					value.participant = participant
					return value
				})
			}
			
	
			const users = await getParticipants($activeConversation)
	
			setParticipants(users)
			
	
			let paginator: Paginator<Message> = await $activeConversation.getMessages(
				20,
				undefined,
				'backwards'
			);
	
			messagesPaginator = paginator;
	
			let messagesItems = messagesPaginator.items;
	
			messageList.set(messagesItems)
	
			const status: ConversationStatus = $activeConversation.status;
	
			if (status !== 'joined') {
				await $activeConversation.join();
			}

			if($user.participant){
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

	async function handleChatScroll() {
		if (isTopChat && !isLoadingMessages && messagesPaginator.hasPrevPage) {
			isLoadingMessages = true;
			messagesPaginator = await messagesPaginator.prevPage();
			messageList.set([...messagesPaginator.items, ...$messageList]);
			isLoadingMessages = false;
		}
	}


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
	<ChatMessages
		bind:isTopChat
		on:scroll={handleChatScroll}
	/>
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
