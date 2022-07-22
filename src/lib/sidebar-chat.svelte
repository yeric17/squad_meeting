<script lang="ts">
import { activeConversation } from '../stores/conversations';

    import { supabaseUsers } from '../stores/participants';

    import ParticipantCard from './participant-card.svelte';
    import UsersIcon from './svg/users-icon.svelte';
    

    let showUsers:boolean = false;
    let showAddUser:boolean = false;


    function toggleShowUsers() {
		showUsers = !showUsers;
		if (showUsers) {
			showAddUser = false;
		}
	}

</script>

<section class="side-menu_chat">
    <ul class="side-menu_list">
        <li class="side-menu_item" class:active={showUsers} on:click={toggleShowUsers}>
            <UsersIcon />
        </li>
        <!-- <li class="side-menu_item" class:active={showAddUser} on:click={toggleShowAddUsers}><UserAddIcon/></li> -->
    </ul>
    <div class="side-menu_sub" class:active={showUsers || showAddUser}>
        {#if showUsers}
            {#each $supabaseUsers as participant}
                <ul class="side-menu_sub_users">
                    <li class="sub_user">
                        <ParticipantCard {participant} isOwner={participant.id === $activeConversation.createdBy} />
                    </li>
                </ul>
            {/each}
        {/if}
        {#if showAddUser}
            <span />
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
</style>