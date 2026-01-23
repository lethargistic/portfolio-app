import {computePosition, flip, shift} from "@floating-ui/dom";
import type {Attachment} from "svelte/attachments";
import {browser} from "$app/environment";

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

export let modal = $state<Record<string, any>>({
    open: false,
    selected: null,
    selectedIx: null,
    left: false,
    travel: false
})

export const handleItemEdit = (e: Event, name: string, editor: string) => {
    if (!editing.state) return;
    if (!fiend.state) return;
    if (e instanceof KeyboardEvent && e.key !== ' ') return;

    editbar.focused = name;
    if (activeEditor.state === editor) {
        editbar.open = true;
        editbar.skip = true;
    }
}

export let windowGlobals = $state({inner_width: 0, inner_height: 0});
export let prevMousePos = $state<{ x: number, y: number }>({x: 0, y: 0});
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

export const vwToPx = (vw: number) => {
    return (vw * windowGlobals.inner_width) / 100
}
export const pxToVw = (px: number) => {
    return (px * 100) / windowGlobals.inner_width
}

export const positionTooltip = (parent: boolean | HTMLElement | null) => {
    return async (tooltip: HTMLElement) => {
        if (!tooltip) return;
        if (parent === null) return;
        const anchor = parent === true ? tooltip.parentElement : parent;
        if (!anchor) return;

        const {x, y} = await computePosition(anchor, tooltip, {
            placement: 'top',
            middleware: [flip(), shift({padding: 6})]
        })
        Object.assign(tooltip.style, {
            left: `${x}px`,
            top: `${y}px`
        })
    }
}

export const hackeryTextAnim = (elem: HTMLElement, speed: number = 0.4, text: string = '') => {
    const oldText = text ? text : elem.textContent || '';
    const chars = `/@{)=]!?+Δ  √˂˃ˆ⌀♯01;`;
    const trailLength = 10;
    let iteration = 0;
    let blinkCounter = 0;
    const blinkSpeed = 30;
    let rafId: number;

    const animate = () => {
        const currentPos = Math.floor(iteration);
        let result = oldText.slice(0, currentPos);

        if (currentPos < oldText.length) {
            for (let i = 0; i < trailLength && currentPos + i < oldText.length; i++) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }

            blinkCounter++;
            if (Math.floor(blinkCounter / blinkSpeed) % 2 === 0) {
                result += '|';
            } else {
                result += ' ';
            }
        }

        elem.textContent = result;

        if (iteration >= oldText.length) {
            elem.textContent = oldText;
        } else {
            iteration += speed;
            rafId = requestAnimationFrame(animate);
        }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
        cancelAnimationFrame(rafId);
        elem.textContent = oldText;
    };
};
export let hackeryAnimObserver: IntersectionObserver | null = null;
if (browser) {
    hackeryAnimObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                hackeryTextAnim(entry.target as HTMLElement, 0.4);
                hackeryAnimObserver?.unobserve(entry.target);
            }
        });
    });
}
