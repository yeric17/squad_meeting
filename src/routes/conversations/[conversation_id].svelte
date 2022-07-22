<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ params, fetch, session }) => {
		const currentSession: any = session;

		const user = currentSession.user;

        appUser.set(user)

		if (user == null || !user.logged_in) {
			return {
				status: httpStatusCode.Found,
				redirect: '/'
			};
		}

		const conversationId = params.conversation_id;

		const accesTokenResponse = await fetch(`${API_HOST}/access-token?identity=${user.id}`);

		if (!accesTokenResponse.ok) {
			console.log('Error on get Access Token');
		}

		const accesToken = await accesTokenResponse.text();

		const client = new Client(accesToken);

		const conversation = await client.getConversationBySid(conversationId);

        activeConversation.set(conversation)

		const participants: Participant[] = await conversation.getParticipants();
		
        await getSupabaseUsersFromParticipants(participants)
		

		let messagesPaginator: Paginator<Message> = await conversation.getMessages(
			20,
			undefined,
			'backwards'
		);

		let messagesItems: Message[] = messagesPaginator.items;

        messageList.set(messagesItems)

		const status: ConversationStatus = conversation.status;

		if (status !== 'joined') {
			await conversation.join();
		}
		return {
			status: 200,
			props: {
				conversation,
				user,
				messagesPaginator,
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
	import { httpStatusCode } from '../../utils/http-status-codes';
	import { onDestroy } from 'svelte';
	import { API_HOST } from '../../utils/config';
	import ChatMessages from '$lib/chat-messages.svelte';
    import { activeConversation } from '../../stores/conversations';
    import { appUser } from '../../stores/user';
    import ConversationHeader from '$lib/conversation-header.svelte';
    import { getSupabaseUsersFromParticipants } from '../../stores/participants';
    import SidebarChat from '$lib/sidebar-chat.svelte';
    import ChatControls from '$lib/chat-controls.svelte';
    import {messageList} from '../../stores/messages';

	export let user: any = null;
	export let conversation: Conversation;
	export let messagesPaginator: Paginator<Message>;


    let replyAttributes: any | null = null;
	let isTopChat = false;
	let isLoadingMessages = false;

	let replyMessage: Message | null = null;



	onDestroy(() => {
		console.log('Destroy object');
	});

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
	<title>Conversacion - {conversation.sid}</title>
</svelte:head>



<div class="app_container">
	<ConversationHeader/>
	<SidebarChat/>
	<ChatMessages
		currentUserId={user.id}
		bind:isTopChat
		on:scroll={handleChatScroll}
		showAdminOptions={user.id === conversation.createdBy}
		on:reply={handleReply}
	/>
	<ChatControls replyAttributes={replyAttributes}/>
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
