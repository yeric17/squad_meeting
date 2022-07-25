<script lang="ts">
    export let avatar_url:string|null = null;
    export let size:string = "30px"
</script>

<span class="avatar" style="--avatar-size:{size}">
    <img src={avatar_url?avatar_url:'https://i.pravatar.cc/100?img=2'} alt="avatar_image"/>
</span>


<style>
    .avatar{
        width: var(--avatar-size);
        height: var(--avatar-size);
        border-radius: var(--avatar-size);
        display: block;
        overflow: hidden;
    }
    .avatar img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        background-color: white;
    }
</style>