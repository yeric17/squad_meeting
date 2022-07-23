<script lang="ts">
    import { supabase } from '$lib/supabase'
    import { onMount } from 'svelte/types/runtime/internal/lifecycle';
    import { user } from '../stores/sessionStore'
  
    let loading = true
    let username:any = null
    let website:any = null
    let avatar_url:any = null
  
    onMount( async()=> {
      try {
        loading = true
        const supaUser = supabase.auth.user()
  
        if(supaUser == null) return;

        let { data, error, status } = await supabase
          .from('profiles')
          .select(`user_name, avatar_url`)
          .eq('id', supaUser.id)
          .single()
  
        if (error && status !== 406) throw error
  
        if (data) {
          username = data.user_name
          avatar_url = data.avatar_url
        }
      } catch (error) {
        console.log(error)
      } finally {
        loading = false
      }
      return 
    })
  
    async function updateProfile() {
      try {
        loading = true
        const supaUser = supabase.auth.user()
  
        if(supaUser == null) return;
        const updates = {
          id: supaUser.id,
          username,
          avatar_url,
          updated_at: new Date(),
        }
  
        let { error } = await supabase.from('profiles').upsert(updates, {
          returning: 'minimal', // Don't return the value after inserting
        })
  
        if (error) throw error
      } catch (error) {
        console.log(error)
      } finally {
        loading = false
      }
    }
  
    async function signOut() {
      try {
        loading = true
        let { error } = await supabase.auth.signOut()
        if (error) throw error
      } catch (error) {
        console.log(error)
      } finally {
        loading = false
      }
      
    }
  </script>
  
  <form class="form-widget" on:submit|preventDefault={updateProfile}>
    <div>
      <label for="email">Email</label>
      <input id="email" type="text" value={$user.email} disabled />
    </div>
    <div>
      <label for="username">Name</label>
      <input
        id="username"
        type="text"
        bind:value={username}
      />
    </div>
    <div>
      <label for="website">Website</label>
      <input
        id="website"
        type="website"
        bind:value={website}
      />
    </div>
  
    <div>
      <input type="submit" class="button block primary" value={loading ? 'Loading ...' : 'Update'} disabled={loading}/>
    </div>
  
    <div>
      <button class="button block" on:click={signOut} disabled={loading}>
        Sign Out
      </button>
    </div>
  </form>