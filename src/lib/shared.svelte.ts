export let currentLang = $state({lang: "en"});

export const MAX_CHIME_FOLDS = 4;
export const MIN_CHIME_FOLDS = 1;

export let fiend = $state({state: false});
export let editorMode = $state({state: false});
export let editing = $state({state: false});
export let editorSocials: {state: Array<any>} = $state({state: []});
export let editbar = $state({
    open: false,
    skip: false,
    focused: '',
    focusedIx: 0,
    holding: false
});
export let activeEditor = $state({state: ''})