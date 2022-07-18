
<script lang="ts">
    import KeycapA from "./keycap_a.svelte"
    import KeycapB from "./keycap_b.svelte"
    import KeycapC from "./keycap_c.svelte"
    import KeycapD from "./keycap_d.svelte"
    import KeycapE from "./keycap_e.svelte"
    import KeycapF from "./keycap_f.svelte"
    import KeycapG from "./keycap_g.svelte"
    import KeycapH from "./keycap_h.svelte"
    import KeycapI from "./keycap_i.svelte"
    import KeycapJ from "./keycap_j.svelte"
    import KeycapK from "./keycap_k.svelte"
    import KeycapL from "./keycap_l.svelte"
    import KeycapM from "./keycap_m.svelte"
    import KeycapN from "./keycap_n.svelte"
    import KeycapNn from "./keycap_nn.svelte"
    import KeycapO from "./keycap_o.svelte"
    import KeycapP from "./keycap_p.svelte"
    import KeycapQ from "./keycap_q.svelte"
    import KeycapR from "./keycap_r.svelte"
    import KeycapS from "./keycap_s.svelte"
    import KeycapT from "./keycap_t.svelte"
    import KeycapU from "./keycap_u.svelte"
    import KeycapV from "./keycap_v.svelte"
    import KeycapW from "./keycap_w.svelte"
    import KeycapX from "./keycap_x.svelte"
    import KeycapY from "./keycap_y.svelte"
    import KeycapZ from "./keycap_z.svelte"
    export let keycap:string ="a"
    export let delay:number = 1;
</script>


<span class="keycap" style="--delay:{delay}">
    {#if keycap.toLowerCase() === "a"}
    <KeycapA/>
    {:else if keycap.toLowerCase() === "b"}
    <KeycapB/>
    {:else if keycap.toLowerCase() === "c"}
    <KeycapC/>
    {:else if keycap.toLowerCase() === "d"}
    <KeycapD/>
    {:else if keycap.toLowerCase() === "e"}
    <KeycapE/>
    {:else if keycap.toLowerCase() === "f"}
    <KeycapF/>
    {:else if keycap.toLowerCase() === "g"}
    <KeycapG/>
    {:else if keycap.toLowerCase() === "h"}
    <KeycapH/>
    {:else if keycap.toLowerCase() === "i"}
    <KeycapI/>
    {:else if keycap.toLowerCase() === "j"}
    <KeycapJ/>
    {:else if keycap.toLowerCase() === "k"}
    <KeycapK/>
    {:else if keycap.toLowerCase() === "l"}
    <KeycapL/>
    {:else if keycap.toLowerCase() === "m"}
    <KeycapM/>
    {:else if keycap.toLowerCase() === "n"}
    <KeycapN/>
    {:else if keycap.toLowerCase() === "ñ"}
    <KeycapNn/>
    {:else if keycap.toLowerCase() === "o"}
    <KeycapO/>
    {:else if keycap.toLowerCase() === "p"}
    <KeycapP/>
    {:else if keycap.toLowerCase() === "q"}
    <KeycapQ/>
    {:else if keycap.toLowerCase() === "r"}
    <KeycapR/>
    {:else if keycap.toLowerCase() === "s"}
    <KeycapS/>
    {:else if keycap.toLowerCase() === "t"}
    <KeycapT/>
    {:else if keycap.toLowerCase() === "u"}
    <KeycapU/>
    {:else if keycap.toLowerCase() === "v"}
    <KeycapV/>
    {:else if keycap.toLowerCase() === "w"}
    <KeycapW/>
    {:else if keycap.toLowerCase() === "x"}
    <KeycapX/>
    {:else if keycap.toLowerCase() === "y"}
    <KeycapY/>
    {:else if keycap.toLowerCase() === "z"}
    <KeycapZ/>
    {/if}
</span>

<style>
    .keycap{
        display: inline-flex;
        width: 16px;
        animation: keycap_animate .9s infinite linear;
        animation-delay: calc(var(--delay) * .3s);
        transform: translateY(0%);
        opacity: 0;
        transition: all ease-out;
        transition-duration: .3s;
        --color-text: var(--color-dark-purple);
    }
    @keyframes keycap_animate{
        0%{
            opacity: 1;
            transform: translateY(-10%);
        }
        100%{
            opacity: 0;
            transform: translateY(0%);
        }
    }
</style>