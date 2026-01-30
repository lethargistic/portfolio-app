<script lang="ts">
    import {page} from '$app/state';
</script>

<div class="cont">
    <div class="cont-cont">
        <h1>{page.status} {page.error?.message}</h1>
        <p class="quote">
            Rest in spaghetti,<br>
            Never forgetti<br><span class="tini"> - HGModernism, 2025</span>
        </p>
    </div>
    <div class="img-cont">
        <img src="/img/rest-in-spaghetti.svg" alt="rest in spaghetti">
    </div>
</div>

<style>
    .cont {
        width: 100vw;
        height: 100vh;
        background-color: #232323;
        color: white;

        display: flex;
        place-items: center start;

        ::selection {
            color: black;
            background-color: white;
        }

        & .cont-cont {
            display: grid;
            gap: 1rem;
            margin-left: 2rem;

            & h1 {
                font-size: 6rem;
            }

            & .quote {
                width: 50vw;
                font-family: "Fira Code", sans-serif;
                font-size: 4rem;
                display: grid;

                & .tini {
                    font-family: "Fira Code", sans-serif;
                    margin-top: 1rem;
                    font-size: 1.7rem;
                    margin-left: auto;
                }
            }
        }

        & .img-cont {
            width: 100%;
            display: grid;
            place-items: center;

            img {
                width: 70%;
                user-select: none;
            }
        }
    }
</style>