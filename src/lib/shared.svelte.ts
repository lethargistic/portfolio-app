import type {ActionData} from "../../.svelte-kit/types/src/routes/$types";

export let currentLang = $state({lang: "en"});

export const MAX_CHIME_FOLDS = 4;
export const MIN_CHIME_FOLDS = 1;

export let fiend = $state({state: false});
export let editorMode = $state({state: false});
export let editing = $state({state: false});
export let editorSocials: {state: Array<any>} = $state({state: []});
export let sidebar = $state({
    open: false,
    skip: false,
    focused: ''
});
export let activeEditor = $state({state: ''})