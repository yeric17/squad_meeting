<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { user } from '$stores/sessionStore';
	import AvatarUpdate from './avatar-update.svelte';
	import CloseIcon from './svg/close-icon.svelte';
import { addNotification } from '$utils/notifications';

	export let showProfile = true;

	let loading = true;
	let username: any = null;
	let website: any = null;
	let avatar_url: any = null;

	onMount(async () => {
		try {
			loading = true;
			const supaUser = supabase.auth.user();

			if (supaUser == null) return;

			let { data, error, status } = await supabase
				.from('profiles')
				.select(`user_name, avatar_url`)
				.eq('id', supaUser.id)
				.single();

			if (error && status !== 406) throw error;

			if (data) {
				username = data.user_name;
				avatar_url = data.avatar_url;
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading = false;
		}
		return;
	});

	async function updateProfile() {
		try {
			loading = true;
			const supaUser = supabase.auth.user();

			if (supaUser == null) return;
			const updates = {
				id: supaUser.id,
				user_name: username,
				avatar_url,
				updated_at: new Date()
			};

			let { error } = await supabase.from('profiles').update(updates, {
				returning: 'minimal' // Don't return the value after inserting
			}).eq('id',$user.id);

			if (error) throw error;

			addNotification({
				title: "Actualizado",
				message: "Se ha actualizado el usuario",
				type: "success"
			})
		} catch (error) {
			console.log(error);
		} finally {
			loading = false;
		}
	}
</script>

<form class="form-widget" on:submit|preventDefault={updateProfile}>
	<button class="exit-button" on:click={()=>showProfile = false}>
		<CloseIcon/>
	</button>
	<div class="form_item center">
		<AvatarUpdate size="10rem" />
	</div>
	<div class="form_item">
		<label for="email">Correo</label>
		<input class="input-text disabled" id="email" type="text" value={$user.email} disabled />
	</div>
	<div class="form_item">
		<label for="username">Nombre</label>
		<input class="input-text" id="username" type="text" bind:value={username} />
	</div>
	<div class="form_item center">
		<input
			type="submit"
			class="button small"
			value={loading ? 'Loading ...' : 'Guardar'}
			disabled={loading}
		/>
	</div>
</form>

<style>
	.form-widget {
		position: fixed;
		height: 100vh;
		left: 50%;
		top: 0;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		justify-content: center;
		align-items: center;
		padding-left: 0.5rem;
		transform: translateX(-50%);
		background-color: white;
		width: 100%;
		cursor: auto;
		z-index: 1000;
	}
	.form_item {
		display: flex;
		justify-content: space-between;
		min-width: 250px;
		align-items: center;
		gap: 0.5rem;
	}
	.input-text {
		padding: 0.5rem;
		border-radius: 5px;
		border: 1px solid var(--color-gray-5);
		outline: none;
	}
	.form_item.center {
		justify-content: center;
	}
	.exit-button{
		position: absolute;
		right: 2rem;
		top: 2rem;
		display: flex;
		background-color: transparent;
		border: none;
		width: 1rem;
		height: 1rem;
		--color-text: var(--color-gray-4);
		cursor: pointer;
	}
</style>
