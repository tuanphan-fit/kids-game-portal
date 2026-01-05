const BLOCK_TYPES = {
    cube: {
        name: 'Cube',
        icon: '🟦',
        createGeometry: () => new THREE.BoxGeometry(1, 1, 1)
    },
    tall: {
        name: 'Tall',
        icon: '📏',
        createGeometry: () => new THREE.BoxGeometry(1, 2, 1)
    },
    flat: {
        name: 'Plank',
        icon: '➖',
        createGeometry: () => new THREE.BoxGeometry(2, 0.5, 2)
    },
    cylinder: {
        name: 'Cylinder',
        icon: '🛢️',
        createGeometry: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 32)
    },
    sphere: {
        name: 'Sphere',
        icon: '🔴',
        createGeometry: () => new THREE.SphereGeometry(0.5, 32, 32)
    },
    L: {
        name: 'L-Shape',
        icon: '📐',
        createGeometry: createLGeometry
    },
    T: {
        name: 'T-Shape',
        icon: '🔀',
        createGeometry: createTGeometry
    },
    ramp: {
        name: 'Ramp',
        icon: '📐',
        createGeometry: createRampGeometry
    },
    pyramid: {
        name: 'Pyramid',
        icon: '🔺',
        createGeometry: createPyramidGeometry
    },
    stairs: {
        name: 'Stairs',
        icon: '🪜',
        createGeometry: createStairsGeometry
    }
};

function createLGeometry() {
    const group = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 1, -0.5,
        -0.5, 0, -0.5, 0.5, 1, -0.5, -0.5, 1, -0.5,
        -0.5, 0, 0.5, -0.5, 1, 0.5, -0.5, 1, -0.5,
        -0.5, 0, 0.5, -0.5, 1, -0.5, -0.5, 0, -0.5,
        0.5, 0, 0.5, 0.5, 1, 0.5, 0.5, 0, -0.5,
        0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 1, -0.5
    ]);
    group.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    group.computeVertexNormals();
    return group;
}

function createTGeometry() {
    const box = new THREE.BoxGeometry(2, 1, 1);
    return box;
}

function createRampGeometry() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(2, 0);
    shape.lineTo(2, 1);
    shape.lineTo(0, 0);
    
    const extrudeSettings = {
        steps: 1,
        depth: 1,
        bevelEnabled: false
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.rotateX(Math.PI / 2);
    geometry.translate(-1, 0.5, 0.5);
    
    return geometry;
}

function createPyramidGeometry() {
    const geometry = new THREE.ConeGeometry(0.707, 1, 4);
    return geometry;
}

function createStairsGeometry() {
    const box = new THREE.BoxGeometry(2, 1, 2);
    return box;
}

function createBlockMesh(type, color) {
    const blockDef = BLOCK_TYPES[type];
    const geometry = blockDef.createGeometry();
    
    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.4,
        metalness: 0.2
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.type = type;
    
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const dimensions = {
        x: box.max.x - box.min.x,
        y: box.max.y - box.min.y,
        z: box.max.z - box.min.z
    };
    
    return { mesh, dimensions };
}

function snapToGrid(position) {
    return {
        x: Math.round(position.x),
        y: position.y,
        z: Math.round(position.z)
    };
}

function isWithinBounds(position) {
    const bound = 18;
    return Math.abs(position.x) < bound && Math.abs(position.z) < bound;
}

window.BLOCK_TYPES = BLOCK_TYPES;
window.createBlockMesh = createBlockMesh;
window.snapToGrid = snapToGrid;
window.isWithinBounds = isWithinBounds;