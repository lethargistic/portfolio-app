export let currentLang = $state({lang: "en"});

export const MAX_CHIME_FOLDS = 4;
export const MIN_CHIME_FOLDS = 1;

export let settings: Record<string, {display: string, desc: string, state: boolean}> = $state({
    sounds: {display: 'sounds', desc: 'You found the settings! Just as planned. <br>Enable if you can, this setting is recommended.', state: false},
    flashing: {display: 'flashing effects',  desc: 'Enables optical illusions & flashing effects.<br> You may disable to help prevent seizures.', state: true},
    extendedLinktree: {display: 'extended linktree', desc: 'Shows the cursed socials in the linktree section. Dare to look? Actually, don\'t, they\'re boring. ', state: false},
    performance: {display: 'performance', desc: 'Reduces chunkier animations if your device is a professional gaming potato. ', state: false},
})

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