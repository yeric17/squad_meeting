<script>
	import LogoutIcon from './svg/logout-icon.svelte';
	import UserSquareIcon from './svg/user-square-icon.svelte';
	import { fade } from 'svelte/transition';
	import { supabase } from './supabase';
	import UpdateProfile from './update-profile.svelte';
	export let showMenu = false;
	export let showProfile = false;

	async function signOut() {
		await supabase.auth.signOut()
		window.location.href = '/login';
	}

	function handleProfile(){
		showProfile = true
	}
</script>

{#if showMenu}
	<div class="menu" transition:fade={{ duration: 100 }}>
		<ul class="menu_list">
			<li class="menu_item">
				<button on:click={signOut}>
					<span class="menu_item_icon">
						<LogoutIcon />
					</span>
					<span class="menu_item_text"> Cerrar sesión </span>
				</button>
			</li>
			<li class="menu_item">
				<button on:click={handleProfile}>
					<span class="menu_item_icon">
						<UserSquareIcon />
					</span>
					<span class="menu_item_text"> Perfil </span>
				</button>
			</li>
		</ul>
	</div>
{/if}
{#if showProfile}
	<div class="profile">
		<UpdateProfile bind:showProfile={showProfile}/>
	</div>
{/if}

<style>
	.menu {
		position: absolute;
		right: 0;
		bottom: -0.6rem;
		transform: translateY(100%);
		background-color: var(--color-gray-6);
		min-width: 150px;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		z-index: 100;
		overflow: hidden;
	}
	.menu_list {
		width: 100%;
	}
	.menu_item {
		display: block;

		width: 100%;
	}
	.menu_item button {
		color: var(--color-text);
		border: none;
		display: flex;
		background-color: transparent;
		width: 100%;
		cursor: pointer;
		padding: 0.5rem;
		text-align: left;
		font-size: 0.8rem;
		align-items: center;
		gap: 0.5rem;
	}
	.menu_item button:hover {
		--color-text: white;
		background-color: var(--color-soft-purple);
		color: var(--color-text);
	}
	.menu_item_icon {
		width: 1rem;
		height: 1rem;
	}
</style>
