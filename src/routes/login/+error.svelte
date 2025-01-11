<script>
    import { page } from "$app/state";
    console.log("hello");
    console.log(page.error);
</script>

<h1 class="text-white">{page.status}: {page.error}</h1>