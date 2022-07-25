
<script lang="ts">
    import TypingIndicator from './typing_indicator.svelte'
    import EmoticonIcon from './svg/emoticon-icon.svelte'
    import PaperclipIcon from './svg/paperclip-icon.svelte'
    import EmoticonOption from './emoticon-option.svelte';
    import DropArea from './drop-area.svelte';
    import type { Message } from '@twilio/conversations';
    import { activeConversation } from '../stores/conversations';
    import { appUser } from '../stores/user';
    import SendIcon from './svg/send-icon.svelte';
    import {slide} from 'svelte/transition'
    import { supabase } from './supabase';
    import { onMount } from 'svelte';
    import { addMessageToList } from '../stores/messages';
	import { user } from '$stores/sessionStore';
	import { chatCurrentState } from '$stores/chat-state';
    
    
    export let replyAttributes: any | null = null;
    let textInput = '';
    let typingUser: any = null;
    let replyMessage: Message | null = null;
    let emoticonsIsActive = false;
	let atachmentIsActive = false;
	let inputChat:HTMLInputElement|null = null;

    onMount(() => {

		inputChat = document.getElementById('chatMessage') as HTMLInputElement

		$activeConversation.on('typingStarted', async (participant) => {
			let { data } = await supabase
				.from('profiles')
				.select('user_name')
				.eq('id', participant.identity);
			if (data == null) return;
			typingUser = data[0];
		});
		$activeConversation.on('typingEnded', () => {
			typingUser = null;
		});
	});


    async function handleSubmit(event: Event) {
		event.preventDefault();
		if (textInput === '') return;

		if (replyMessage == null) {
			await $activeConversation.sendMessage(
				textInput,
				JSON.stringify({
					name: $user.name,
					avatar_url: $user.avatar
				})
			);
		} else {
			await $activeConversation.sendMessage(
				textInput,
				JSON.stringify({
					name: $user.name,
					avatar_url: $user.avatar,
					reply: {
						body: replyMessage.body,
						sid: replyMessage.sid
					}
				})
			);
		}
		replyMessage = null;
		textInput = '';
	}

    async function handleInputChat() {
		await $activeConversation.typing();
	}

    function handleEmoticons(target: CustomEvent) {
		const emoticon = target.detail;
		textInput += emoticon;
	}

	function toggleEmoticons() {
		emoticonsIsActive = !emoticonsIsActive;
		if (emoticonsIsActive) {
			atachmentIsActive = false;
		}
	}
	function toggleAtachments() {
		atachmentIsActive = !atachmentIsActive;
		if (atachmentIsActive) {
			emoticonsIsActive = false;
		}
	}

	function handleKeyDown(){
		if($chatCurrentState !== 'idle') return;
		inputChat?.focus()
		
	}
</script>

<svelte:window  on:keydown={handleKeyDown}/>

<section class="chat_controls">
    {#if typingUser}
        <div class="typing_info">
            <TypingIndicator name={typingUser.user_name} />
        </div>
    {/if}
    <form on:submit={handleSubmit} class="chat_form_text">
        {#if replyMessage}
            <div class="reply_info">
                <span class="reply_user-name">
                    {replyAttributes.name}
                </span>
                <span class="reply_body">
                    {replyMessage.body}
                </span>
            </div>
        {/if}
        <div class="chat_form_text_controls">
            <input
                type="text"
                on:keydown={handleInputChat}
                bind:value={textInput}
                class="chat_input"
                name="chat"
                id="chatMessage"
                placeholder="Escribe el nuevo mensaje"
            />
            <button class="button_send" on:click={handleSubmit}><SendIcon /></button>
        </div>
    </form>
    <div class="chat_options">
        <span class="chat_option" on:click={toggleEmoticons}>
            <EmoticonIcon />
        </span>
        <span class="chat_option" on:click={toggleAtachments}>
            <PaperclipIcon />
        </span>
    </div>
    {#if emoticonsIsActive}
        <div class="chat_options_window" class:active={emoticonsIsActive} transition:slide>
            {#if emoticonsIsActive}
                <div class="window_emoticons">
                    <EmoticonOption on:select-emoticon={handleEmoticons} />
                </div>
            {/if}
        </div>
    {/if}
    {#if atachmentIsActive}
        <div class="chat_options_window" class:active={atachmentIsActive} transition:slide>
            <div class="window_drop">
                <DropArea conversationTarget={$activeConversation} userName={$appUser.name} />
            </div>
        </div>
    {/if}
</section>

<style>
    .chat_input {
		width: 100%;
		resize: none;
		height: 40px;
		border: 1px solid var(--color-gray-4);
		padding: 0.5rem;
		border-radius: 5px;
		outline: none;
		font-weight: 300;
	}
	.chat_input:focus {
		border: 1px solid var(--color-purple);
	}
	.chat_form_text {
		padding-right: 0.5rem;
		padding-left: 0.5rem;
		background-color: var(--color-gray-6);
		padding-top: 0.5rem;
		display: grid;
		gap: 0.5rem;
	}
	.chat_form_text_controls {
		display: flex;
		gap: 0.3rem;
		padding-bottom: 0.5rem;
		align-items: center;
	}
	.button_send {
		border: none;
		width: 2.3rem;
		height: 2rem;
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--color-sea-blue);
		cursor: pointer;
	}
	
	.chat_controls {
		position: relative;
	}
	.typing_info {
		padding: 0.5rem;
		padding-left: 0.8rem;
		padding-bottom: 0.25rem;
		position: absolute;
		top: 0;
		transform: translateY(-100%);
		background-color: var(--color-gray-6);
		border-top-right-radius: 5px;
	}

	.chat_options {
		background-color: var(--color-gray-6);
		padding-bottom: 1rem;
		padding-left: 0.5rem;
		display: flex;
		gap: 0.5rem;
	}

	.chat_option {
		display: flex;
		width: 1.4rem;
		height: 1.4rem;
		padding: 0.25rem;
		--color-text: var(--color-gray-3);
		border-radius: 4px;
		cursor: pointer;
	}
	.chat_option:hover {
		background-color: var(--color-sea-blue);

		--color-text: var(--color-gray-6);
	}

	.chat_options_window {
		overflow-y: scroll;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		background-color: var(--color-gray-6);
		border-top: 1px solid var(--color-gray-5);
		padding-bottom: 1rem;
		padding-top: 1rem;
	}


	.reply_info {
		border-left: 2px solid var(--color-orange);
		padding-left: 0.5rem;
	}
	.reply_user-name {
		color: var(--color-gray-4);
	}
	.reply_body {
		display: inline-flex;
		max-width: 150px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		color: var(--color-gray-3);
	}
</style>