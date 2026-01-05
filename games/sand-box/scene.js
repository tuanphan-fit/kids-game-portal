let scene, camera, renderer;
let floorMesh;
let bucketMesh;
const objects = [];
const SAND_COLORS = {
    sand: 0xD4A574,
    gold: 0xFFD700,
    red: 0xC62828,
    blue: 0x1565C0
};

let selectedColor = 'sand';

function initScene() {
    const canvas = document.getElementById('gameCanvas');

    if (!canvas) {
        console.error('Canvas element not found');
        return null;
    }

    console.log('Canvas found:', canvas.clientWidth, 'x', canvas.clientHeight);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFE082);

    const aspect = canvas.clientWidth > 0 ? canvas.clientWidth / canvas.clientHeight : 1;

    camera = new THREE.PerspectiveCamera(
        60,
        aspect,
        0.1,
        1000
    );

    camera.position.set(0, 30, 30);
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
    createBucket();

    window.addEventListener('resize', onWindowResize);

    setTimeout(() => {
        console.log('Forcing resize...');
        onWindowResize();
        renderer.render(scene, camera);
    }, 100);

    return { scene, camera, renderer };
}

function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -40;
    directionalLight.shadow.camera.right = 40;
    directionalLight.shadow.camera.top = 40;
    directionalLight.shadow.camera.bottom = -40;
    scene.add(directionalLight);
}

function createFloor() {
    const floorGeometry = new THREE.PlaneGeometry(80, 80);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFECB3,
        roughness: 0.9,
        metalness: 0.1
    });

    floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const gridHelper = new THREE.GridHelper(80, 80, 0xFFB300, 0xFFE082);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);
}

function createBucket() {
    const bucketRadius = 12;
    const bucketHeight = 8;
    const bucketThickness = 0.3;

    const bucketGroup = new THREE.Group();

    const bucketMaterial = new THREE.MeshStandardMaterial({
        color: 0x0277BD,
        roughness: 0.3,
        metalness: 0.5,
        side: THREE.DoubleSide
    });

    const bucketGeometry = new THREE.CylinderGeometry(
        bucketRadius,
        bucketRadius * 0.95,
        bucketHeight,
        32,
        1,
        true
    );

    const bucket = new THREE.Mesh(bucketGeometry, bucketMaterial);
    bucket.castShadow = true;
    bucket.receiveShadow = true;
    bucketGroup.add(bucket);

    const bottomGeometry = new THREE.CircleGeometry(bucketRadius * 0.95, 32);
    const bottom = new THREE.Mesh(bottomGeometry, bucketMaterial);
    bottom.rotation.x = Math.PI / 2;
    bottom.position.y = -bucketHeight / 2;
    bottom.receiveShadow = true;
    bucketGroup.add(bottom);

    const rimGeometry = new THREE.TorusGeometry(bucketRadius, bucketThickness, 16, 32);
    const rim = new THREE.Mesh(rimGeometry, bucketMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = bucketHeight / 2;
    rim.castShadow = true;
    bucketGroup.add(rim);

    bucketMesh = bucketGroup;
    bucketMesh.position.set(0, 4, 0);
    scene.add(bucketMesh);
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

function createSandGrain(type) {
    const color = SAND_COLORS[type] || SAND_COLORS.sand;
    const size = 0.3;

    const geometry = new THREE.SphereGeometry(size, 8, 6);
    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
        metalness: 0.1
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const dimensions = { x: size, y: size, z: size };

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

function getBucketMesh() {
    return bucketMesh;
}

function getSelectedColor() {
    return selectedColor;
}

function setSelectedColor(color) {
    selectedColor = color;
}

window.getScene = getScene;
window.getCamera = getCamera;
window.getRenderer = getRenderer;
window.getObjects = getObjects;
window.getBucketMesh = getBucketMesh;
window.getSelectedColor = getSelectedColor;
window.setSelectedColor = setSelectedColor;
window.createSandGrain = createSandGrain;
window.addObjectToScene = addObjectToScene;
window.removeObjectFromScene = removeObjectFromScene;
window.clearScene = clearScene;