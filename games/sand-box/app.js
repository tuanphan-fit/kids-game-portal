const MAX_OBJECTS = 500;
const SPAWN_HEIGHT = 20;
let objectCount = 0;
let autoPourInterval = null;
let currentPourColor = 'sand';
let currentTool = 'none';

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

    initSounds();

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

    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }

    console.log('Initialization complete, starting animation');
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

function spawnSandGrain(type, x, z) {
    if (objectCount >= MAX_OBJECTS) {
        return null;
    }

    const color = type || getSelectedColor();
    const { mesh, dimensions } = createSandGrain(color);

    const randomOffset = 1.0;
    const position = {
        x: x + (Math.random() - 0.5) * randomOffset,
        y: SPAWN_HEIGHT + Math.random() * 3,
        z: z + (Math.random() - 0.5) * randomOffset
    };

    mesh.position.set(position.x, position.y, position.z);
    addObjectToScene(mesh);

    const physicsObject = createSandGrainBody(position, dimensions);
    physicsObject.mesh = mesh;

    objectCount++;

    return physicsObject;
}

function startAutoPour() {
    if (autoPourInterval) {
        return;
    }

    const bucketBody = getBucketPhysicsBody();
    const pourX = bucketBody ? bucketBody.position.x : 0;
    const pourZ = bucketBody ? bucketBody.position.z : 0;

    const autoPourBtn = document.getElementById('autoPourBtn');
    if (autoPourBtn) {
        autoPourBtn.classList.add('pouring');
    }

    playSound('pour');

    autoPourInterval = setInterval(() => {
        spawnSandGrain(currentPourColor, pourX, pourZ);

        if (objectCount >= MAX_OBJECTS) {
            stopAutoPour();
        }
    }, 50);
}

function stopAutoPour() {
    if (autoPourInterval) {
        clearInterval(autoPourInterval);
        autoPourInterval = null;
    }

    const autoPourBtn = document.getElementById('autoPourBtn');
    if (autoPourBtn) {
        autoPourBtn.classList.remove('pouring');
    }
}

function batchPour() {
    if (objectCount >= MAX_OBJECTS) {
        console.warn('Too much sand! Reset to add more.');
        return;
    }

    playSound('drop');

    const bucketBody = getBucketPhysicsBody();
    const pourX = bucketBody ? bucketBody.position.x : 0;
    const pourZ = bucketBody ? bucketBody.position.z : 0;

    const batchSize = Math.min(50, MAX_OBJECTS - objectCount);

    for (let i = 0; i < batchSize; i++) {
        setTimeout(() => {
            spawnSandGrain(currentPourColor, pourX, pourZ);
        }, i * 10);
    }
}

function selectColor(color) {
    currentPourColor = color;
    setSelectedColor(color);

    playSound('click');

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.color === color) {
            btn.classList.add('active');
        }
    });
}

function selectTool(tool) {
    currentTool = tool;
    setSelectedTool(tool);

    playSound('click');

    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tool === tool) {
            btn.classList.add('active');
        }
    });

    if (tool !== 'none') {
        console.log(tool.charAt(0).toUpperCase() + tool.slice(1) + ' selected');
    }
}

function resetScene() {
    stopAutoPour();

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

    const bucketBody = getBucketPhysicsBody();
    if (bucketBody) {
        bucketBody.position.set(0, 4, 0);
        bucketBody.quaternion.set(0, 0, 0, 1);
        bucketBody.velocity.set(0, 0, 0);
        bucketBody.angularVelocity.set(0, 0, 0);
    }
}

function goBack() {
    resetScene();
    GameNavigation.navigateToPortal();
}

window.spawnSandGrain = spawnSandGrain;
window.startAutoPour = startAutoPour;
window.stopAutoPour = stopAutoPour;
window.batchPour = batchPour;
window.selectColor = selectColor;
window.selectTool = selectTool;
window.resetScene = resetScene;
window.goBack = goBack;

window.addEventListener('load', function() {
    console.log('Page loaded, initializing...');
    setTimeout(initApp, 100);
});