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
		Conversation,
		Message,
		Participant,
		type ConversationStatus,
		type Paginator
	} from '@twilio/conversations';
	import { httpStatusCode } from '$utils/http-status-codes';
	import { onDestroy, onMount } from 'svelte';
	import { API_HOST } from '$utils/config';
	import ChatMessages from '$lib/chat-messages.svelte';
    import { activeConversation } from '$stores/conversations';
    import ConversationHeader from '$lib/conversation-header.svelte';
    import { getSupabaseUsersFromParticipants } from '$stores/participants';
    import SidebarChat from '$lib/sidebar-chat.svelte';
    import ChatControls from '$lib/chat-controls.svelte';
    import {messageList} from '$stores/messages';
	import { user } from '$stores/sessionStore';

	import LoaderPage from "$lib/loader-page.svelte";
import { addNotification } from '$utils/notifications';
import { supabase } from '$lib/supabase';

	export let conversationId:string = "";
	
	let messagesPaginator: Paginator<Message>;
    let replyAttributes: any | null = null;
	let isTopChat = false;
	let isLoadingMessages = false;
	let selfParticipant:Participant;
	let replyMessage: Message | null = null;
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
			$activeConversation.on('participantJoined', async (participant)=>{
				const {data} = await supabase.from('profiles').select('user_name').eq('id', participant.identity)		
				addNotification({
					title: "Ingreso",
					message: `Ha ingresado ${data?data[0].user_name:'anonimo'}`,
					type: 'info'
				})
			})
			const participants: Participant[] = await $activeConversation.getParticipants();

			let participant = participants.find(par=>par.identity === $user.id)
	
			if(participant != undefined ){
				selfParticipant = participant
			}
			
	
			await getSupabaseUsersFromParticipants(participants)
	
			
	
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
		}
		catch(error){
			console.log(error)
		}
		finally{
			loading = false;
		}
	})

	onDestroy(()=>{
		$activeConversation.emit('participantLeft',selfParticipant)
	})

	async function handleChatScroll() {
		if (isTopChat && !isLoadingMessages && messagesPaginator.hasPrevPage) {
			isLoadingMessages = true;
			messagesPaginator = await messagesPaginator.prevPage();
			messageList.set([...messagesPaginator.items, ...$messageList]);
			isLoadingMessages = false;
		}
	}

	function handleReply(event: CustomEvent) {
		replyMessage = event.detail;
		if (replyMessage == null) return;
		const attr = replyMessage.attributes?.toString();
		if (attr == null) return;
		replyAttributes = JSON.parse(attr);
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
		currentUserId={$user.id}
		bind:isTopChat
		on:scroll={handleChatScroll}
		showAdminOptions={$user.id === $activeConversation.createdBy}
		on:reply={handleReply}
	/>
	<ChatControls replyAttributes={replyAttributes}/>
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
