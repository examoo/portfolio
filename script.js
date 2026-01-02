// ==================== THREE.JS SCENE SETUP ====================
let scene, camera, renderer;
let mouseX = 0, mouseY = 0;

// Galaxy 3D Background System with Black Hole
let galaxyCore, nebulaCloud, starField, cosmicDust;
let blackHole, accretionDisk, eventHorizon;
let spiralArms = [];
let scrollProgress = 0;
let floatingShapes = [];

// Post-processing variables
let composer, bloomPass;

// Frame timing for smooth animations
let frameCount = 0;
let lastTime = 0;

// ==================== INITIALIZE THREE.JS ====================
function initThree() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030014);
    scene.fog = new THREE.FogExp2(0x030014, 0.0015);

    // Camera - positioned for galaxy view
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.set(0, 50, 100);
    camera.lookAt(0, 0, 0);

    // Renderer
    const canvas = document.getElementById('bg-canvas');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Galaxy Lighting
    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);

    // Galactic core light
    const coreLight = new THREE.PointLight(0xffffff, 2.5, 150);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Colored accent lights for nebula effect
    const nebulaPurple = new THREE.PointLight(0x9d4edd, 2, 100);
    nebulaPurple.position.set(30, 10, -20);
    scene.add(nebulaPurple);

    const nebulaCyan = new THREE.PointLight(0x00d9ff, 2, 100);
    nebulaCyan.position.set(-30, -10, -20);
    scene.add(nebulaCyan);

    // Orange accretion disk glow
    const accretionGlow = new THREE.PointLight(0xff6600, 4, 50);
    accretionGlow.position.set(0, 0, 0);
    scene.add(accretionGlow);

    // Create Galaxy Elements
    createBlackHole();
    createGalaxyCore();
    createSpiralGalaxy();
    createNebulaCloud();
    createStarField();
    createCosmicDust();
    createFloatingShapes();

    // Animation Loop
    animate();
}

// ==================== BLACK HOLE CREATION ====================
function createBlackHole() {
    // Event Horizon (perfectly smooth black sphere)
    const horizonGeometry = new THREE.SphereGeometry(2.5, 128, 128);
    const horizonMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: false,
        opacity: 1
    });
    eventHorizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
    scene.add(eventHorizon);

    // Multi-layered gravitational lensing with smooth gradients
    const lensingLayers = [
        { radius: 2.8, color: 0x000000, opacity: 0.95 },
        { radius: 3.2, color: 0x0a0000, opacity: 0.85 },
        { radius: 3.6, color: 0x1a0500, opacity: 0.7 },
        { radius: 4.0, color: 0x2a0a00, opacity: 0.55 },
        { radius: 4.5, color: 0x3a1000, opacity: 0.4 },
        { radius: 5.0, color: 0x4a1500, opacity: 0.25 }
    ];

    lensingLayers.forEach(layer => {
        const glowGeometry = new THREE.SphereGeometry(layer.radius, 128, 128);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: layer.color,
            transparent: true,
            opacity: layer.opacity,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        eventHorizon.add(glow);
    });

    // Smooth gradient accretion disk with multiple layers
    const diskLayers = [
        { inner: 5, outer: 12, color: 0xff4400, opacity: 0.4 },
        { inner: 5.5, outer: 11, color: 0xff6622, opacity: 0.5 },
        { inner: 6, outer: 10, color: 0xff8844, opacity: 0.6 }
    ];

    accretionDisk = new THREE.Group();

    diskLayers.forEach((layer, index) => {
        const diskGeometry = new THREE.RingGeometry(layer.inner, layer.outer, 256);
        const diskMaterial = new THREE.MeshBasicMaterial({
            color: layer.color,
            transparent: true,
            opacity: layer.opacity,
            side: THREE.DoubleSide
        });
        const disk = new THREE.Mesh(diskGeometry, diskMaterial);
        disk.rotation.x = Math.PI / 2;
        accretionDisk.add(disk);
    });

    scene.add(accretionDisk);

    // Ultra-bright inner disk (hottest region)
    const innerDiskGeometry = new THREE.RingGeometry(5, 7, 256);
    const innerDiskMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffaa,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
    });
    const innerDisk = new THREE.Mesh(innerDiskGeometry, innerDiskMaterial);
    innerDisk.rotation.x = Math.PI / 2;
    accretionDisk.add(innerDisk);

    // Smooth particle system with density-based distribution
    const particleCount = 6000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        const t = Math.pow(i / particleCount, 0.7);
        const angle = t * Math.PI * 16;
        const radius = 5 + t * 7;

        const radiusVar = (Math.random() - 0.5) * 1.5;
        const finalRadius = radius + radiusVar;

        const x = Math.cos(angle) * finalRadius;
        const z = Math.sin(angle) * finalRadius;
        const y = (Math.random() - 0.5) * 0.6 * Math.pow(1 - t, 2);

        positions.push(x, y, z);
        velocities.push(angle);

        // Smooth color gradient with temperature physics
        const heat = Math.pow(1 - (finalRadius - 5) / 7, 1.5);
        let r, g, b;

        if (heat > 0.8) {
            r = 1; g = 1; b = 1;
        } else if (heat > 0.6) {
            r = 0.9 + heat * 0.1; g = 0.95 + heat * 0.05; b = 1;
        } else if (heat > 0.4) {
            r = 1; g = 0.9 + heat * 0.1; b = 0.6 + heat * 0.3;
        } else if (heat > 0.2) {
            r = 1; g = 0.5 + heat * 0.5; b = 0.2 + heat * 0.4;
        } else {
            r = 1; g = 0.3 + heat * 0.3; b = 0.1 + heat * 0.2;
        }

        colors.push(r, g, b);
        sizes.push((Math.random() * 0.6 + 0.6) * (1 + heat * 1.5));
    }

    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 1));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false
    });

    const diskParticles = new THREE.Points(particleGeometry, particleMaterial);
    accretionDisk.add(diskParticles);

    // Multi-layered photon sphere for smooth glow
    const photonLayers = [
        { inner: 4.5, outer: 5.2, color: 0xffffff, opacity: 0.6 },
        { inner: 4.7, outer: 5.0, color: 0xffffff, opacity: 0.9 },
        { inner: 4.8, outer: 4.95, color: 0xffffff, opacity: 1.0 }
    ];

    photonLayers.forEach(layer => {
        const photonGeometry = new THREE.RingGeometry(layer.inner, layer.outer, 256);
        const photonMaterial = new THREE.MeshBasicMaterial({
            color: layer.color,
            transparent: true,
            opacity: layer.opacity,
            side: THREE.DoubleSide
        });
        const photonRing = new THREE.Mesh(photonGeometry, photonMaterial);
        photonRing.rotation.x = Math.PI / 2;
        accretionDisk.add(photonRing);
    });

    // Smooth relativistic jets
    createBlackHoleJets();
}

// Create smooth relativistic jets
function createBlackHoleJets() {
    const jetParticles = 2000;
    const jetGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    for (let i = 0; i < jetParticles; i++) {
        const t = i / jetParticles;
        const smoothT = t * t * (3 - 2 * t);
        const y = 6 + smoothT * 50;
        const spread = smoothT * 3;

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * spread;
        const x = Math.cos(angle) * dist;
        const z = Math.sin(angle) * dist;

        positions.push(x, y, z);
        positions.push(x, -y, z);

        const brightness = Math.pow(1 - smoothT, 1.5);
        const r = 0.7 + brightness * 0.3;
        const g = 0.85 + brightness * 0.15;
        const b = 1;

        colors.push(r, g, b);
        colors.push(r, g, b);

        const size = (Math.random() * 0.4 + 0.3) * (1 + brightness);
        sizes.push(size);
        sizes.push(size);
    }

    jetGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    jetGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    jetGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const jetMaterial = new THREE.PointsMaterial({
        size: 0.4,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const jets = new THREE.Points(jetGeometry, jetMaterial);
    eventHorizon.add(jets);
}

// ==================== GALAXY CORE ====================
function createGalaxyCore() {
    const coreGeometry = new THREE.SphereGeometry(3, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
    });
    galaxyCore = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(galaxyCore);

    // Glow layer 1
    const glow1Geometry = new THREE.SphereGeometry(5, 32, 32);
    const glow1Material = new THREE.MeshBasicMaterial({
        color: 0xffeeaa,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    const glow1 = new THREE.Mesh(glow1Geometry, glow1Material);
    galaxyCore.add(glow1);

    // Glow layer 2
    const glow2Geometry = new THREE.SphereGeometry(8, 32, 32);
    const glow2Material = new THREE.MeshBasicMaterial({
        color: 0xffcc66,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    });
    const glow2 = new THREE.Mesh(glow2Geometry, glow2Material);
    galaxyCore.add(glow2);
}

// ==================== SPIRAL GALAXY ====================
function createSpiralGalaxy() {
    const armCount = 3;
    const starsPerArm = 2000;
    const armTightness = 0.3;
    const armWidth = 0.5;

    for (let arm = 0; arm < armCount; arm++) {
        const armGeometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];

        for (let i = 0; i < starsPerArm; i++) {
            const t = (i / starsPerArm) * Math.PI * 4;
            const radius = 5 + t * 8;
            const angle = t * armTightness + (arm * (Math.PI * 2 / armCount));

            const x = Math.cos(angle) * radius + (Math.random() - 0.5) * radius * armWidth;
            const z = Math.sin(angle) * radius + (Math.random() - 0.5) * radius * armWidth;
            const y = (Math.random() - 0.5) * 5 + Math.sin(t) * 2;

            positions.push(x, y, z);

            const colorMix = Math.random();
            let r, g, b;

            if (colorMix < 0.3) {
                r = 1; g = 0.95 + Math.random() * 0.05; b = 0.8 + Math.random() * 0.2;
            } else if (colorMix < 0.6) {
                r = 0.6 + Math.random() * 0.2; g = 0.7 + Math.random() * 0.2; b = 1;
            } else {
                r = 0.8 + Math.random() * 0.2; g = 0.4 + Math.random() * 0.2; b = 1;
            }

            colors.push(r, g, b);
            sizes.push(Math.random() * 1.5 + 0.3);
        }

        armGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        armGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        armGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        const armMaterial = new THREE.PointsMaterial({
            size: 0.8,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        const armParticles = new THREE.Points(armGeometry, armMaterial);
        spiralArms.push(armParticles);
        scene.add(armParticles);
    }
}

// ==================== NEBULA CLOUD ====================
function createNebulaCloud() {
    const particleCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 60 + 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI * 0.3;

        const x = radius * Math.cos(theta) * Math.cos(phi);
        const y = radius * Math.sin(phi) * 0.3;
        const z = radius * Math.sin(theta) * Math.cos(phi);

        positions.push(x, y, z);

        const colorChoice = Math.random();
        let r, g, b;

        if (colorChoice < 0.33) {
            r = 0.6 + Math.random() * 0.3; g = 0.2 + Math.random() * 0.3; b = 0.9 + Math.random() * 0.1;
        } else if (colorChoice < 0.66) {
            r = 0.0 + Math.random() * 0.3; g = 0.7 + Math.random() * 0.3; b = 0.9 + Math.random() * 0.1;
        } else {
            r = 0.9 + Math.random() * 0.1; g = 0.2 + Math.random() * 0.3; b = 0.6 + Math.random() * 0.3;
        }

        colors.push(r, g, b);
        sizes.push(Math.random() * 3 + 1);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    nebulaCloud = new THREE.Points(geometry, material);
    scene.add(nebulaCloud);
}

// ==================== STAR FIELD ====================
function createStarField() {
    const starCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < starCount; i++) {
        const radius = 100 + Math.random() * 400;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions.push(x, y, z);

        const brightness = 0.7 + Math.random() * 0.3;
        const colorTint = Math.random();

        if (colorTint < 0.8) {
            colors.push(brightness, brightness, brightness);
        } else {
            colors.push(brightness * 0.8, brightness * 0.9, brightness);
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    starField = new THREE.Points(geometry, material);
    scene.add(starField);
}

// ==================== COSMIC DUST ====================
function createCosmicDust() {
    const dustCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < dustCount; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 30;
        const z = (Math.random() - 0.5) * 200;

        positions.push(x, y, z);

        const brightness = 0.1 + Math.random() * 0.2;
        colors.push(brightness * 1.2, brightness * 0.6, brightness * 0.4);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.NormalBlending
    });

    cosmicDust = new THREE.Points(geometry, material);
    scene.add(cosmicDust);
}

// ==================== FLOATING GEOMETRIC SHAPES ====================
function createFloatingShapes() {
    const shapeTypes = [
        { geometry: new THREE.IcosahedronGeometry(2, 0), color: 0x9d4edd },
        { geometry: new THREE.OctahedronGeometry(1.5, 0), color: 0x00d9ff },
        { geometry: new THREE.TetrahedronGeometry(1.8, 0), color: 0xec4899 },
        { geometry: new THREE.DodecahedronGeometry(1.2, 0), color: 0x10b981 }
    ];

    for (let i = 0; i < 8; i++) {
        const shapeType = shapeTypes[i % shapeTypes.length];
        const geometry = shapeType.geometry.clone();

        // Wireframe material for holographic look
        const material = new THREE.MeshBasicMaterial({
            color: shapeType.color,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Random position around the scene
        const angle = (i / 8) * Math.PI * 2;
        const radius = 30 + Math.random() * 20;
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.y = (Math.random() - 0.5) * 40;
        mesh.position.z = Math.sin(angle) * radius;

        // Store original position for floating animation
        mesh.userData = {
            originalY: mesh.position.y,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 0.5,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };

        floatingShapes.push(mesh);
        scene.add(mesh);
    }
}

// ==================== ANIMATION LOOP ====================
function animate(currentTime) {
    requestAnimationFrame(animate);
    frameCount++;

    const time = frameCount * 0.001;

    // Animate Black Hole and Accretion Disk
    if (eventHorizon) {
        eventHorizon.rotation.y += 0.0005;
        const intensityPulse = 1 + Math.sin(time * 3) * (0.05 + scrollProgress * 0.1);
        eventHorizon.scale.set(intensityPulse, intensityPulse, intensityPulse);
    }

    if (accretionDisk) {
        const rotationSpeed = 0.004 + (scrollProgress * 0.006);
        accretionDisk.rotation.z += rotationSpeed;

        accretionDisk.children.forEach((child, index) => {
            if (child.rotation) {
                child.rotation.z += (0.001 * (index + 1));
            }
        });

        // Animate main particle system
        const diskParticles = accretionDisk.children.find(child => child.type === 'Points' && child.geometry.attributes.velocity);
        if (diskParticles && diskParticles.geometry) {
            const positions = diskParticles.geometry.attributes.position.array;
            const colors = diskParticles.geometry.attributes.color.array;
            const sizes = diskParticles.geometry.attributes.size.array;

            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const z = positions[i + 2];
                const radius = Math.sqrt(x * x + z * z);

                const orbitalSpeed = 0.018 / Math.sqrt(radius);
                const angle = Math.atan2(z, x) + orbitalSpeed;

                const inwardSpeed = 0.004 + scrollProgress * 0.003;
                const newRadius = radius - inwardSpeed;

                if (newRadius < 5) {
                    const resetAngle = Math.random() * Math.PI * 2;
                    positions[i] = Math.cos(resetAngle) * 12;
                    positions[i + 1] = (Math.random() - 0.5) * 0.3;
                    positions[i + 2] = Math.sin(resetAngle) * 12;
                } else {
                    positions[i] = Math.cos(angle) * newRadius;
                    positions[i + 2] = Math.sin(angle) * newRadius;
                    positions[i + 1] += Math.sin(frameCount * 0.01 + i) * 0.002;

                    const heat = Math.pow(1 - (newRadius - 5) / 7, 1.5);

                    if (heat > 0.8) {
                        colors[i] = 1; colors[i + 1] = 1; colors[i + 2] = 1;
                    } else if (heat > 0.6) {
                        colors[i] = 0.9 + heat * 0.1; colors[i + 1] = 0.95 + heat * 0.05; colors[i + 2] = 1;
                    } else if (heat > 0.4) {
                        colors[i] = 1; colors[i + 1] = 0.9 + heat * 0.1; colors[i + 2] = 0.6 + heat * 0.3;
                    } else if (heat > 0.2) {
                        colors[i] = 1; colors[i + 1] = 0.5 + heat * 0.5; colors[i + 2] = 0.2 + heat * 0.4;
                    } else {
                        colors[i] = 1; colors[i + 1] = 0.3 + heat * 0.3; colors[i + 2] = 0.1 + heat * 0.2;
                    }

                    sizes[i / 3] = (0.6 + heat * 1.2) * (0.8 + Math.sin(frameCount * 0.05 + i) * 0.2);
                }
            }

            diskParticles.geometry.attributes.position.needsUpdate = true;
            diskParticles.geometry.attributes.color.needsUpdate = true;
            diskParticles.geometry.attributes.size.needsUpdate = true;
        }
    }

    // Rotate Galaxy Core
    if (galaxyCore) {
        galaxyCore.rotation.y += 0.001;
        const pulse = 1 + Math.sin(time * 2) * 0.1;
        galaxyCore.scale.set(pulse, pulse, pulse);
    }

    // Rotate Spiral Arms
    spiralArms.forEach((arm, index) => {
        arm.rotation.y += 0.0003 + (index * 0.0001);
        const positions = arm.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] += Math.sin(time + i * 0.1) * 0.005;
        }
        arm.geometry.attributes.position.needsUpdate = true;
    });

    // Animate Nebula Cloud
    if (nebulaCloud) {
        nebulaCloud.rotation.y -= 0.0002;
        nebulaCloud.rotation.x = Math.sin(time * 0.5) * 0.05;

        const sizes = nebulaCloud.geometry.attributes.size.array;
        for (let i = 0; i < sizes.length; i++) {
            sizes[i] = (Math.sin(time * 2 + i * 0.1) + 1) * 1.5 + 1;
        }
        nebulaCloud.geometry.attributes.size.needsUpdate = true;
    }

    // Twinkling Stars
    if (starField) {
        starField.rotation.y += 0.00005;

        if (frameCount % 10 === 0) {
            const colors = starField.geometry.attributes.color.array;
            for (let i = 0; i < colors.length; i += 3) {
                if (Math.random() < 0.01) {
                    const twinkle = 0.5 + Math.random() * 0.5;
                    colors[i] *= twinkle;
                    colors[i + 1] *= twinkle;
                    colors[i + 2] *= twinkle;
                }
            }
            starField.geometry.attributes.color.needsUpdate = true;
        }
    }

    // Drift Cosmic Dust
    if (cosmicDust) {
        cosmicDust.rotation.y += 0.00015;

        const positions = cosmicDust.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += Math.sin(time + i * 0.05) * 0.01;
            positions[i + 2] += Math.cos(time + i * 0.05) * 0.01;
        }
        cosmicDust.geometry.attributes.position.needsUpdate = true;
    }

    // Animate Floating Shapes
    floatingShapes.forEach((shape, index) => {
        const userData = shape.userData;

        // Floating animation
        shape.position.y = userData.originalY + Math.sin(time * userData.speed + userData.phase) * 5;

        // Rotation animation
        shape.rotation.x += userData.rotationSpeed.x;
        shape.rotation.y += userData.rotationSpeed.y;
        shape.rotation.z += userData.rotationSpeed.z;

        // Pulse opacity based on scroll
        shape.material.opacity = 0.4 + Math.sin(time + index) * 0.2 + scrollProgress * 0.2;
    });

    // Camera orbit and mouse interaction
    camera.position.x += Math.sin(time * 0.1) * 0.03;
    camera.position.z += Math.cos(time * 0.1) * 0.03;

    // Mouse interaction
    if (mouseX !== 0 || mouseY !== 0) {
        camera.position.x += mouseX * 0.00005;
        camera.position.y += mouseY * 0.00005;
    }

    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}

// ==================== MOUSE TRACKING ====================
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
});

// ==================== SCROLL ANIMATIONS ====================
let scrollY = window.scrollY;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = Math.min(scrollY / maxScroll, 1);

    // Zoom camera toward black hole based on scroll
    if (camera) {
        const startZ = 100;
        const endZ = 15;
        const startY = 50;
        const endY = 5;

        const easeProgress = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);

        camera.position.z = startZ - (startZ - endZ) * easeProgress;
        camera.position.y = startY - (startY - endY) * easeProgress;
        camera.lookAt(0, 0, 0);

        camera.fov = 60 + (scrollProgress * 20);
        camera.updateProjectionMatrix();
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
});

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ==================== 3D CARD TILT EFFECT ====================
function initCardTilt() {
    const cards = document.querySelectorAll('.skill-category, .project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.setProperty('--rotate-x', `${-rotateX}deg`);
            card.style.setProperty('--rotate-y', `${rotateY}deg`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rotate-x', '0deg');
            card.style.setProperty('--rotate-y', '0deg');
        });
    });
}

// ==================== INTERSECTION OBSERVER ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate skill bars
            if (entry.target.classList.contains('skill-category')) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach((bar, index) => {
                    const progress = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 200 + index * 100);
                });
            }
        }
    });
}, observerOptions);

// ==================== DOM CONTENT LOADED ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js
    initThree();

    // Initialize 3D card tilt
    initCardTilt();

    // Hide loading screen after delay
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 2500);

    // Add fade-in class to sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Observe skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.classList.add('fade-in');
        observer.observe(category);
    });

    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });

    // Mobile nav toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smooth scroll for CTA buttons
    const ctaButtons = document.querySelectorAll('.hero-cta a');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const href = button.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// ==================== WINDOW RESIZE ====================
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// ==================== PERFORMANCE OPTIMIZATION ====================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (renderer) {
            renderer.setAnimationLoop(null);
        }
    } else {
        if (renderer) {
            renderer.setAnimationLoop(animate);
        }
    }
});

// ==================== CURSOR PARTICLE TRAIL ====================
const cursorCanvas = document.createElement('canvas');
cursorCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:998;';
document.body.appendChild(cursorCanvas);

const ctx = cursorCanvas.getContext('2d');
cursorCanvas.width = window.innerWidth;
cursorCanvas.height = window.innerHeight;

class CursorParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.hue = Math.random() * 60 + 260; // Purple to cyan range
        this.life = 100;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 3;
        if (this.size > 0.2) this.size -= 0.1;
    }

    draw() {
        ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.life / 100})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const cursorParticles = [];
let lastMouseX = 0, lastMouseY = 0;

document.addEventListener('mousemove', (e) => {
    // Only create particles if mouse moved significantly
    const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
    if (dist > 5) {
        for (let i = 0; i < 2; i++) {
            cursorParticles.push(new CursorParticle(e.clientX, e.clientY));
        }
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }
});

function animateCursorParticles() {
    ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    for (let i = cursorParticles.length - 1; i >= 0; i--) {
        cursorParticles[i].update();
        cursorParticles[i].draw();

        if (cursorParticles[i].life <= 0 || cursorParticles[i].size <= 0.2) {
            cursorParticles.splice(i, 1);
        }
    }

    requestAnimationFrame(animateCursorParticles);
}

animateCursorParticles();

window.addEventListener('resize', () => {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
});

// ==================== CONSOLE BRANDING ====================
console.log('%c🚀 Portfolio by Tanveer Raza', 'font-size: 24px; color: #9d4edd; font-weight: bold; text-shadow: 0 0 20px #9d4edd;');
console.log('%cFull Stack Developer | PHP Laravel | Python Django | Vue | React | React Native | Flutter', 'font-size: 14px; color: #00d9ff;');
