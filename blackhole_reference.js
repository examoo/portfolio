// Black Hole Creation - Insert after line 67 in script.js

// Create Black Hole at Galaxy Center
function createBlackHole() {
    // Event Horizon (completely black sphere)
    const horizonGeometry = new THREE.SphereGeometry(2, 32, 32);
    const horizonMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 1
    });
    eventHorizon = new THREE.Mesh(horizonGeometry, horizonMaterial);
    scene.add(eventHorizon);

    // Schwarzschild radius glow (gravitational distortion effect)
    const glowGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.8,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    eventHorizon.add(glow);

    // Accretion Disk - Hot glowing matter spiraling into black hole
    const diskGeometry = new THREE.RingGeometry(3, 8, 64);
    const diskMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
    accretionDisk.rotation.x = Math.PI / 2;
    scene.add(accretionDisk);

    // Accretion disk particles (matter spiraling in)
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    for (let i = 0; i < particleCount; i++) {
        // Spiral pattern
        const angle = (i / particleCount) * Math.PI * 8;
        const radius = 3 + (i / particleCount) * 5;

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 0.5;

        positions.push(x, y, z);

        // Hot colors - from orange to yellow to white
        const heat = 1 - (radius / 8);
        const r = 1;
        const g = 0.3 + heat * 0.7;
        const b = heat * 0.3;

        colors.push(r, g, b);
        sizes.push(Math.random() * 0.5 + 0.2);
    }

    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const diskParticles = new THREE.Points(particleGeometry, particleMaterial);
    accretionDisk.add(diskParticles);

    // Inner bright ring (photon sphere)
    const photonGeometry = new THREE.RingGeometry(2.8, 3.2, 64);
    const photonMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });
    const photonRing = new THREE.Mesh(photonGeometry, photonMaterial);
    photonRing.rotation.x = Math.PI / 2;
    accretionDisk.add(photonRing);
}
