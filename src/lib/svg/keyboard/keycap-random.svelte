<script lang="ts">
import { onDestroy, onMount } from "svelte";

    import KeycapSelect from "./keycap_select.svelte";
    export let delay:number = 1;
    let keycap = "a"
    const alphabet:string = "abcdefghijklmnñopqrstuvwxyz"
    let timer:NodeJS.Timer;

    onMount(()=>{
        timer = setInterval(()=>{
            setRandomKeyCap()
        },1000)
    })

    onDestroy(()=>{
        clearInterval(timer)
    })

    function setRandomKeyCap(){
        const index = Math.floor(Math.random() * 27);
        keycap = alphabet.charAt(index)
    }

</script>

<KeycapSelect keycap={keycap} delay={delay}/>