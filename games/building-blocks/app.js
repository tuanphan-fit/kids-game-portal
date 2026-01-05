let snapMode = true;
let orbitMode = false;
let deleteMode = false;
let blockCount = 0;
const MAX_BLOCKS = 200;
const SPAWN_HEIGHT = 8;

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
    initUI();
    
    updateBlockCount();
    
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

function spawnBlock() {
    if (blockCount >= MAX_BLOCKS) {
        alert('Too many blocks! Reset to add more.');
        return;
    }
    
    const type = getCurrentBlockType();
    const color = getCurrentColor();
    const { mesh, dimensions } = createBlockMesh(type, color);
    
    const randomX = (Math.random() - 0.5) * 6;
    const randomZ = (Math.random() - 0.5) * 6;
    
    let position = {
        x: randomX,
        y: SPAWN_HEIGHT,
        z: randomZ
    };
    
    if (snapMode) {
        position = snapToGrid(position);
    }
    
    if (!isWithinBounds(position)) {
        alert('Cannot spawn outside building area!');
        return;
    }
    
    mesh.position.set(position.x, position.y, position.z);
    addObjectToScene(mesh);
    
    const physicsBody = createPhysicsBody(type, position, dimensions);
    physicsBody.mesh = mesh;
    
    incrementBlockCount();
}

function resetScene() {
    showConfirmModal('Delete all blocks?', () => {
        clearScene();
        clearPhysics();
        blockCount = 0;
        updateBlockCount();
    });
}

function toggleSnapMode() {
    snapMode = !snapMode;
    setSnapMode(snapMode);
    updateUIState();
    return snapMode;
}

function toggleOrbitMode() {
    orbitMode = !orbitMode;
    setOrbitMode(orbitMode);
    if (!orbitMode) {
        resetCamera();
    }
    updateUIState();
    return orbitMode;
}

function toggleDeleteMode() {
    deleteMode = !deleteMode;
    setDeleteMode(deleteMode);
    updateUIState();
    return deleteMode;
}

function updateBlockCount() {
    document.getElementById('blockCount').textContent = blockCount;
}

function incrementBlockCount() {
    blockCount++;
    updateBlockCount();
}

function decrementBlockCount() {
    if (blockCount > 0) {
        blockCount--;
        updateBlockCount();
    }
}

function setBlockCount(count) {
    blockCount = count;
    updateBlockCount();
}

function getSnapMode() {
    return snapMode;
}

function getOrbitMode() {
    return orbitMode;
}

function getDeleteMode() {
    return deleteMode;
}

function goBack() {
    resetScene();
    GameNavigation.navigateToPortal();
}

window.initApp = initApp;
window.spawnBlock = spawnBlock;
window.resetScene = resetScene;
window.toggleSnapMode = toggleSnapMode;
window.toggleOrbitMode = toggleOrbitMode;
window.toggleDeleteMode = toggleDeleteMode;
window.incrementBlockCount = incrementBlockCount;
window.decrementBlockCount = decrementBlockCount;
window.setBlockCount = setBlockCount;
window.getSnapMode = getSnapMode;
window.getOrbitMode = getOrbitMode;
window.getDeleteMode = getDeleteMode;
window.goBack = goBack;

window.addEventListener('load', function() {
    setTimeout(initApp, 100);
});