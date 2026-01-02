<script lang="ts">
    import {onMount} from "svelte";
    import * as three from "three";
    import {Tween} from "svelte/motion";
    import {cubicOut} from "svelte/easing";

    // i'm gonna go and revisit the entire physics curriculum from 1st to 12th grade sometime after this
    // i do have 5.0/5.0 gpa but our education system is just painnn so i know like very little
    // math, physics, economics i need all that

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

    const chimeRotationSettings = {
        duration: 2000,
        easing: cubicOut,
    };

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
    let chime: three.Mesh | null = $state(null);
    let chimeRotation = $state(new Tween(0, chimeRotationSettings));
    let renderer: three.WebGLRenderer | null = $state(null);
    let scene: three.Scene | null = $state(null);

    let camera: three.PerspectiveCamera | null = $state(null);

    $effect(() => {
        if (!chime || !renderer || !scene || !camera) return;
        chime.rotation.x = chimeRotation.current;
        chime.rotation.y = chimeRotation.current;
        renderer.render(scene, camera)
        if (chimeRotation.current >= Math.PI * 2) {
            chimeRotation = new Tween(-(Math.PI * 2), chimeRotationSettings);
            chimeRotation.target = Math.PI * 2;
        }
    })

    let windowInnerWidth = $state(null);
    let windowInnerHeight = $state(null);
    $effect(() => {
        if (!canvas || !windowInnerWidth || !windowInnerHeight || !camera || !renderer) return;
        canvas.width = windowInnerWidth;
        canvas.height = windowInnerHeight;

        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        renderer?.setSize(canvas.width, canvas.height);
    })

    let treeRopeParticles: Particle[] = [];
    let separatorParticles: Particle[] = [];
    let chimeRopeParticles: Particle[] = [];
    let chimeParticles: Particle[] = [];

    let mouseX = $state(0);
    let mouseY = $state(0);
    let prevMouseX = $state(0);
    let prevMouseY = $state(0);

    const handleMouseMove = (e: MouseEvent) => {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    }

    const treeRopeSegments = 3;
    const treeRopeLength = 0.2;

    const separatorSegments = 2;
    const separatorLength = 0.1;

    const chimeRopeSegments = 8;
    const chimeRopeLength = 1;

    const chimeSegments = 2;
    const chimeLength = 0.7;

    onMount(() => {
        if (canvas == null) return;
        renderer = new three.WebGLRenderer({antialias: true, canvas});
        camera = new three.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2;

        scene = new three.Scene();

        const startY = 1;

        // TODO later: css shape
        for (let i = 0; i < treeRopeSegments; i++) {
            const y = startY - (i / treeRopeSegments) * treeRopeLength;
            const pinned = i === 0;
            treeRopeParticles.push(new Particle(0, y, 0, 3, pinned))
        }

        for (let i = 0; i < separatorSegments; i++) {
            const y = startY - (i / separatorSegments) * separatorLength;
            const pinned = i === 0;
            separatorParticles.push(new Particle(0, y, 0, 10*(i+1), pinned))
        }

        for (let i = 0; i < chimeRopeSegments; i++) {
            const y = startY - (i / chimeRopeSegments) * chimeRopeLength;
            const pinned = i === 0;
            chimeRopeParticles.push(new Particle(0, y, 0, 3, pinned))
        }

        for (let i = 0; i < chimeSegments; i++) {
            const y = startY - (i / chimeSegments) * chimeLength;
            const pinned = i === 0;
            chimeParticles.push(new Particle(0, y, 0, 5*(i+1), pinned))
        }

        const treeRopeGeometry = new three.BufferGeometry();
        const treeRopePositions = new Float32Array(treeRopeSegments * 3);
        treeRopeGeometry.setAttribute('position', new three.BufferAttribute(treeRopePositions, 3))
        treeRope = new three.Line(
            treeRopeGeometry,
            new three.LineBasicMaterial({ color: 0xffffff })
        )
        scene.add(treeRope);

        const separatorGeometry = new three.BoxGeometry(0.5, 0.1, 0.01);
        const separatorMaterial = new three.MeshBasicMaterial({color: 0xffffff});
        separator = new three.Mesh(separatorGeometry, separatorMaterial);
        scene.add(separator);

        const chimeRopeGeometry = new three.BufferGeometry();
        const chimeRopePositions = new Float32Array(chimeRopeSegments * 3);
        chimeRopeGeometry.setAttribute('position', new three.BufferAttribute(chimeRopePositions, 3))
        chimeRope = new three.Line(
            chimeRopeGeometry,
            new three.LineBasicMaterial({ color: 0xffffff })
        )
        scene.add(chimeRope);

        const chimeShape = [0.75, 1, 0.01];
        const chimeGeometry = new three.BoxGeometry(...chimeShape);
        const chimeMaterial = new three.MeshBasicMaterial({color: 0xffffff});
        chime = new three.Mesh(chimeGeometry, chimeMaterial);
        chime.position.y = chimeRope.position.y - chimeShape[1];
        scene.add(chime);

        renderer.render(scene, camera);
        animate();
    })

    // let lastTime = Date.now();

    const animate = () => {
        if (!treeRope || !chimeRope || !chime || !renderer || !camera || !scene || !separator) return;

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
                    treeRopeParticles[j+1],
                    treeRopeLength / treeRopeSegments
                )
            }

            for (let j = 0; j < chimeRopeParticles.length - 1; j++) {
                chimeRopeParticles[j].constrain(
                    chimeRopeParticles[j+1],
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
        chime.position.copy(chimeCenter);

        const chimeDir = new three.Vector3()
            .subVectors(chimeParticles[1].pos, chimeParticles[0].pos)
            .normalize();
        chime.rotation.z = Math.atan2(chimeDir.x, -chimeDir.y);

        renderer.render(scene, camera);
    }
</script>
<svelte:window bind:innerWidth={windowInnerWidth} bind:innerHeight={windowInnerHeight} onmousemove={handleMouseMove} />
<canvas bind:this={canvas} bind:clientWidth={canvasWidth} bind:clientHeight={canvasHeight} id="chime-tst"></canvas>

<style>
    #chime-tst {
        position: relative;
        top: 8rem;
    }
</style>
