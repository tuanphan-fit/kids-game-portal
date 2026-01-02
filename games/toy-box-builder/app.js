const COLORS = {
    cube: 0xFF6B9D,
    cylinder: 0x4DD0E1,
    sphere: 0xFFB74D
};

const OBJECT_SIZE = 2;
const MAX_OBJECTS = 50;
const SPAWN_HEIGHT = 10;
let objectCount = 0;

function initApp() {
    if (typeof THREE === 'undefined') {
        console.error('THREE.js not loaded');
        alert('Error: 3D library not loaded. Please refresh the page.');
        return;
    }

    if (typeof CANNON === 'undefined') {
        console.error('CANNON.js not loaded');
        alert('Error: Physics library not loaded. Please refresh the page.');
        return;
    }

    const sceneData = initScene();
    if (!sceneData) {
        console.error('Scene initialization failed');
        return;
    }

    initPhysics();

    const cameraObj = getCamera();
    const canvas = document.getElementById('gameCanvas');

    if (!cameraObj || !canvas) {
        console.error('Camera or canvas not available');
        return;
    }

    initInput(cameraObj, canvas);

    console.log('Initialization complete, starting animation');

    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    stepPhysics();

    const rendererObj = getRenderer();
    const sceneObj = getScene();
    const cameraObj = getCamera();

    rendererObj.render(sceneObj, cameraObj);
}

function spawnObject(type) {
    if (objectCount >= MAX_OBJECTS) {
        alert('Too many toys! Reset to add more.');
        return;
    }

    const color = COLORS[type] || 0xffffff;
    const { mesh, dimensions } = createMesh(type, color, OBJECT_SIZE);

    const randomX = (Math.random() - 0.5) * 8;
    const randomZ = (Math.random() - 0.5) * 8;

    const position = {
        x: randomX,
        y: SPAWN_HEIGHT,
        z: randomZ
    };

    mesh.position.set(position.x, position.y, position.z);
    addObjectToScene(mesh);

    const physicsObject = createPhysicsBody(type, position, dimensions);
    physicsObject.mesh = mesh;

    objectCount++;
}

function resetScene() {
    const objects = getObjects();

    while (objects.length > 0) {
        const mesh = objects[objects.length - 1];
        const physicsObject = getPhysicsObjectByMesh(mesh);

        if (physicsObject) {
            removePhysicsBody(physicsObject);
        }

        removeObjectFromScene(mesh);
    }

    objectCount = 0;
}

function goBack() {
    resetScene();
    GameNavigation.navigateToPortal();
}

window.spawnObject = spawnObject;
window.resetScene = resetScene;
window.goBack = goBack;

window.addEventListener('load', function() {
    console.log('Page loaded, initializing...');
    setTimeout(initApp, 100);
});