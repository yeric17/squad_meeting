<script lang="ts">
	import { user } from '$stores/sessionStore';
	import type { AppUser } from '$stores/user';

	import { API_HOST } from '$utils/config';
	import { rolesSid } from '$utils/roles-sid';
	import { Participant } from '@twilio/conversations';

	import { onMount } from 'svelte';
	import { getExpectedBodyHash } from 'twilio/lib/webhooks/webhooks';

	import { activeConversation } from '../stores/conversations';

	import { supabaseUsers } from '../stores/participants';
	import AddUser from './add-user.svelte';

	import ParticipantCard from './participant-card.svelte';
	import { supabase } from './supabase';
	import AddIcon from './svg/add-icon.svelte';
	import UserAddIcon from './svg/user-add-icon.svelte';
	import UsersIcon from './svg/users-icon.svelte';

	let showUsers: boolean = false;
	let showAddUser: boolean = false;
	let allUsers: any[] = [];

	onMount(async () => {
		const response = await fetch(API_HOST + '/twilio-users');
		if (response.ok) {
			let data = await response.json();
			allUsers = data.body.filter((item: any) => {
				return !$supabaseUsers.some((supaUser) => supaUser.id === item.id);
			});
		}
	});

	function toggleShowUsers() {
		showUsers = !showUsers;
		if (showUsers) {
			showAddUser = false;
		}
	}

	function toggleShowAddUsers() {
		showAddUser = !showAddUser;
		if (showAddUser) {
			showUsers = false;
		}
	}

	async function addUser(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		const target = event.target as HTMLElement;
		const userId = target.dataset.userid;
		if (userId == null) {
			return;
		}

		const response = await fetch(`${API_HOST}/participants`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				participant: {
					identity: userId,
					roleSid: rolesSid.channelUser
				},
				conversationSid: $activeConversation.sid
			})
		});

		if (response.ok) {
			const { data } = await supabase.from('profiles').select().eq('id', userId).single();

			const newUser: AppUser = {
				id: data.id,
				name: data.user_name,
				email: data.email,
				avatar: data.avatar_url,
				logged_in: false
			};
			supabaseUsers.set([...$supabaseUsers, newUser]);
			allUsers = allUsers.filter((u) => {
				return u.id !== userId;
			});
		}

	}
</script>

<section class="side-menu_chat">
	<ul class="side-menu_list">
		<li class="side-menu_item" class:active={showUsers} on:click={toggleShowUsers}>
			<UsersIcon />
		</li>
		{#if $user.id === $activeConversation.createdBy}
			<li class="side-menu_item" class:active={showAddUser} on:click={toggleShowAddUsers}>
				<UserAddIcon />
			</li>
		{/if}
	</ul>
	<div class="side-menu_sub" class:active={showUsers || showAddUser}>
		{#if showUsers}
			<ul class="side-menu_sub_users">
				{#each $supabaseUsers as participant, idx (participant.id)}
					<li class="sub_user">
						<ParticipantCard
							{participant}
							isOwner={participant.id === $activeConversation.createdBy}
						/>
					</li>
				{/each}
			</ul>
		{/if}
		{#if showAddUser}
			<ul class="side-menu_sub_users">
				{#each allUsers as item, idx (item.id)}
					<li class="sub_user sub_user-action">
						<span class="car-wrappper">
							<ParticipantCard participant={item} />
						</span>
						<button class="button-add" data-userid={item.id} on:click={addUser}>
							<span class="button-add_icon">
								<div>
									<AddIcon />
								</div>
							</span>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

<style>
	.side-menu_chat {
		grid-row: span 3;
		background-color: var(--color-gray-6);
		display: grid;
		grid-template-columns: auto auto;
	}

	.side-menu_item {
		padding: 0.5rem;
		padding-left: 1.5rem;
		height: 2rem;
		width: 100%;
		cursor: pointer;
		display: flex;
		justify-content: center;
		--color-text: var(--color-blue-gray);
		border-right: 2px solid transparent;
		transition: all 0.3s;
		opacity: 0.6;
	}
	.side-menu_item.active {
		--color-text: var(--color-dark-purple);
		border-right: 2px solid var(--color-dark-purple);
	}
	.side-menu_item:hover {
		background-color: var(--color-blue-gray);
		border-right: 2px solid var(--color-gray-3);
		--color-text: white;
	}
	.side-menu_sub.active {
		border-right: 1px solid var(--color-gray-5);
	}
	.side-menu_sub_users {
		padding-left: 0.5rem;
		padding-right: 0.5rem;
	}
	.sub_user {
		display: block;
		margin-top: 0.5rem;
	}
	.side-menu_list {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 1rem;
		border-right: 1px solid var(--color-gray-5);
	}
	.sub_user-action {
		display: flex;
		gap: 0.5rem;
	}
	.car-wrappper {
		flex-grow: 1;
	}
	.button-add {
		cursor: pointer;
		border: none;
		font-size: 0.8rem;
		--color-text: var(--color-gray-3);

		color: white;
		padding: 0.5rem;
		border-radius: 5px;
	}
	.button-add:hover {
		--color-text: var(--color-purple);
	}
	.button-add_icon {
		width: 1rem;
		pointer-events: none;
	}
	.button-add_icon div {
		width: 1rem;
	}
</style>
