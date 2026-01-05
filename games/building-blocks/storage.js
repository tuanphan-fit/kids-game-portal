const STORAGE_KEY = 'building-blocks-saves';
const THUMBNAIL_SIZE = 256;

function getSaves() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error('Error parsing saves:', e);
        return [];
    }
}

function saveCreation(slotId, name) {
    const saves = getSaves();
    const blocks = getCurrentBlocksData();
    const thumbnail = generateThumbnail();
    
    const saveData = {
        id: slotId,
        name: name || `Building #${slotId + 1}`,
        timestamp: Date.now(),
        blocks: blocks,
        thumbnail: thumbnail,
        blockCount: blocks.length
    };
    
    while (saves.length < 5) {
        saves.push(null);
    }
    
    saves[slotId] = saveData;
    
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
        return true;
    } catch (e) {
        console.error('Error saving:', e);
        alert('Save failed - storage full!');
        return false;
    }
}

function loadCreation(slotId) {
    const saves = getSaves();
    
    if (!saves || !saves[slotId]) {
        return false;
    }
    
    const saveData = saves[slotId];
    
    clearScene();
    clearPhysics();
    window.setBlockCount(0);
    
    saveData.blocks.forEach(blockData => {
        const { mesh, dimensions } = createBlockMesh(blockData.type, blockData.color);
        
        mesh.position.set(
            blockData.position.x,
            blockData.position.y,
            blockData.position.z
        );
        
        mesh.rotation.set(
            blockData.rotation.x,
            blockData.rotation.y,
            blockData.rotation.z
        );
        
        const scene = getScene();
        scene.add(mesh);
        
        const physicsBody = createPhysicsBody(blockData.type, mesh.position, dimensions);
        physicsBody.body.quaternion.set(
            blockData.rotation.x,
            blockData.rotation.y,
            blockData.rotation.z,
            blockData.rotation.w || 1
        );
        
        addObjectToScene(mesh);
        
        if (window.incrementBlockCount) {
            window.incrementBlockCount();
        }
    });
    
    return true;
}

function deleteSave(slotId) {
    const saves = getSaves();
    
    if (saves && saves[slotId]) {
        saves[slotId] = null;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
        return true;
    }
    
    return false;
}

function getCurrentBlocksData() {
    const objects = getObjects();
    const blocks = [];
    
    objects.forEach(mesh => {
        const physicsObject = getPhysicsObjectByMesh(mesh);
        
        blocks.push({
            type: mesh.userData.type,
            color: mesh.material.color.getHex(),
            position: {
                x: mesh.position.x,
                y: mesh.position.y,
                z: mesh.position.z
            },
            rotation: {
                x: mesh.rotation.x,
                y: mesh.rotation.y,
                z: mesh.rotation.z,
                w: mesh.quaternion.w
            }
        });
    });
    
    return blocks;
}

function generateThumbnail() {
    const renderer = getRenderer();
    const scene = getScene();
    const camera = getCamera();
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = THUMBNAIL_SIZE;
    tempCanvas.height = THUMBNAIL_SIZE;
    const tempRenderer = new THREE.WebGLRenderer({
        canvas: tempCanvas,
        antialias: true
    });
    
    tempRenderer.setSize(THUMBNAIL_SIZE, THUMBNAIL_SIZE);
    tempRenderer.setPixelRatio(1);
    
    tempRenderer.render(scene, camera);
    
    const dataURL = tempCanvas.toDataURL('image/jpeg', 0.7);
    
    tempRenderer.dispose();
    tempCanvas.remove();
    
    return dataURL;
}

window.getSaves = getSaves;
window.saveCreation = saveCreation;
window.loadCreation = loadCreation;
window.deleteSave = deleteSave;