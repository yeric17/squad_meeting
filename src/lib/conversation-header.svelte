<script lang="ts">
    import SquadMeetingLogo from '$lib/svg/squad-meeting-logo.svelte';
    import Avatar from '$lib/avatar-header.svelte';
	import {activeConversation} from '$stores/conversations'
	import { user } from '$stores/sessionStore';
	import { updateChatState } from '$stores/chat-state';

	

    let showChangeNameInput = false;
    let newConversationName = '';

    function showChangeName() {
		newConversationName = $activeConversation.friendlyName == null ?'': $activeConversation.friendlyName;
		showChangeNameInput = true;
		updateChatState('edit')
	}

	function hideChangeName() {
		showChangeNameInput = false;
		updateChatState('idle')
	}

    async function copyClipboardId() {
		if ($activeConversation.uniqueName == null) return;
		await navigator.clipboard.writeText($activeConversation.uniqueName);
	}

	async function handleChangeName() {
		if (newConversationName === '') return;
		const newConversation = await $activeConversation.updateFriendlyName(newConversationName);
		$activeConversation = newConversation;
		hideChangeName();
	}
</script>


<header class="conversation_header">
    <div class="header_logo">
        <a href="/"><SquadMeetingLogo /></a>
    </div>
    <div class="conversation_title">
        {#if showChangeNameInput}
            <form on:submit|preventDefault={handleChangeName}>
                <input class="change-name_input" type="text" bind:value={newConversationName} />
            </form>
        {:else}
            <span on:click={showChangeName}>
                {$activeConversation.friendlyName}
            </span>
            {#if $activeConversation.createdBy === $user.id}
                <button class="conversation_copy-id" on:click={copyClipboardId}> Copiar ID </button>
            {/if}
        {/if}
    </div>
    <div class="header_user-info">
        <Avatar userName={$user.name} avatar={$user.avatar} />
    </div>
</header>

<style>
    .conversation_header {
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 1rem;
		padding-right: 1rem;
		background-color: var(--color-gray-6);
		border-bottom: 2px solid var(--color-sea-blue);
		grid-column: span 2;
	}
	.header_logo {
		width: 34.88px;
		height: 24px;
	}
	.header_user-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

    .change-name_input {
		border: none;
		background-color: transparent;
		text-align: center;
		font-size: 1rem;
		font-weight: inherit;
		font-family: 'Karla';
		outline: none;
		letter-spacing: inherit;
		background-color: var(--color-gray-5);
	}

	.conversation_copy-id {
		display: block;
		padding: 0.3rem;
		cursor: pointer;
		font-size: 0.8rem;
		color: var(--color-gray-6);
		background-color: var(--color-purple);
		border: none;
		border-radius: 5px;
	}
	.conversation_copy-id:hover {
		--color-text: var(--color-gray-1);
	}
	.conversation_title {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
</style>