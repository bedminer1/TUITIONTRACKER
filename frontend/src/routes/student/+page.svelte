<script lang="ts">
    // STUDENT DASHBOARD
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { Calendar } from "$lib/components/ui/calendar/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    
    import {
        type DateValue,
        DateFormatter,
        getLocalTimeZone,
    } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { CalendarIcon } from "@lucide/svelte"
    
    let { data } = $props()
    let { student, sessions } = data

    let sessionDate = $state<DateValue | undefined>()
    const df = new DateFormatter("en-US", {
        dateStyle: "long"
    })
</script>

<div class="flex flex-col h-screen p-4 items-center">
    <Card.Root class="w-[90%] mb-8">
        <Card.Header>
            <Card.Title>Student Stats</Card.Title>
            <Card.Description>{student.name}</Card.Description>
        </Card.Header>
        <Card.Content class="grid grid-cols-4">
            <div class="flex flex-col items-center">
                <p class="text-xl">{sessions.length}</p>
                <p class="text-sm">Sessions</p>
            </div>
            <div class="flex flex-col items-center">
                <p class="text-xl">{sessions.length}</p>
                <p class="text-sm text-center">Most Recent Grade</p>
            </div>
            <div class="flex flex-col items-center">
                <p class="text-xl">{sessions.length}</p>
                <p class="text-sm text-center">Personal Best Grade</p>
            </div>
            <div class="flex flex-col items-center">
                <p class="text-xl">{sessions.length}</p>
                <p class="text-sm text-center">Sessions</p>
            </div>
        </Card.Content>
    </Card.Root>

    <Table.Root class="m-2 w-[97%]">
        <Table.Caption>Sessions</Table.Caption>
        <Table.Header>
            <Table.Row>
            <Table.Head>Date</Table.Head>
            <Table.Head>Topics</Table.Head>
            <Table.Head class="text-1/3">Notes</Table.Head>
            <Table.Head class="text-right w-1/5">Homework</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each sessions as session}
             <Table.Row>
                <Table.Cell class="font-medium">{session.date}</Table.Cell>
                <Table.Cell>{session.topics}</Table.Cell>
                <Table.Cell>{(session.notes as string).split("\n").length}</Table.Cell>
                <Table.Cell class="text-right">{session.homework ?? "-"}</Table.Cell>
            </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
    <div>
    </div>

    <!-- ADD SESSION -->
    <Dialog.Root>
      <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
        Add Session
    </Dialog.Trigger>
      <Dialog.Content class="w-full">
        <Dialog.Header>
          <Dialog.Title>New Session</Dialog.Title>
          <Dialog.Description>
            Enter session details
          </Dialog.Description>
        </Dialog.Header>

        <form method="POST" action="?/addSession" class="flex flex-col gap-4 justify-center items-center">
             <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="topics">Topic(s)</Label>
                <Input type="topics" name="topics" placeholder="eg. Calculus, Trigonometry" />
            </div>
            <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="duration">Duration</Label>
                <Input type="duration" name="duration" placeholder="eg. 1h30min" />
            </div>
            <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="subject">Subject</Label>
                <input type="hidden" name="sessionDate" bind:value={sessionDate}>
                <Popover.Root>
                    <Popover.Trigger>
                        {#snippet child({ props })}
                        <Button
                            variant="outline"
                            class={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !sessionDate && "text-muted-foreground"
                            )}
                            {...props}
                        >
                            <CalendarIcon class="mr-2 size-4" />
                            {sessionDate ? df.format(sessionDate.toDate(getLocalTimeZone())) : "Select a date"}
                        </Button>
                        {/snippet}
                    </Popover.Trigger>
                    <Popover.Content class="w-auto p-0">
                        <Calendar bind:value={sessionDate} type="single" initialFocus />
                    </Popover.Content>
                </Popover.Root>
            </div>
            <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="notes">Notes</Label>
                <Textarea name="notes" placeholder="Add notes here" />
            </div>
            <Button type="submit" class="w-1/2">Submit</Button>
        </form>
      </Dialog.Content>
    </Dialog.Root>
</div>