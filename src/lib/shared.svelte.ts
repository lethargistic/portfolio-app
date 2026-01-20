export let currentLang = $state({lang: "en"});

export const MAX_CHIME_FOLDS = 4;
export const MIN_CHIME_FOLDS = 1;

export let settings: Record<string, { display: string, desc: string, state: boolean, admin: boolean }> = $state({
    sounds: {
        display: 'sounds',
        desc: 'You found the settings! Just as planned. <br>Enable if you can, this setting is recommended.',
        state: false,
        admin: false
    },
    noFlashing: {
        display: 'remove flashing',
        desc: 'Disables optical illusions & flashing effects.<br> You may enable to help prevent seizures.',
        state: false,
        admin: false
    },
    extendedLinktree: {
        display: 'extended linktree',
        desc: 'Shows the cursed socials in the linktree section. Dare to look? Actually, don\'t, they\'re boring. ',
        state: false,
        admin: false
    },
    performance: {
        display: 'performance',
        desc: 'Reduces chunkier animations if your device is a professional gaming potato. ',
        state: false,
        admin: false
    },
    editor: {
        display: 'editor mode',
        desc: 'The geese give you the pen admiring your sheer presence.',
        state: false,
        admin: true
    },
})

export let fiend = $state({state: false});
export let editing = $state({state: false});
export let editbar = $state<Record<string, any>>({
    open: false,
    skip: false,
    focused: '',
    focusedIx: 0,
    holding: false,
    social_data: [] as Array<Record<string, any>>,
    proj_data: [] as Array<Record<string, any>>
});
export let activeEditor = $state({state: ''});

export const handleEdit = (e: Event, name: string, editor: string) => {
    if (!fiend.state) return;
    if (e instanceof KeyboardEvent && e.key !== ' ') return;

    editbar.focused = name;
    if (activeEditor.state === editor) {
        editbar.open = !editbar.open;

        editbar.skip = true;
    }
}