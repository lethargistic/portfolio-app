<script>
    const {data: proj} = $props();
</script>

<main>
    <div class="cont">
        <img src={proj.img} alt={proj.name} />
        <div class="info">
            <h1>{proj.display_name}</h1>
            <p class="separator">~~~</p>
            <p class="desc">{proj.long_desc}</p>
        </div>
    </div>
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        background-color: var(--seg-web-bg);
        color: white;

        display: flex;
        align-items: center;
        justify-content: center;

        & .cont {
            width: 70%;
            height: 30%;

            display: flex;

            & img {
                height: 100%;
                aspect-ratio: 16/9;
            }
        }
    }
</style>