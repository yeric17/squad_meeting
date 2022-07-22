<script lang="ts">
    export let user:any ={
        id:"",
        user_name:"",
        avatar:"",
        email:""
    };
</script>



<div class="avatar">

    <span class="avatar_image">
        <img src={user.avatar_url?user.avatar_url:''} alt="avatar">
    </span>
    <span class="avatar_name">
        {user.user_name}
    </span>
    <button class="invite-user">
        Invitar
    </button>
</div>

<style>
    .avatar{
        display: grid;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: .5rem;
        background-color: rgba(0,0,0,.1);
        border-radius: 6px;
    }
    .avatar_name{
        font-size: .9rem;
        max-width: 150px;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: flex;
        justify-content: center;
        overflow: hidden;
        color: var(--color-dark-purple);
        font-weight: 600;
    }
    .avatar_image{
        display: flex;
        justify-content: center;
    }
    .avatar_image img{
        width: 50px;
        border-radius: 50px;
        border: 1px solid var(--color-blue-gray);
    }
    .invite-user{
        border: 1px solid var(--color-dark-purple);
        background-color: var(--color-sea-blue);
        border-radius: 30px;
        font-size: .9rem;
        font-weight: 500;
        letter-spacing: .05rem;
        padding: .25rem;
        cursor: pointer;
        min-width: 80px;
    }
</style>