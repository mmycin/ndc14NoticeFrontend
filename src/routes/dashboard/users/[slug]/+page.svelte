<script>
    // @ts-nocheck
    import { getID, IsTokenExpired, IsValidToken } from "$lib/Utils/Token";
    import { DeleteItem } from "$lib/Utils/Delete";
    import Notification from "$lib/Utils/Notify";
    import { goto } from "$app/navigation";
    import { fade, fly } from "svelte/transition";
    import axios from "axios";
    import { onMount } from "svelte";

    export let data;

    let info = {};
    let accountInfo = {};
    let isLoading = true;

    async function deleteAccount() {
        try {
            const url = `${import.meta.env.VITE_API_URL}/users/delete/${info.ID}`;
            DeleteItem(url, "/dashboard/users", window.location.href);
        } catch (error) {
            Notification("Error deleting message", "error");
            console.error(error);
        }
    }

    onMount(async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (token && IsValidToken(token) && !IsTokenExpired(token)) {
                const ID = getID(token);
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/users/id/${ID}`
                );
                accountInfo = await response.data.data;
            }
        } catch (e) {
            console.error(e);
        }

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/id/${data.slug}`
            );
            info = response.data.data;
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            isLoading = false;
        }
    });

    const goBack = () => {
        window.history.back();
    };

    const handleEdit = () => {
        goto("/dashboard/users/edit", {
            state: { id: info.ID },
        });
    };
</script>

<div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8"
>
    <div
        class="max-w-4xl mx-auto space-y-6"
        in:fade={{ duration: 300, delay: 150 }}
    >
        <!-- Header Card -->
        <div
            class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700/30"
        >
            <h1
                class="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-blue-500 text-center"
            >
                User Profile
            </h1>
            <p class="text-gray-400 text-center mt-3 text-sm sm:text-base">
                Complete profile details for the user
            </p>
        </div>

        {#if isLoading}
            <!-- Enhanced Loading Skeleton -->
            <div
                class="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700/30 space-y-6"
            >
                <div class="flex justify-center">
                    <div
                        class="w-32 h-32 rounded-full bg-gray-700/50 animate-pulse"
                    ></div>
                </div>
                {#each Array(6) as _}
                    <div class="space-y-2">
                        <div
                            class="h-4 bg-gray-700/50 rounded w-1/4 animate-pulse"
                        ></div>
                        <div
                            class="h-8 bg-gray-700/50 rounded w-3/4 animate-pulse"
                        ></div>
                    </div>
                {/each}
            </div>
        {:else}
            <!-- User Information Card -->
            <div
                class="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-700/30 space-y-6"
                in:fly={{ y: 20, duration: 300, delay: 300 }}
            >
                <!-- Admin Badge -->
                {#if info.isAdmin}
                    <div class="mb-4 flex justify-center">
                        <span
                            class="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-gray-900 text-sm font-bold shadow-lg transform hover:scale-105 transition-transform duration-300"
                        >
                            <span class="mr-2">★</span> Administrator
                        </span>
                    </div>
                {/if}

                <!-- User Avatar -->
                <div class="flex justify-center mb-8">
                    <div
                        class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-4xl font-bold text-white shadow-xl transform hover:scale-105 transition-transform duration-300 border-4 border-gray-800"
                    >
                        {info.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </div>
                </div>

                <!-- Information Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {#each [{ label: "Name", value: info.fullName }, { label: "Username", value: info.username }, { label: "Email Address", value: info.email, isEmail: true }, { label: "Roll Number", value: info.roll }, { label: "Batch", value: info.batch }, { label: "Phone Number", value: info.phone.startsWith("+88") ? info.phone : "+88" + info.phone }, { label: "Facebook Profile", value: info.fbLink, isLink: true }] as field}
                        <div
                            class="p-6 bg-gray-900/50 rounded-xl hover:bg-gray-900/70 transition-colors duration-300 backdrop-blur-sm border border-gray-700/30"
                        >
                            <div class="text-sm font-medium text-gray-400 mb-2">
                                {field.label}
                            </div>
                            {#if field.isEmail}
                                <a
                                    href="mailto:{field.value}"
                                    class="text-lg text-blue-400 hover:text-blue-300 transition-colors duration-200 break-all"
                                >
                                    {field.value}
                                </a>
                            {:else if field.isLink}
                                <a
                                    href={field.value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-lg text-blue-400 hover:text-blue-300 transition-colors duration-200 break-all"
                                >
                                    {field.value}
                                </a>
                            {:else}
                                <div class="text-lg text-white">
                                    {field.value}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>

                <!-- Action Buttons -->
                <div class="mt-8 flex flex-wrap justify-center gap-4">
                    <button
                        on:click={goBack}
                        class="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        Go Back
                    </button>

                    {#if accountInfo.isAdmin && !info.isAdmin}
                        <button
                            on:click={deleteAccount}
                            class="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold shadow-lg hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Delete Account
                        </button>
                        <button
                            on:click={handleEdit}
                            class="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold shadow-lg hover:from-teal-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Edit
                        </button>
                    {/if}

                    {#if accountInfo.ID === info.ID}
                        <button
                            on:click={() => goto("/dashboard/account/edit")}
                            class="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold shadow-lg hover:from-teal-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Edit
                        </button>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</div>
