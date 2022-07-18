<div class="spin_wrapper">
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
        --dot-size: .2rem;
        position: absolute;
        width: var(--dot-size);
        height: var(--dot-size);
        background-color: white;
        border-radius: var(--dot-size);
        transform: rotate(calc(var(--index) * (360deg / 10))) translateY(10px);
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