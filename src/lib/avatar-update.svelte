<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { supabase } from '$lib/supabase';
	import { user } from '$stores/sessionStore';
	import { onMount } from 'svelte';

	export let size = '10rem';

	let uploading = false;
	let files: FileList;
	let src: string;
    let path:string;
	const dispatch = createEventDispatcher();

	onMount(async () => {
		const session = supabase.auth.session();
		if (session == null) return;
		let pathArray = $user.avatar.split('/');
		path = pathArray[pathArray.length - 1];
		const { data } = await supabase.storage.from('avatars').download(path);

		if (data == null) return;
		src = URL.createObjectURL(data);
	});
	async function uploadAvatar() {
		try {
			uploading = true;

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.');
			}

			const file = files[0];
			const fileExt = file.name.split('.').pop();
			const fileName = `${$user.id}.${fileExt}`;
			const filePath = `${fileName}`;

			const {error: findError, data} = await supabase.storage.from('avatars').download(fileName)
			
			if(findError) throw findError;

			if(data)
			{
				console.log("exists file")
				const arrayBuffer = await file.arrayBuffer()
				const {error: updateError} = await supabase.storage.from('avatars').update(filePath,arrayBuffer,{
					contentType: file.type
				})
				if(updateError) throw updateError;
			}
			else {
				console.log("does not exists file")
				const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
				if (uploadError) throw uploadError;
			}
            
            const {publicURL} = supabase.storage.from('avatars').getPublicUrl(fileName)

            if(publicURL){
                const {error,data} = await supabase.from('profiles').update({
                    avatar_url:publicURL
                }, {returning:'minimal'}).eq('id',$user.id)
                src = publicURL
            } 
			dispatch('upload');
		} catch (error) {
			console.log(error);
		} finally {
			uploading = false;
		}
	}
</script>

<div class="avatar-update">
	{#if src}
	<img {src} alt="Avatar" class="avatar-update_item" style="height: {size}; width: {size};" />
	{/if}
	<div style="width: {size};" class="avatar-update_item">
		<label class="button small" for="single">
			{uploading ? 'Uploading ...' : 'Editar'}
		</label>
		<input
			class="input-file"
			type="file"
			id="single"
			accept="image/*"
			bind:files
			on:change={uploadAvatar}
			disabled={uploading}
		/>
	</div>
</div>

<style>
	.button.small {
		padding: 0.25rem;
		display: flex;
		justify-content: center;
	}
	.avatar-update {
		display: grid;
		justify-items: center;
		gap: .4rem;
	}
	.avatar-update_item {
		display: flex;
		justify-content: center;
	}
	.input-file {
		visibility: hidden;
		display: none;
	}
    .avatar-update img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>
