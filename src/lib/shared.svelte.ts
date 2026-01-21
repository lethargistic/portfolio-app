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
    proj_data: [] as Array<Record<string, any>>,
    proj_details_data: [] as Array<Record<string, any>>
});
export let activeEditor = $state({state: ''});

export const handleItemEdit = (e: Event, name: string, editor: string) => {
    if (!fiend.state) return;
    if (e instanceof KeyboardEvent && e.key !== ' ') return;

    editbar.focused = name;
    if (activeEditor.state === editor) {
        editbar.open = true;

        editbar.skip = true;
    }
}

export let windowGlobals = $state({inner_width: 0, inner_height: 0});
export let prevMousePos = $state<{ x: number, y: number }>( {x: 0, y: 0} );
export const handlePositioning = (e: PointerEvent, item: Record<string, any>, name: string, editor: string) => {
    if (!activeEditor.state.startsWith(editor)) return;
    if (editbar.holding && name === editbar.focused) {
        // should ideally be adjusted for the size of what im moving being bigger
        // but i couldn't get that to work so pointer capture go brrr
        const dx = e.clientX - prevMousePos.x;
        const dy = e.clientY - prevMousePos.y;

        if (editbar.focusedIx === -1 || !windowGlobals.inner_width || !windowGlobals.inner_height) return;

        const leftVw = dx / windowGlobals.inner_width * 100;
        const topVh = dy / windowGlobals.inner_height * 100;

        item.left_vw += leftVw;
        item.top_vh += topVh;


        // rounding
        item.left_vw = parseFloat(item.left_vw.toFixed(2));
        item.top_vh = parseFloat(item.top_vh.toFixed(2));
        prevMousePos.x = e.clientX;
        prevMousePos.y = e.clientY;
    }
}

export const handleItemHolding = (e: PointerEvent) => {
    if (activeEditor.state.endsWith('positioning')) {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        prevMousePos.x = e.clientX;
        prevMousePos.y = e.clientY;

        editbar.holding = true;
    }
}


export const handleItemLeaving = (e: PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    editbar.holding = false;
}


