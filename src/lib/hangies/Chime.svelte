<script lang="ts">
    import {onMount, untrack} from "svelte";
    import * as three from "three";
    import {CSS3DRenderer, CSS3DObject} from 'three/addons/renderers/CSS3DRenderer.js';
    import {error} from "@sveltejs/kit";

    let {social, stats, chimeFolds, chimeYOffset, chimeHeight = "125vh", separatorShape: SeparatorShape} = $props();

    // it's not really a chime it just kinda stuck

    const MAX_CHIME_FOLDS = 4;
    const MIN_CHIME_FOLDS = 2;

    $effect(() => {
        if (chimeFolds && (chimeFolds < MIN_CHIME_FOLDS || chimeFolds > MAX_CHIME_FOLDS)) {
            error(500, "Chime has an invalid amount of folds");
        }
        if (stats.length > chimeFolds) {
            error(500, "Chime has too many fields");
        }
    });

    const WIDTH_DIVIDER = 4;
    const HEIGHT_DIVIDER = 1;

    const CHIME_Y_OFFSET = 0.3;

    const treeRopeSegments = 3;
    const treeRopeLength = 0.6;

    const separatorSegments = 2;
    const separatorLength = 0.1;

    const chimeRopeSegments = 8;
    const chimeRopeLength = 0.01;

    const chimeSegments = 2;
    const chimeLength = 0.7;

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
            v.multiplyScalar(0.97);

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
            const offset = dt.multiplyScalar(diff * 0.5);

            if (!this.pinned) this.pos.add(offset);
            if (!other.pinned) other.pos.sub(offset);
        }
    }

    let canvas: HTMLCanvasElement | null = $state(null);
    let cssContElem: HTMLElement | null = $state(null);

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
    let separator: three.Mesh | null = $state(null);
    let chimeRope: three.Line | null = $state(null);
    let chimeElem: HTMLElement | null = $state(null);
    let chimeObj: CSS3DObject | null = $state(null);
    let renderer: three.WebGLRenderer | null = $state(null);
    let cssRenderer: CSS3DRenderer | null = $state(null);
    let scene: three.Scene | null = $state(null);

    let camera: three.PerspectiveCamera | null = $state(null);

    let windowInnerWidth = $state(null);
    let windowInnerHeight = $state(null);

    $effect(() => {
        if (!canvas || !windowInnerWidth || !windowInnerHeight || !camera || !renderer || !cssRenderer || !cssContElem) return;
        canvas.width = windowInnerWidth / WIDTH_DIVIDER;
        canvas.height = windowInnerHeight / HEIGHT_DIVIDER;
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

    let mouseX = $state(0);
    let prevMouseX = $state(0);

    const handleMouseMove = (e: MouseEvent) => {
        prevMouseX = mouseX;
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    }

    onMount(() => {
        if (!canvas || !cssContElem || !chimeElem) return;
        renderer = new three.WebGLRenderer({antialias: true, alpha: true, canvas});

        cssRenderer = new CSS3DRenderer({element: cssContElem});

        camera = new three.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2;

        scene = new three.Scene();

        const startY = 1.55;

        for (let i = 0; i < treeRopeSegments; i++) {
            const y = startY - (i / treeRopeSegments) * treeRopeLength;
            const pinned = i === 0;
            treeRopeParticles.push(new Particle(0, y, 0, 3, pinned))
        }

        for (let i = 0; i < separatorSegments; i++) {
            const y = startY - (i / separatorSegments) * separatorLength;
            const pinned = i === 0;
            separatorParticles.push(new Particle(0, y, 0, 10 * (i + 1), pinned))
        }

        for (let i = 0; i < chimeRopeSegments; i++) {
            const y = startY - (i / chimeRopeSegments) * chimeRopeLength;
            const pinned = i === 0;
            chimeRopeParticles.push(new Particle(0, y, 0, 3, pinned))
        }

        for (let i = 0; i < chimeSegments; i++) {
            const y = startY - (i / chimeSegments) * chimeLength;
            const pinned = i === 0;
            chimeParticles.push(new Particle(0, y, 0, 5 * (i + 1), pinned))
        }

        const treeRopeGeometry = new three.BufferGeometry();
        const treeRopePositions = new Float32Array(treeRopeSegments * 3);
        treeRopeGeometry.setAttribute('position', new three.BufferAttribute(treeRopePositions, 3))
        treeRope = new three.Line(
            treeRopeGeometry,
            new three.LineBasicMaterial({color: 0x000000})
        )
        scene.add(treeRope);

        const separatorGeometry = new three.BoxGeometry(0.5, 0.1, 0.01);
        const separatorMaterial = new three.MeshBasicMaterial({color: 0x000000});
        separator = new three.Mesh(separatorGeometry, separatorMaterial);
        scene.add(separator);

        const chimeRopeGeometry = new three.BufferGeometry();
        const chimeRopePositions = new Float32Array(chimeRopeSegments * 3);
        chimeRopeGeometry.setAttribute('position', new three.BufferAttribute(chimeRopePositions, 3))
        chimeRope = new three.Line(
            chimeRopeGeometry,
            new three.LineBasicMaterial({color: 0x000000})
        )
        scene.add(chimeRope);

        chimeObj = new CSS3DObject(chimeElem);
        chimeObj.scale.set(0.0025, 0.0025, 0.0025);
        scene.add(chimeObj);

        renderer.render(scene, camera);
        animate();
    })

    // let lastTime = Date.now();

    const animate = () => {
        if (!treeRope || !chimeRope || !chimeObj || !renderer || !camera || !scene || !separator || !cssRenderer) return;

        requestAnimationFrame(animate);

        // const currentTime = Date.now();
        // const dt = Math.min((currentTime - lastTime) / 1000, 0.016)
        // lastTime = currentTime;

        const mouseDx = (mouseX - prevMouseX) * 50;
        const windForce = new three.Vector3(mouseDx * 0.8, 0, 0);
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

        chimeRopeParticles.forEach((p) => {
            p.applyForce(gravity.clone().multiplyScalar(p.mass));
            p.applyForce(windForce.clone().multiplyScalar(0.08));
            p.update();
        })

        chimeParticles.forEach((p, i) => {
            p.applyForce(gravity.clone().multiplyScalar(p.mass));
            const windMult = i === 1 ? 0.12 : 0.05;
            p.applyForce(windForce.clone().multiplyScalar(windMult));
            p.update();
        });

        // constraints
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < treeRopeParticles.length - 1; j++) {
                treeRopeParticles[j].constrain(
                    treeRopeParticles[j + 1],
                    treeRopeLength / treeRopeSegments
                )
            }

            for (let j = 0; j < chimeRopeParticles.length - 1; j++) {
                chimeRopeParticles[j].constrain(
                    chimeRopeParticles[j + 1],
                    chimeRopeLength / chimeRopeSegments
                )
            }

            separatorParticles[0].pos.copy(
                treeRopeParticles[treeRopeParticles.length - 1].pos
            );

            chimeRopeParticles[0].pos.copy(
                separatorParticles[separatorParticles.length - 1].pos
            );

            chimeParticles[0].pos.copy(
                chimeRopeParticles[chimeRopeParticles.length - 1].pos
            );
            chimeParticles[0].pos.y -= CHIME_Y_OFFSET;

            separatorParticles[0].constrain(separatorParticles[1], separatorLength);
            chimeParticles[0].constrain(chimeParticles[1], chimeLength);
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
        separator.position.copy(separatorCenter);

        const separatorDir = new three.Vector3()
            .subVectors(separatorParticles[1].pos, separatorParticles[0].pos)
            .normalize();
        separator.rotation.z = Math.atan2(separatorDir.x, -separatorDir.y);

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

        renderer.render(scene, camera);
        cssRenderer.render(scene, camera);
    }
</script>
<svelte:window bind:innerWidth={windowInnerWidth} bind:innerHeight={windowInnerHeight} onmousemove={handleMouseMove}/>
<canvas bind:this={canvas} bind:clientWidth={canvasWidth} bind:clientHeight={canvasHeight}
        class="chime-canvas"></canvas>
<div bind:this={cssContElem} class="chime-css"></div>
<div bind:this={chimeElem} class="chime-cont">
    <svg class="chime" width="530" height="1575" viewBox="0 0 530 1575" fill="none"
         xmlns="http://www.w3.org/2000/svg">
        <mask id="path-1-inside-1_1308_72" fill="white">
            <path d="M529.191 1223.48L352.415 1400.25L352.389 1400.23L177.776 1574.84L1 1398.06L177.776 1221.29L177.801 1221.31L352.415 1046.7L529.191 1223.48Z"/>
        </mask>
        <path d="M529.191 1223.48L352.415 1400.25L352.389 1400.23L177.776 1574.84L1 1398.06L177.776 1221.29L177.801 1221.31L352.415 1046.7L529.191 1223.48Z"
              fill="#737373" fill-opacity="0.05"/>
        <path d="M529.191 1223.48L531.313 1225.6L533.434 1223.48L531.313 1221.36L529.191 1223.48ZM352.415 1400.25L350.294 1402.38L352.415 1404.5L354.536 1402.38L352.415 1400.25ZM352.389 1400.23L354.51 1398.11L352.389 1395.98L350.267 1398.11L352.389 1400.23ZM177.776 1574.84L175.655 1576.96L177.776 1579.08L179.898 1576.96L177.776 1574.84ZM1 1398.06L-1.12132 1395.94L-3.24264 1398.06L-1.12132 1400.19L1 1398.06ZM177.776 1221.29L179.939 1219.21L177.818 1217L175.655 1219.17L177.776 1221.29ZM177.801 1221.31L175.638 1223.39L177.759 1225.6L179.922 1223.43L177.801 1221.31ZM352.415 1046.7L354.536 1044.58L352.415 1042.46L350.294 1044.58L352.415 1046.7ZM529.191 1223.48L527.07 1221.36L350.294 1398.13L352.415 1400.25L354.536 1402.38L531.313 1225.6L529.191 1223.48ZM352.415 1400.25L354.536 1398.13L354.51 1398.11L352.389 1400.23L350.267 1402.35L350.294 1402.38L352.415 1400.25ZM352.389 1400.23L350.267 1398.11L175.655 1572.72L177.776 1574.84L179.898 1576.96L354.51 1402.35L352.389 1400.23ZM177.776 1574.84L179.898 1572.72L3.12132 1395.94L1 1398.06L-1.12132 1400.19L175.655 1576.96L177.776 1574.84ZM1 1398.06L3.12132 1400.19L179.898 1223.41L177.776 1221.29L175.655 1219.17L-1.12132 1395.94L1 1398.06ZM177.776 1221.29L175.614 1223.37L175.638 1223.39L177.801 1221.31L179.963 1219.23L179.939 1219.21L177.776 1221.29ZM177.801 1221.31L179.922 1223.43L354.536 1048.82L352.415 1046.7L350.294 1044.58L175.679 1219.19L177.801 1221.31ZM352.415 1046.7L350.294 1048.82L527.07 1225.6L529.191 1223.48L531.313 1221.36L354.536 1044.58L352.415 1046.7Z"
              fill="black" mask="url(#path-1-inside-1_1308_72)"/>
        <mask id="path-3-inside-2_1308_72" fill="white">
            <path d="M529.189 874.477L354.547 1049.12L528.906 1223.48L352.129 1400.25L175.353 1223.48L175.383 1223.45L1 1049.06L177.776 872.288L177.801 872.312L352.413 697.7L529.189 874.477Z"/>
        </mask>
        <path d="M529.189 874.477L354.547 1049.12L528.906 1223.48L352.129 1400.25L175.353 1223.48L175.383 1223.45L1 1049.06L177.776 872.288L177.801 872.312L352.413 697.7L529.189 874.477Z"
              fill="#737373" fill-opacity="0.05"/>
        <path d="M529.189 874.477L531.311 876.598L533.432 874.477L531.311 872.355L529.189 874.477ZM354.547 1049.12L352.426 1047L350.304 1049.12L352.426 1051.24L354.547 1049.12ZM528.906 1223.48L531.028 1225.6L533.149 1223.48L531.028 1221.36L528.906 1223.48ZM352.129 1400.25L350.008 1402.38L352.129 1404.5L354.25 1402.38L352.129 1400.25ZM175.353 1223.48L173.198 1221.39L171.143 1223.51L173.231 1225.6L175.353 1223.48ZM175.383 1223.45L177.538 1225.53L179.592 1223.41L177.504 1221.33L175.383 1223.45ZM1 1049.06L-1.12132 1046.94L-3.24264 1049.06L-1.12132 1051.19L1 1049.06ZM177.776 872.288L179.898 870.167L177.776 868.045L175.655 870.167L177.776 872.288ZM177.801 872.312L175.679 874.434L177.801 876.555L179.922 874.434L177.801 872.312ZM352.413 697.7L354.534 695.579L352.413 693.458L350.292 695.579L352.413 697.7ZM529.189 874.477L527.068 872.355L352.426 1047L354.547 1049.12L356.668 1051.24L531.311 876.598L529.189 874.477ZM354.547 1049.12L352.426 1051.24L526.785 1225.6L528.906 1223.48L531.028 1221.36L356.668 1047L354.547 1049.12ZM528.906 1223.48L526.785 1221.36L350.008 1398.13L352.129 1400.25L354.25 1402.38L531.028 1225.6L528.906 1223.48ZM352.129 1400.25L354.25 1398.13L177.474 1221.36L175.353 1223.48L173.231 1225.6L350.008 1402.38L352.129 1400.25ZM175.353 1223.48L177.507 1225.57L177.538 1225.53L175.383 1223.45L173.228 1221.36L173.198 1221.39L175.353 1223.48ZM175.383 1223.45L177.504 1221.33L3.12132 1046.94L1 1049.06L-1.12132 1051.19L173.261 1225.57L175.383 1223.45ZM1 1049.06L3.12132 1051.19L179.898 874.409L177.776 872.288L175.655 870.167L-1.12132 1046.94L1 1049.06ZM177.776 872.288L175.655 874.409L175.679 874.434L177.801 872.312L179.922 870.191L179.898 870.167L177.776 872.288ZM177.801 872.312L179.922 874.434L354.534 699.822L352.413 697.7L350.292 695.579L175.679 870.191L177.801 872.312ZM352.413 697.7L350.292 699.822L527.068 876.598L529.189 874.477L531.311 872.355L354.534 695.579L352.413 697.7Z"
              fill="black" mask="url(#path-3-inside-2_1308_72)"/>
        <mask id="path-5-inside-3_1308_72" fill="white">
            <path d="M529.188 525.477L354.546 700.118L354.553 700.125L354.552 700.126L528.904 874.479L352.127 1051.25L175.351 874.479L175.352 874.477L1 700.125L175.641 525.483L175.635 525.477L352.411 348.7L529.188 525.477Z"/>
        </mask>
        <path d="M529.188 525.477L354.546 700.118L354.553 700.125L354.552 700.126L528.904 874.479L352.127 1051.25L175.351 874.479L175.352 874.477L1 700.125L175.641 525.483L175.635 525.477L352.411 348.7L529.188 525.477Z"
              fill="#737373" fill-opacity="0.05"/>
        <path d="M529.188 525.477L531.309 527.598L533.43 525.477L531.309 523.355L529.188 525.477ZM354.546 700.118L352.425 697.997L350.303 700.118L352.425 702.239L354.546 700.118ZM354.553 700.125L356.674 702.246L358.795 700.125L356.674 698.004L354.553 700.125ZM354.552 700.126L352.43 698.005L350.309 700.126L352.43 702.247L354.552 700.126ZM528.904 874.479L531.026 876.6L533.147 874.479L531.026 872.357L528.904 874.479ZM352.127 1051.25L350.006 1053.38L352.127 1055.5L354.248 1053.38L352.127 1051.25ZM175.351 874.479L172.667 873.137L171.7 875.071L173.229 876.6L175.351 874.479ZM175.352 874.477L178.035 875.818L179.002 873.884L177.473 872.355L175.352 874.477ZM1 700.125L-1.12133 698.004L-3.24263 700.125L-1.12132 702.246L1 700.125ZM175.641 525.483L177.762 527.605L179.726 525.64L177.918 523.531L175.641 525.483ZM175.635 525.477L173.513 523.355L171.549 525.32L173.357 527.429L175.635 525.477ZM352.411 348.7L354.532 346.579L352.411 344.458L350.29 346.579L352.411 348.7ZM529.188 525.477L527.066 523.355L352.425 697.997L354.546 700.118L356.667 702.239L531.309 527.598L529.188 525.477ZM354.546 700.118L352.425 702.239L352.431 702.246L354.553 700.125L356.674 698.004L356.667 697.997L354.546 700.118ZM354.553 700.125L352.431 698.004L352.43 698.005L354.552 700.126L356.673 702.247L356.674 702.246L354.553 700.125ZM354.552 700.126L352.43 702.247L526.783 876.6L528.904 874.479L531.026 872.357L356.673 698.005L354.552 700.126ZM528.904 874.479L526.783 872.357L350.006 1049.13L352.127 1051.25L354.248 1053.38L531.026 876.6L528.904 874.479ZM352.127 1051.25L354.248 1049.13L177.472 872.357L175.351 874.479L173.229 876.6L350.006 1053.38L352.127 1051.25ZM175.351 874.479L178.034 875.82L178.035 875.818L175.352 874.477L172.668 873.135L172.667 873.137L175.351 874.479ZM175.352 874.477L177.473 872.355L3.12132 698.004L1 700.125L-1.12132 702.246L173.23 876.598L175.352 874.477ZM1 700.125L3.12133 702.246L177.762 527.605L175.641 525.483L173.519 523.362L-1.12133 698.004L1 700.125ZM175.641 525.483L177.918 523.531L177.913 523.524L175.635 525.477L173.357 527.429L173.363 527.436L175.641 525.483ZM175.635 525.477L177.756 527.598L354.532 350.822L352.411 348.7L350.29 346.579L173.513 523.355L175.635 525.477ZM352.411 348.7L350.29 350.822L527.066 527.598L529.188 525.477L531.309 523.355L354.532 346.579L352.411 348.7Z"
              fill="black" mask="url(#path-5-inside-3_1308_72)"/>
        <mask id="path-7-inside-4_1308_72" fill="white">
            <path d="M528.552 176.777L354.502 350.826L529.152 525.478L352.376 702.255L177.726 527.604L176.776 528.554L0 351.776L176.776 175L351.775 0L528.552 176.777Z"/>
        </mask>
        <path d="M528.552 176.777L354.502 350.826L529.152 525.478L352.376 702.255L177.726 527.604L176.776 528.554L0 351.776L176.776 175L351.775 0L528.552 176.777Z"
              fill="#737373" fill-opacity="0.05"/>
        <path d="M528.552 176.777L530.673 178.899L532.794 176.777L530.673 174.656L528.552 176.777ZM354.502 350.826L352.381 348.705L350.259 350.826L352.381 352.947L354.502 350.826ZM529.152 525.478L531.274 527.599L533.395 525.478L531.274 523.356L529.152 525.478ZM352.376 702.255L350.255 704.376L352.376 706.498L354.497 704.376L352.376 702.255ZM177.726 527.604L179.847 525.482L177.725 523.36L175.603 525.483L177.726 527.604ZM176.776 528.554L174.655 530.675L176.777 532.797L178.899 530.674L176.776 528.554ZM0 351.776L-2.12132 349.655L-4.24263 351.776L-2.12133 353.898L0 351.776ZM176.776 175L178.898 177.121L178.898 177.121L176.776 175ZM351.775 0L353.897 -2.12131L351.775 -4.24265L349.654 -2.12131L351.775 0ZM528.552 176.777L526.43 174.656L352.381 348.705L354.502 350.826L356.623 352.947L530.673 178.899L528.552 176.777ZM354.502 350.826L352.381 352.947L527.031 527.599L529.152 525.478L531.274 523.356L356.623 348.705L354.502 350.826ZM529.152 525.478L527.031 523.356L350.255 700.134L352.376 702.255L354.497 704.376L531.274 527.599L529.152 525.478ZM352.376 702.255L354.497 700.134L179.847 525.482L177.726 527.604L175.604 529.725L350.255 704.376L352.376 702.255ZM177.726 527.604L175.603 525.483L174.654 526.433L176.776 528.554L178.899 530.674L179.848 529.724L177.726 527.604ZM176.776 528.554L178.898 526.432L2.12133 349.655L0 351.776L-2.12133 353.898L174.655 530.675L176.776 528.554ZM0 351.776L2.12132 353.898L178.898 177.121L176.776 175L174.655 172.879L-2.12132 349.655L0 351.776ZM176.776 175L178.898 177.121L353.897 2.12131L351.775 0L349.654 -2.12131L174.655 172.879L176.776 175ZM351.775 0L349.654 2.12131L526.43 178.899L528.552 176.777L530.673 174.656L353.897 -2.12131L351.775 0Z"
              fill="black" mask="url(#path-7-inside-4_1308_72)"/>
    </svg>
</div>

<style>
    .chime-canvas {
        position: relative;
        top: 0;
    }

    .chime-css {
        position: absolute;

        z-index: 999;
    }

    .chime-cont {
        background: rgba(255, 172, 48, 0.01);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);

        mask-image: url("/img/hangieitself3cutout2.svg");
        mask-size: contain;
        mask-repeat: no-repeat;
        mask-position: center;

        & .chime {
            position: relative;

            height: 125vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>
