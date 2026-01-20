<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import * as three from "three";
    import {CSS3DRenderer, CSS3DObject} from 'three/addons/renderers/CSS3DRenderer.js';
    import {SeparatorShape} from "$lib/utils/utils";
    import ChimeSVGFilling from "$lib/hangies/ChimeSVG.svelte";
    import {
        activeEditor,
        MAX_CHIME_FOLDS,
        MIN_CHIME_FOLDS,
        editbar,
        handleEdit
    } from "$lib/shared.svelte";
    import SVGThreeStars from "$lib/hangies/separators/separators/SVGThreeStars.svelte";
    import SVGStar from "$lib/hangies/separators/separators/SVGStar.svelte";
    import SVGCircles from "$lib/hangies/separators/separators/SVGCircles.svelte";
    import SVGLantern from "$lib/hangies/separators/separators/SVGLantern.svelte";
    import Icon from "$lib/Icon.svelte";

    let props = $props();
    let {social: socialProp} = props;

    let social = $derived(socialProp);
    let folds = $derived(social.folds);
    let foldCount = $derived(Number(social.fold_count));
    let separatorShape = $derived(social.separator_shape);

    const chimeRopeYOffset = $derived.by(() => {
        switch (separatorShape) {
            case SeparatorShape.ThreeStars:
                return -0.1;
            case SeparatorShape.Ok:
                return 0.05;
            case SeparatorShape.Tilde:
                return -0.2;
            case SeparatorShape.Lantern:
                return 0.02;
            case SeparatorShape.Barer:
                return 0;
            default:
                return 0;
        }
    });

    // it's not really a chime but it just kinda stuck
    //
    // the math here on some stuff is just wrong or me misinterpreting the physics
    // it works well, but this is not some etalonne code one thing for sure

    $effect(() => {
        if (foldCount && (foldCount < MIN_CHIME_FOLDS || foldCount > MAX_CHIME_FOLDS)) {
            foldCount = 1;
            console.warn("Chime has an invalid amount of folds, setting to 1");
        }
    });

    const WIDTH_DIVIDER = 2;
    const HEIGHT_MULTIPLIER = 1.5;

    const VERLET_CONSTRAINT_COUNT = 50;

    // this should've been 0.1 to match the WebGL units and css3DRenderer ones (according to a thread on the forums)
    // but I just winged it with this one
    // and when i decided to finally find the actual factor and change it, this was apparently a good thing
    // because 0.1 completely breaks any kinda css blur
    const CHIME_SCALE = 0.0025;
    // just winging it basically
    const APPROX_CHIME_CSS_SIZE_TO_UNITS_MULT = 0.61;
    // this is also shifted to move the width a little bit
    const CHIME_CSS_SIZE_WIDTH_MULT_ADJUSTED = 0.5;

    const treeRopeSegments = 3;
    const treeRopeParticleCount = treeRopeSegments + 1;
    const treeRopeLength = $derived(social.tree_rope_length);


    const separatorSegments = 2;
    const separatorParticleCount = separatorSegments + 1;
    let separatorHeight: number | null = $state(null);
    let separatorLength = $derived.by(() => {
        if (!separatorHeight) return 0;
        return separatorHeight * CHIME_SCALE * APPROX_CHIME_CSS_SIZE_TO_UNITS_MULT;
    });

    const chimeRopeSegments = 30;
    const chimeRopeParticleCount = chimeRopeSegments + 1;
    const chimeRopeLength = $derived(isNaN(social.chime_rope_length) ? 1 : social.chime_rope_length);

    const chimeSegments = 2;
    const chimeParticleCount = chimeSegments + 1;
    let chimeHeight: number | null = $state(null);
    let chimeLength = $derived.by(() => {
        if (!chimeHeight) return 0;
        return chimeHeight * CHIME_SCALE * APPROX_CHIME_CSS_SIZE_TO_UNITS_MULT;
    });

    class Particle {
        pos: three.Vector3;
        oldPos: three.Vector3;
        mass: number;
        pinned: boolean;

        constructor(x: number, y: number, z: number, mass = 1, pinned = false) {
            this.pos = new three.Vector3(x, y, z);
            this.oldPos = new three.Vector3(x, y, z);
            this.mass = mass;
            this.pinned = pinned;
        }

        update() {
            if (this.pinned) return;

            const v = new three.Vector3().subVectors(this.pos, this.oldPos);
            this.oldPos.copy(this.pos);

            // physicists: i fear no man
            // but that thing, that thing... air resistance
            // it scares me
            v.multiplyScalar(0.45);

            this.pos.add(v);
        }

        applyForce(force: three.Vector3) {
            if (this.pinned) return;
            // F = ma -> a = F/m
            const acc = force.clone().divideScalar(this.mass);
            this.pos.add(acc);
        }

        constrain(other: Particle, distance: number) {
            const dt = new three.Vector3().subVectors(other.pos, this.pos);
            const currentDist = dt.length();
            const diff = (currentDist - distance) / currentDist;
            const offset = dt.multiplyScalar(diff * 0.8);

            if (!this.pinned) this.pos.add(offset);
            if (!other.pinned) other.pos.sub(offset);
        }
    }

    let canvas: HTMLCanvasElement | null = $state(null);
    let cssContElem: HTMLElement | null = $state(null);

    let chimeSVGCutoutElem: Node | null = $state(null);
    let chimeSVGMaskUrl = $derived.by(() => {
        // reactivity
        if (foldCount) {
        }

        if (!chimeSVGCutoutElem) return '';
        const svgStr = new XMLSerializer().serializeToString(chimeSVGCutoutElem);
        const blob = new Blob([svgStr], {type: 'image/svg+xml'});
        return URL.createObjectURL(blob);
    })

    const fov = 75;
    let canvasWidth = $state(0);
    let canvasHeight = $state(0);
    const aspect = $derived.by(() => {
        if (!canvas) return 0;
        return canvasWidth / canvasHeight;
    });
    const near = 0.1;
    const far = 5;

    let treeRope: three.Line | null = $state(null);
    let separatorObj: CSS3DObject | null = $state(null);
    let chimeRope: three.Line | null = $state(null);
    let separatorElem: HTMLElement | null = $state(null);
    let chimeElem: HTMLElement | null = $state(null);
    let chimeObj: CSS3DObject | null = $state(null);
    let renderer: three.WebGLRenderer | null = $state(null);
    let cssRenderer: CSS3DRenderer | null = $state(null);
    let scene: three.Scene | null = $state(null);

    let camera: three.PerspectiveCamera | null = $state(null);

    let windowInnerWidth = $state(null);
    let windowInnerHeight = $state(null);

    $effect(() => {
        if (!canvas || !windowInnerWidth || !windowInnerHeight
            || !camera || !renderer || !cssRenderer || !cssContElem) return;
        canvas.width = windowInnerWidth / WIDTH_DIVIDER;
        canvas.height = windowInnerHeight * HEIGHT_MULTIPLIER;
        cssContElem.style.top = canvas.offsetTop + "px";
        cssContElem.style.width = windowInnerWidth;
        cssContElem.style.height = windowInnerHeight;

        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        renderer.setSize(canvas.width, canvas.height);
        cssRenderer.setSize(canvas.width, canvas.height);
    })

    let treeRopeParticles: Particle[] = [];
    let separatorParticles: Particle[] = [];
    let chimeRopeParticles: Particle[] = [];
    let chimeParticles: Particle[] = [];

    let mouseXDoubled = $state(0);
    let mouseYDoubled = $state(0);
    let prevMouseXDoubled = $state(0);
    let prevMouseYDoubled = $state(0);
    let time = $state(Math.floor(Math.random() * MAX_CHIME_FOLDS));

    const handleMouseMove = (e: MouseEvent) => {
        if (!windowInnerWidth || !windowInnerHeight) return;
        prevMouseXDoubled = mouseXDoubled;
        prevMouseYDoubled = mouseYDoubled;
        mouseXDoubled = (e.clientX / windowInnerWidth) * 2 - 1;
        mouseYDoubled = (e.clientY / windowInnerHeight) * 2 - 1;
    }

    onMount(() => {
        if (!canvas || !cssContElem || !chimeElem || !separatorElem) return;
        renderer = new three.WebGLRenderer({antialias: false, alpha: true, canvas});

        cssRenderer = new CSS3DRenderer({element: cssContElem});

        camera = new three.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2;

        scene = new three.Scene();

        const startY = 1.6;

        for (let i = 0; i < treeRopeParticleCount; i++) {
            const y = startY - (i / treeRopeSegments) * treeRopeLength;
            const pinned = i === 0;
            treeRopeParticles.push(new Particle(0, y, 0, 30, pinned))
        }

        for (let i = 0; i < separatorParticleCount; i++) {
            const y = startY - (i / separatorSegments) * separatorLength;
            const pinned = i === 0;
            separatorParticles.push(new Particle(0, y, 0, 100 * (i + 1), pinned))
        }

        for (let i = 0; i < chimeRopeParticleCount; i++) {
            const y = startY - (i / chimeRopeSegments) * chimeRopeLength;
            const pinned = i === 0;

            const positionRatio = i / chimeRopeSegments;
            const mass = 100 - positionRatio * 99;

            chimeRopeParticles.push(new Particle(0, y, 0, mass, pinned))
        }

        for (let i = 0; i < chimeParticleCount; i++) {
            const y = startY - (i / chimeSegments) * chimeLength;
            const pinned = i === 0;
            chimeParticles.push(new Particle(0, y, 0, 10 * (i === 1 ? 2 : 100), pinned))
        }

        const treeRopeGeometry = new three.BufferGeometry();
        const treeRopePositions = new Float32Array(treeRopeParticleCount * 3);
        treeRopeGeometry.setAttribute('position', new three.BufferAttribute(treeRopePositions, 3))
        treeRope = new three.Line(
            treeRopeGeometry,
            new three.LineBasicMaterial({color: 0x111111})
        )
        scene.add(treeRope);

        separatorObj = new CSS3DObject(separatorElem);
        separatorObj.scale.set(CHIME_SCALE, CHIME_SCALE, CHIME_SCALE);
        scene.add(separatorObj);

        const chimeRopeGeometry = new three.BufferGeometry();
        const chimeRopePositions = new Float32Array(chimeRopeParticleCount * 3);
        chimeRopeGeometry.setAttribute('position', new three.BufferAttribute(chimeRopePositions, 3))
        chimeRope = new three.Line(
            chimeRopeGeometry,
            new three.LineBasicMaterial({color: 0x111111})
        )
        scene.add(chimeRope);

        chimeObj = new CSS3DObject(chimeElem);
        chimeObj.scale.set(CHIME_SCALE, CHIME_SCALE, CHIME_SCALE);
        scene.add(chimeObj);

        adjustPathDimensionTracking();
        renderer.render(scene, camera);
        animate();
    })

    let sceneRotationX = 0;
    let sceneRotationY = 0;
    const rotationLerpFactor = 0.1;

    const kTime = $derived(0.016 + ((foldCount / MAX_CHIME_FOLDS) - 1) * (-0.05));
    const animate = () => {
        if (!treeRope || !chimeRope || !chimeObj || !renderer || !camera || !scene || !separatorObj || !cssRenderer) return;

        requestAnimationFrame(animate);
        time += kTime;

        const mouseDx = (mouseXDoubled - prevMouseXDoubled) * 50;
        const mouseDy = (mouseYDoubled - prevMouseYDoubled) * 50;

        const chimeScreenX = chimeObj.position.x / 2;
        const chimeScreenY = chimeObj.position.y / 2;

        const dx = mouseXDoubled - chimeScreenX;
        const dy = mouseYDoubled - chimeScreenY;
        const distanceFromChime = Math.sqrt(dx * dx + dy * dy);

        const distanceFalloff = Math.min(distanceFromChime, 1);

        const ambientWindX = Math.sin(time * 0.3) * 0.9 + Math.sin(time * 0.17) * 0.03;
        const ambientWindY = Math.cos(time * 0.25) * 0.2;

        const windForce = new three.Vector3(
            mouseDx * 0.8 * distanceFalloff + ambientWindX,
            -mouseDy * 0.4 * distanceFalloff + ambientWindY,
            0
        );

        const gravity = new three.Vector3(0, -0.08, 0);

        // forces
        treeRopeParticles.forEach((p) => {
            p.applyForce(gravity.clone().multiplyScalar(p.mass));
            p.applyForce(windForce.clone().multiplyScalar(0.01));
            p.update();
        })

        separatorParticles.forEach((p, i) => {
            p.applyForce(gravity.clone().multiplyScalar(p.mass));
            const windMult = i === 1 ? 0.01 : 0.001;
            p.applyForce(windForce.clone().multiplyScalar(windMult));
            p.update();
        });

        chimeRopeParticles.forEach((p, i) => {
            p.applyForce(gravity.clone().multiplyScalar(p.mass));

            const positionRatio = i / (chimeRopeParticles.length - 1);
            const windMultiplier = 0.01 + positionRatio * positionRatio * 0.01;

            p.applyForce(windForce.clone().multiplyScalar(windMultiplier));
            p.update();
        })

        chimeParticles.forEach((p, i) => {
            p.applyForce(gravity.clone().multiplyScalar(p.mass));
            const windMult = i === 1 ? 0.12 : 0.05;
            p.applyForce(windForce.clone().multiplyScalar(windMult));
            p.update();
        });

        // constraints
        for (let i = 0; i < VERLET_CONSTRAINT_COUNT; i++) {
            for (let j = 0; j < treeRopeParticles.length - 1; j++) {
                treeRopeParticles[j].constrain(
                    treeRopeParticles[j + 1],
                    treeRopeLength / treeRopeSegments
                )
            }

            for (let j = 0; j < separatorParticles.length - 1; j++) {
                separatorParticles[j].constrain(
                    separatorParticles[j + 1],
                    separatorLength / separatorSegments
                )
            }

            for (let j = 0; j < chimeRopeParticles.length - 1; j++) {
                chimeRopeParticles[j].constrain(
                    chimeRopeParticles[j + 1],
                    chimeRopeLength / chimeRopeSegments
                )
            }

            for (let j = 0; j < chimeParticles.length - 1; j++) {
                chimeParticles[j].constrain(
                    chimeParticles[j + 1],
                    chimeLength / chimeSegments
                )
            }

            separatorParticles[0].constrain(separatorParticles[1], separatorLength);
            chimeParticles[0].constrain(chimeParticles[1], chimeLength);

            // attachments
            separatorParticles[0].pos.copy(treeRopeParticles[treeRopeParticles.length - 1].pos);
            chimeRopeParticles[0].pos.copy(separatorParticles[separatorParticles.length - 1].pos);
            chimeParticles[0].pos.copy(chimeRopeParticles[chimeRopeParticles.length - 1].pos);

            chimeRopeParticles[0].pos.y -= chimeRopeYOffset;
            chimeParticles[0].pos.y -= social.chime_y_offset;
        }

        const treeRopePos = treeRope.geometry.attributes.position.array;
        treeRopeParticles.forEach((p, i) => {
            treeRopePos[i * 3] = p.pos.x;
            treeRopePos[i * 3 + 1] = p.pos.y;
            treeRopePos[i * 3 + 2] = p.pos.z;
        })
        treeRope.geometry.attributes.position.needsUpdate = true;

        const separatorCenter = new three.Vector3()
            .addVectors(separatorParticles[0].pos, separatorParticles[1].pos)
            .multiplyScalar(0.5);
        separatorObj.position.copy(separatorCenter);

        const separatorDir = new three.Vector3()
            .subVectors(separatorParticles[1].pos, separatorParticles[0].pos)
            .normalize();
        separatorObj.rotation.z = Math.atan2(separatorDir.x, -separatorDir.y);

        const chimeRopePos = chimeRope.geometry.attributes.position.array;
        chimeRopeParticles.forEach((p, i) => {
            chimeRopePos[i * 3] = p.pos.x;
            chimeRopePos[i * 3 + 1] = p.pos.y;
            chimeRopePos[i * 3 + 2] = p.pos.z;
        })
        chimeRope.geometry.attributes.position.needsUpdate = true;

        const chimeCenter = new three.Vector3()
            .addVectors(chimeParticles[0].pos, chimeParticles[1].pos)
            .multiplyScalar(0.5);
        chimeObj.position.copy(chimeCenter);

        const chimeDir = new three.Vector3()
            .subVectors(chimeParticles[1].pos, chimeParticles[0].pos)
            .normalize();
        chimeObj.rotation.z = Math.atan2(chimeDir.x, -chimeDir.y);

        // slight 3d rotation
        const windStrength = Math.sqrt(windForce.x * windForce.x + windForce.y * windForce.y);
        const targetRotationY = 0.6 + windForce.x * 0.005 * windStrength;
        const targetRotationX = 0.2 + windForce.y * 0.005 * windStrength;

        sceneRotationY += (targetRotationY - sceneRotationY) * rotationLerpFactor;
        sceneRotationX += (targetRotationX - sceneRotationX) * rotationLerpFactor;

        scene.rotation.y = sceneRotationY;
        scene.rotation.x = sceneRotationX;

        // technically a bad idea to do this every rerender but i have no idea where else to hook it reliably
        adjustPathDimensionTracking();

        renderer.render(scene, camera);
        cssRenderer.render(scene, camera);
    }

    let chimeGroupWidth = $state(0);

    // the bindings don't work on these so oh well
    let trackedGroup: SVGPathElement | null = $state(null);
    const adjustPathDimensionTracking = () => {
        if (!trackedGroup) return;
        const rect = trackedGroup.getBoundingClientRect();
        chimeGroupWidth = rect.width;
    }

    //

    const handleChimeEdit = (e: Event) => {
        handleEdit(e, social.name, 'lnkt-modifying');
    }

    const socialInQuestion = $derived(editbar.social_data[editbar.focusedIx]);

    let foldContWidth: number | null = $state(null);
    let foldContHeight: number | null = $state(null);
    let prevMouseX = $state(0);
    let prevMouseY = $state(0);
    const handleChimeMoving = (e: PointerEvent) => {
        if (editbar.holding && social.name === editbar.focused) {
            e.preventDefault();
            // should ideally be adjusted for the size of what im moving being bigger
            // but i couldn't get that to works so pointer capture go brrr
            const dx = e.clientX - prevMouseX;
            const dy = e.clientY - prevMouseY;

            if (editbar.focusedIx === -1 || !windowInnerWidth || !windowInnerHeight || !foldContWidth || !foldContHeight) return;

            const leftVw = dx / windowInnerWidth * 100;
            const topVh = dy / windowInnerHeight * 100;

            socialInQuestion.left_vw += leftVw;
            socialInQuestion.top_vh += topVh;


            // rounding
            socialInQuestion.left_vw = parseFloat(socialInQuestion.left_vw.toFixed(2));
            socialInQuestion.top_vh = parseFloat(socialInQuestion.top_vh.toFixed(2));
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
        }
    }

    const handleChimeHolding = (e: PointerEvent) => {
        if (activeEditor.state === 'lnkt-positioning') {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;

            editbar.holding = true;
        }
    }
    const handleChimeLeaving = (e: PointerEvent) => {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        editbar.holding = false;
    }

    //

    const BASE_FONT_SIZE_REM = $state(0.87);
    const BASE_ICON_SIZE_PX = $state(19.5);
    const DEFAULT_CHIME_SIZE_VH = $state(82)

    let foldTitleOverride: string | null = $state(null);
    const handleSocialLink = (fold_link: string | null) => {
        if (fold_link?.startsWith('copy_')) {
            const toCopy = fold_link.replace('copy_', '');
            navigator.clipboard.writeText(toCopy);
            foldTitleOverride = `Copied: ${toCopy}!`;

            setTimeout(() => {
                foldTitleOverride = null;
            }, 4000)
        }
    }

    onDestroy(() => {
        if (!renderer) return;

        renderer.dispose()
        renderer.forceContextLoss()
    })
</script>
<svelte:window onresize={adjustPathDimensionTracking} bind:innerWidth={windowInnerWidth}
               bind:innerHeight={windowInnerHeight} onmousemove={handleMouseMove}/>
<canvas bind:this={canvas} bind:clientWidth={canvasWidth} bind:clientHeight={canvasHeight}
        class="chime-canvas"></canvas>
<div bind:this={cssContElem} class="chime-css"></div>
<div bind:this={separatorElem} bind:clientHeight={separatorHeight} class="separator">
    {#if separatorShape === SeparatorShape.Star}
        <svg class="star" width="142" height="142" viewBox="0 0 142 142" fill="none" xmlns="http://www.w3.org/2000/svg">
            <SVGStar/>
        </svg>
    {:else if separatorShape === SeparatorShape.ThreeStars}
        <svg class="three-stars" width="119" height="262" viewBox="0 0 119 262" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <SVGThreeStars/>
        </svg>
    {:else if separatorShape === SeparatorShape.Pebble}
        <div class="pebble"></div>
    {:else if separatorShape === SeparatorShape.Circles}
        <svg class="circles" width="78" height="142" viewBox="0 0 78 142" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <SVGCircles/>
        </svg>
    {:else if separatorShape === SeparatorShape.Ok}
        <!-- i was going to make it "duct tape" but i'm afraid that will
             blow my professionalism, what a loss... -->
        <p class="ok">ok</p>
    {:else if separatorShape === SeparatorShape.Tilde}
        <p class="tilde">~</p>
    {:else if separatorShape === SeparatorShape.Rectangle}
        <div class="rectangle" style={`width: ${chimeGroupWidth}px;`}></div>
    {:else if separatorShape === SeparatorShape.Bar}
        <div class="bar"></div>
    {:else if separatorShape === SeparatorShape.Barer}
        <!-- TODO maybe: remake it add a separator on top instead of being lame  -->
        <div class="barer-cont">
            <div class="barer"></div>
            <div class="bar"></div>
        </div>
    {:else if separatorShape === SeparatorShape.Lantern}
        <svg class="lantern" width="361" viewBox="0 0 361 619" fill="none" xmlns="http://www.w3.org/2000/svg">
            <SVGLantern/>
        </svg>
    {:else if separatorShape === SeparatorShape.None}
        <!-- literally nothing -->
    {:else}
        oh no
    {/if}
</div>
<div bind:this={chimeElem} class={`chime-cont ${editbar.holding ? 'prevent-select' : ''}`}
     bind:clientHeight={chimeHeight}
     style={`mask-image: url("${chimeSVGMaskUrl}");`}>
    <div class={`fold-cont
         ${activeEditor.state === 'lnkt-modifying' || activeEditor.state === 'lnkt-positioning' ? 'hover-focus' : ''}`}
         bind:clientHeight={foldContHeight} bind:clientWidth={foldContWidth}
         style={`grid-template-rows: repeat(${foldCount*2+1}, 1fr);`}
         role="presentation" onclick={handleChimeEdit} onkeydown={handleChimeEdit} onpointerdown={handleChimeHolding}
         onpointerup={handleChimeLeaving} onpointerleave={handleChimeLeaving} onpointermove={handleChimeMoving}>
        <!-- the spacer accounts for the 0.5 folds on the left that are missing because of the shape -->
        <div class="stat-half-spacer-left"></div>
        {#each folds as fold (social.name + fold.id + fold.slug)}
            {#if !fold.slug.startsWith('hide_')}
                {@const left = fold.left}
                {@const iconSize = social.chime_max_height_vh / (DEFAULT_CHIME_SIZE_VH / BASE_ICON_SIZE_PX)}
                <div class={`stat-fold ${left ? 'stat-fold-left' : 'stat-fold-right'}`}
                     style={`width: ${chimeGroupWidth*CHIME_CSS_SIZE_WIDTH_MULT_ADJUSTED}px;
                        --title-font-size: ${social.chime_max_height_vh/(DEFAULT_CHIME_SIZE_VH/BASE_FONT_SIZE_REM)}rem`}>
                    <a href={fold.link ? (fold.link.startsWith('copy_') ? null : fold.link) : social.link === 'none' ? null : social.link}
                       onclick={() => handleSocialLink(fold.link)}
                       target="_blank"
                       title={foldTitleOverride ? foldTitleOverride : (fold.hover ? fold.hover : '')}>
                        {#if fold.icon === 'hackatime'}
                            <img src={`/img/icons/${fold.icon}.webp`} width={iconSize} height={iconSize}
                                 alt={fold.slug}>
                        {:else if fold.icon === 'none'}
                            <!-- literally nothing -->
                        {:else}
                            <Icon name={fold.icon} width={iconSize}
                                  height={iconSize} currentColor={'#111111'}/>
                        {/if}
                        <p class={`${fold.centered ? 'stat-fold-display-centered' : ''}`}>{@html fold.display_override ?? fold.slug}</p>
                        <p class={`stat-fold-state ${fold.centered ? 'stat-fold-state-centered' : ''} ${fold.thick ? 'stat-fold-thick' : ''}`}>{fold.preface}{fold.state}{fold.postface}</p>
                    </a>
                </div>
            {/if}
        {/each}
    </div>
    {#snippet svgAndCutout()}
        <!-- the 0.5 accounts for the shape -->
        {@const svgHeight = 1578 * ((foldCount + 0.5) / (MAX_CHIME_FOLDS + 0.5))}
        <svg class="chime"
             style={`height: ${social.chime_max_height_vh/((MAX_CHIME_FOLDS+0.5)/(foldCount+0.5))}vh`} width="530"
             height={`${svgHeight}`} viewBox={`0 0 530 ${svgHeight}`} fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <ChimeSVGFilling {foldCount} bind:trackedGroup={trackedGroup} cutout={false}/>
        </svg>
        <svg bind:this={chimeSVGCutoutElem} class="chime chime-cutout"
             style={`height: ${social.chime_max_height_vh/((MAX_CHIME_FOLDS+0.5)/(foldCount+0.5))}vh`} width="530"
             height={`${svgHeight}`} viewBox={`0 0 530 ${svgHeight}`} fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <ChimeSVGFilling {foldCount} cutout={true}/>
        </svg>
    {/snippet}
    {@render svgAndCutout()}
</div>

<style>
    :global(.stat-fold > a > .factory-icon) {
        width: min-content;
        height: min-content;
        grid-row: span 2;
    }

    :global(.stat-fold > a > .factory-icon > svg) {
        grid-row: span 2;
        aspect-ratio: 1 / 1;
    }

    .prevent-select {
        user-select: none;
        -webkit-user-drag: none;
        user-drag: none;
    }

    .chime-canvas {
        position: relative;
        top: 0;
    }

    .chime-css {
        position: absolute;

        z-index: 999;
    }

    .chime-cont {
        position: relative;
        color: #202020;

        /* tint */
        background: rgba(185, 66, 245, 0.02);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);

        /* mask-image in js */
        mask-size: contain;
        mask-repeat: no-repeat;
        mask-position: center;

        & .fold-cont {
            position: absolute;
            z-index: 1000;

            pointer-events: all;

            left: 50%;
            transform: translate(-50%, 0);

            height: 100%;

            display: grid;

            /* most one liner problem solver thing ever invented */
            grid-auto-flow: dense;

            grid-template-columns: 50% 50%;
            /* row template in js */

            & .stat-fold {
                grid-row: span 2;

                position: relative;
                z-index: 1001;

                /* real width in js */
                width: 50%;

                display: flex;
                justify-content: center;
                align-items: center;

                --title-font-size: 0.87rem;

                & a {
                    cursor: pointer;

                    display: grid;
                    grid-template-columns: repeat(2, min-content);
                    grid-template-rows: repeat(2, min-content);
                    justify-content: center;
                    align-items: center;

                    font-weight: bold;
                    font-size: var(--title-font-size);

                    column-gap: 0.3rem;
                    row-gap: 0.5rem;

                    &:hover {
                        color: #000000;

                        transition: all 0.1s;
                        transform: scale(1.03);
                    }

                    & img::selection {
                        background: rgb(201, 192, 211);
                    }

                    & .stat-fold-state {
                        font-size: calc(var(--title-font-size) - 0.09rem);
                    }

                    & .stat-fold-thick {
                        font-size: var(--title-font-size);
                    }

                    & .stat-fold-display-centered {
                        grid-row: span 2
                    }

                    & .stat-fold-state-centered {
                        display: none;
                    }
                }
            }

            & .stat-half-spacer-left {
                grid-column: 1;
            }

            & .stat-fold-right {
                grid-column: 2;

                & a {
                    margin-left: -0.5rem;
                }
            }

            & .stat-fold-left {
                margin-left: auto;
                justify-self: end;
                grid-column: 1;
            }
        }

        & .chime {
            position: relative;

            display: flex;
            align-items: center;
            justify-content: center;

            user-select: none;
            -webkit-user-drag: none;
        }

        & .chime-cutout {
            display: none;
        }
    }

    /**/

    .separator {
        color: #111111;

        & .star {
            width: 4vw;
            height: 4vw;
            aspect-ratio: 1/1;
        }

        & .three-stars {
            /* putting it on the string */
            margin-top: -10rem;
        }

        & .pebble {
            width: 10vw;
            height: 5vh;

            margin-top: 0.7rem;

            border-radius: 18% 82% 89% 11% / 12% 15% 85% 88%;
            background-color: #111111;
        }

        & .circles {
            margin-top: -3rem;
        }

        & .ok {
            margin-top: 1rem;
        }

        & .tilde {
            color: #111111;
            font-weight: 100;
            font-size: 10rem;
            margin-top: -3rem;
        }

        & .rectangle {
            /* width in js */
            height: 3vh;
            background: #111111;
        }

        --bar-high: 20vh;

        & .bar {
            width: 1.5vw;
            height: var(--bar-high);
            background: #111111;
        }

        & .barer-cont {
            display: grid;
            place-items: center;
            margin-top: -12rem;

            & .barer {
                width: 1vw;
                height: 13vh;
                margin-bottom: 2vh;
                background: #111111;
            }
        }

        & .lantern {
            width: 3vw;
            transform: scaleX(1.2);
            margin-top: 1.1rem;
        }
    }

</style>
