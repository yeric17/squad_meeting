<script lang="ts">
    import KeycapRandom from "./svg/keyboard/keycap-random.svelte";
    export let name = "";
</script>


<span class="typing_indicator">
    <div class="typing_indicator_name">
        {name}
    </div>
    <div class="typing_indicator_keyboard">
        <KeycapRandom delay={1}/>
        <KeycapRandom delay={2}/>
        <KeycapRandom delay={3}/>
    </div>
</span>

<style>
    .typing_indicator{
        display: flex;
        gap: 1rem;
        align-items: center;
    }
    .typing_indicator_name{
        color:var(--color-dark-purple);
    }
</style>

