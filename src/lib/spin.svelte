<script lang="ts">
    export let color:string = "white"
    export let size:string = ".2rem"
</script>

<div class="spin_wrapper" style="--spin-color:{color};--dot-size:{size}">
    <div class="spin_dot" style="--index:1"></div>
    <div class="spin_dot" style="--index:2"></div>
    <div class="spin_dot" style="--index:3"></div>
    <div class="spin_dot" style="--index:4"></div>
    <div class="spin_dot" style="--index:5"></div>
    <div class="spin_dot" style="--index:6"></div>
    <div class="spin_dot" style="--index:7"></div>
    <div class="spin_dot" style="--index:8"></div>
    <div class="spin_dot" style="--index:9"></div>
    <div class="spin_dot" style="--index:10"></div>
</div>



<style>
    .spin_wrapper{
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .spin_dot{
        position: absolute;
        width: var(--dot-size);
        height: var(--dot-size);
        background-color: var(--spin-color);
        border-radius: var(--dot-size);
        transform: rotate(calc(var(--index) * (360deg / 10))) translateY(calc(var(--dot-size) * 3));
        animation: animate_opacity 1s linear infinite;
        opacity: 0%;
        animation-delay: calc(var(--index) * .1s);
    }

    @keyframes animate_opacity {
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0;
        }
    }
</style>