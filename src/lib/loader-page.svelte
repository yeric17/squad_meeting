<script>
import Spin from "./spin.svelte";

</script>
<section class="loader">
    <Spin color="#66B6AB" size=".4rem"/>
</section>

<style>
    .loader{
        display: flex;
        width: 100vw;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        background-color: white;
        justify-content: center;
        align-items: center;
    }
</style>