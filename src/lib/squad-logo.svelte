<script lang="ts">
    import SquadMeetingLogo from "./svg/squad-meeting-logo.svelte";
    import SquadMeetingText from "./svg/squad-meeting-text.svelte";
</script>

<span class="squad-logo">
    <SquadMeetingText/>
    <SquadMeetingLogo/>
</span>

<style>
    .squad-logo{
        display: flex;
        flex-direction: column;
        gap: .5rem;
        width: 100%;
    }
</style>