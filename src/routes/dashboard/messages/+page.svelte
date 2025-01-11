<script>
    // @ts-nocheck
    import axios from "axios";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { DeleteItem } from "$lib/Utils/Delete";
    import Notification from "$lib/Utils/Notify";

    let messages = [];
    let isLoading = true;

    // Function to fetch messages
    async function fetchMessages() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/contacts/`);
            messages = response.data.data;

            // Sort messages from latest to oldest by CreatedAt
            messages.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            isLoading = false;
        }
    }

    onMount(fetchMessages);

    const handleView = (id) => {
        goto(`/dashboard/messages/${id}`);
    };

    const handleDelete = async (id) => {
        const url = `${import.meta.env.VITE_API_URL}/contacts/${id}`;
        try {
            const success = await DeleteItem(url);
            if (success) {
                fetchMessages();
            } else {
                Notification("Error deleting message", "error");
            }
        } catch (e) {
            Notification("Error deleting message", "error");
            console.error(e);
        }
    };
</script>

<div class="text-white">
    <h1 class="text-2xl font-semibold mb-6 text-center sm:text-3xl">Messages</h1>

    {#if isLoading}
        <p class="text-center text-gray-400">Loading...</p>
    {:else if messages.length === 0}
        <p class="text-center text-gray-400">No messages available.</p>
    {:else}
        <div class="space-y-6">
            {#each messages as message (message.ID)}
                <div class="flex flex-col sm:flex-row justify-between items-center sm:items-start p-4 bg-gray-800 md:bg-gray-900 rounded-lg shadow-xl hover:bg-gray-800 transition duration-300 transform hover:scale-105">
                    <div class="flex-1 mb-4 sm:mb-0">
                        <div class="flex flex-wrap items-center justify-between border-b border-gray-900 pb-2 mb-3">
                            <div class="flex-1">
                                <p class="font-semibold text-lg text-white">{message.name}</p>
                            </div>
                            <div class="flex-1">
                                <p class="text-sm text-gray-400">{message.roll}</p>
                            </div>
                            <div class="flex-2">
                                <p class="text-sm text-gray-300 truncate">{message.message.slice(0, 30)}...</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                        <button 
                            class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition duration-200 text-sm w-full sm:w-auto"
                            on:click={() => handleView(message.ID)}>
                            View
                        </button>
                        <button 
                            class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-400 transition duration-200 text-sm w-full sm:w-auto"
                            on:click={() => handleDelete(message.ID)} >
                            Delete
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    /* Mobile view */
    @media (max-width: 640px) {
        .text-white {
            padding: 1rem;
        }

        .space-y-6 {
            margin-bottom: 1.5rem;
        }

        .flex {
            flex-direction: column;
        }

        .flex-1 {
            margin-bottom: 1rem;
        }

        .truncate {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .w-full {
            width: 100%;
        }

        .flex-row {
            display: flex;
            flex-direction: row !important;
        }

        .px-3 {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
        }

        .py-1 {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
        }

        .gap-3 {
            gap: 12px;
        }

        .flex-col {
            flex-direction: column !important;
        }

        .rounded-lg {
            border-radius: 0.5rem;
        }

        .shadow-xl {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
        }
    }

    /* Table-like Layout */
    .flex-wrap {
        flex-wrap: wrap;
    }

    .border-b {
        border-bottom: 1px solid #4B5563; /* Darker border color */
    }

    .pb-2 {
        padding-bottom: 0.5rem;
    }

    .mb-3 {
        margin-bottom: 1rem;
    }

    .flex-2 {
        flex: 2;
    }

    .flex-1 {
        flex: 1;
    }

    .rounded-lg {
        border-radius: 0.5rem;
    }

    .shadow-xl {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    }
</style>
