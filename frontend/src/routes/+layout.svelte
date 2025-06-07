<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { LogIn, LogOut } from '@lucide/svelte';
	import { enhance } from '$app/forms';

	
	let { children, data } = $props();
</script>

<ModeWatcher />
<div class="top-0 left-0 p-2 w-full flex justify-end">
	{#if data.loggedIn}
	<form action="/?/logout" method="POST" use:enhance={() => { data.loggedIn = false }}>
            <input type="hidden" name="userID" value={data.userID}>
            <button>
                <LogOut/>
            </button>
        </form>
	{:else}
	<a href="/login">
		<LogIn />
	</a>
	{/if}
</div>
{@render children()}
