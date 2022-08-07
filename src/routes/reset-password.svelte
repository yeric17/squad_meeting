<script context="module" lang="ts">
    import type { Load } from "@sveltejs/kit";

    export const load:Load = async ({params})=>{
        console.log(params)
        return {
            status: 200
        }
    }
</script>
