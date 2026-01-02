let scene, camera, renderer;
let floorMesh;
const objects = [];

function initScene() {
    const canvas = document.getElementById('gameCanvas');

    if (!canvas) {
        console.error('Canvas element not found');
        return null;
    }

    console.log('Canvas found:', canvas.clientWidth, 'x', canvas.clientHeight);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xB3E5FC);

    const aspect = canvas.clientWidth > 0 ? canvas.clientWidth / canvas.clientHeight : 1;

    camera = new THREE.PerspectiveCamera(
        60,
        aspect,
        0.1,
        1000
    );

    camera.position.set(0, 15, 15);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false
    });

    const width = canvas.clientWidth > 0 ? canvas.clientWidth : window.innerWidth;
    const height = canvas.clientHeight > 0 ? canvas.clientHeight : window.innerHeight;

    console.log('Setting renderer size:', width, 'x', height);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    setupLights();
    createFloor();

    window.addEventListener('resize', onWindowResize);

    setTimeout(() => {
        console.log('Forcing resize...');
        onWindowResize();
        renderer.render(scene, camera);
    }, 100);

    return { scene, camera, renderer };
}

function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);
}

function createFloor() {
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xE0F7FA,
        roughness: 0.8,
        metalness: 0.1
    });

    floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const gridHelper = new THREE.GridHelper(30, 30, 0x81D4FA, 0xB3E5FC);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);
}

function onWindowResize() {
    const canvas = document.getElementById('gameCanvas');

    if (!canvas || !camera || !renderer) return;

    const width = canvas.clientWidth > 0 ? canvas.clientWidth : window.innerWidth;
    const height = canvas.clientHeight > 0 ? canvas.clientHeight : window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function createMesh(type, color, size) {
    let geometry;
    let dimensions = { x: size, y: size, z: size };

    switch (type) {
        case 'cube':
            geometry = new THREE.BoxGeometry(size, size, size);
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(size / 2, size / 2, size, 32);
            dimensions = { x: size / 2, y: size, z: size / 2 };
            break;
        case 'sphere':
            geometry = new THREE.SphereGeometry(size / 2, 32, 32);
            dimensions = { x: size / 2, y: size / 2, z: size / 2 };
            break;
        default:
            geometry = new THREE.BoxGeometry(size, size, size);
    }

    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.4,
        metalness: 0.2
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return { mesh, dimensions };
}

function addObjectToScene(mesh) {
    scene.add(mesh);
    objects.push(mesh);
}

function removeObjectFromScene(mesh) {
    scene.remove(mesh);
    const index = objects.indexOf(mesh);
    if (index > -1) {
        objects.splice(index, 1);
    }
}

function clearScene() {
    for (let i = objects.length - 1; i >= 0; i--) {
        scene.remove(objects[i]);
    }
    objects.length = 0;
}

function getScene() {
    return scene;
}

function getCamera() {
    return camera;
}

function getRenderer() {
    return renderer;
}

function getObjects() {
    return objects;
}

window.getScene = getScene;
window.getCamera = getCamera;
window.getRenderer = getRenderer;
window.getObjects = getObjects;
window.createMesh = createMesh;
window.addObjectToScene = addObjectToScene;
window.removeObjectFromScene = removeObjectFromScene;
window.clearScene = clearScene;