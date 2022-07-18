<script lang="ts">
    import { faces, animals,activities,travels,objects,simbols ,foods} from "../utils/emoticons";
    import { createEventDispatcher } from "svelte/internal";
    

    const dispacher = createEventDispatcher()
    let emoticon = "";

    let emoticonsCollection = [
        faces,
        animals,
        foods,
        activities,
        travels,
        objects,
        simbols,
    ]

    let index = 0
    function onSelect(event:MouseEvent){
        const target = event.target as HTMLElement
        if(target.textContent == null) return;
        emoticon = target.textContent
        dispacher('select-emoticon', emoticon)
    }
    function changeIndex(event:MouseEvent){
        const target = event.target as HTMLElement
        if(target.dataset.index == null) return;
        index = parseInt(target.dataset.index)
    }
</script>


<div class="emoticons">
    <div class="emoticons_sections">
        <div class="emoticons_section" on:click={changeIndex} class:active={index===0} data-index="0">😀</div>
        <div class="emoticons_section" on:click={changeIndex} class:active={index===1} data-index="1">🐶</div>
        <div class="emoticons_section" on:click={changeIndex} class:active={index===2} data-index="2">🍏</div>
        <div class="emoticons_section" on:click={changeIndex} class:active={index===3} data-index="3">⚽</div>
        <div class="emoticons_section" on:click={changeIndex} class:active={index===4} data-index="4">🚍</div>
        <div class="emoticons_section" on:click={changeIndex} class:active={index===5} data-index="5">⌚</div>
        <div class="emoticons_section" on:click={changeIndex} class:active={index===6} data-index="6">💗</div>
    </div>
    <ul class="emoticon_list">
        {#each emoticonsCollection[index] as item}
            <li class="emoticon_item" on:click={onSelect}>{item}</li>
        {/each}
    </ul>
</div>


<style>
    .emoticon_list{
        display: grid;
        grid-template-columns: repeat(auto-fit,minmax(2rem,1fr));
        grid-auto-rows: 2rem;
        gap: .25rem;
        padding-top: .5rem;
        border-top: 1px solid var(--color-gray-5);
        overflow-x: hidden;
        height: 200px;
    }
    .emoticon_item{
        cursor: pointer;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 1.5rem;
    }
    .emoticon_item:hover{
        opacity: .4;
    }
    .emoticons_section{
        filter: saturate(0%) brightness(130%);
        font-size: 1.5rem;
        padding: .25rem;
        cursor: pointer;
        border-radius: 5px;  
    }
    .emoticons_sections{
        display: flex;
        padding-bottom: .5rem;
        gap: .2rem;
    }
    .emoticons_section:hover, .emoticons_section.active{
        background-color: var(--color-blue-gray);
        filter: saturate(100%)
    }
</style>