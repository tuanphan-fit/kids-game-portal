let scene, camera, renderer;
let gridHelper;
let orbitAngle = 0;
let orbitRadius = 15;
const objects = [];

function initScene() {
    const canvas = document.getElementById('gameCanvas');
    
    if (!canvas) {
        console.error('Canvas element not found');
        return null;
    }
    
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
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    setupLights();
    createFloor();
    
    window.addEventListener('resize', onWindowResize);
    
    setTimeout(() => {
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
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    scene.add(directionalLight);
}

function createFloor() {
    const floorGeometry = new THREE.PlaneGeometry(40, 40);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xE0F7FA,
        roughness: 0.8,
        metalness: 0.1
    });
    
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);
    
    gridHelper = new THREE.GridHelper(40, 40, 0x81D4FA, 0xB3E5FC);
    gridHelper.position.y = 0.01;
    gridHelper.visible = true;
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

function orbitCamera(deltaX) {
    orbitAngle += deltaX * 0.01;
    
    camera.position.x = Math.sin(orbitAngle) * orbitRadius;
    camera.position.z = Math.cos(orbitAngle) * orbitRadius;
    camera.lookAt(0, 0, 0);
}

function resetCamera() {
    orbitAngle = 0;
    camera.position.set(0, 15, 15);
    camera.lookAt(0, 0, 0);
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

window.initScene = initScene;
window.orbitCamera = orbitCamera;
window.resetCamera = resetCamera;
window.addObjectToScene = addObjectToScene;
window.removeObjectFromScene = removeObjectFromScene;
window.clearScene = clearScene;
window.getScene = getScene;
window.getCamera = getCamera;
window.getRenderer = getRenderer;
window.getObjects = getObjects;