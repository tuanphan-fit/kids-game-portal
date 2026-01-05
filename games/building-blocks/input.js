let raycaster;
let mouse;
let selectedObject = null;
let dragConstraint = null;
let dragBody = null;
let isDragging = false;
let isOrbiting = false;
let previousMousePosition = { x: 0, y: 0 };

function initInput(camera, canvas) {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchcancel', onTouchEnd);
    
    return { raycaster, mouse };
}

function getMousePosition(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    
    return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1,
        screenX: clientX,
        screenY: clientY
    };
}

function raycast(mousePos, camera, objects) {
    raycaster.setFromCamera(new THREE.Vector2(mousePos.x, mousePos.y), camera);
    const intersects = raycaster.intersectObjects(objects, false);
    return intersects.length > 0 ? intersects[0] : null;
}

function onMouseDown(event) {
    const canvas = document.getElementById('gameCanvas');
    const camera = getCamera();
    const objects = getObjects();
    
    const mousePos = getMousePosition(event, canvas);
    mouse.set(mousePos.x, mousePos.y);
    
    if (orbitMode) {
        isOrbiting = true;
        previousMousePosition = { x: mousePos.screenX, y: mousePos.screenY };
        return;
    }
    
    const intersect = raycast(mousePos, camera, objects);
    
    if (intersect) {
        if (deleteMode) {
            handleDeleteClick(intersect.object);
        } else {
            startDrag(intersect);
        }
    }
}

function onMouseMove(event) {
    const canvas = document.getElementById('gameCanvas');
    const mousePos = getMousePosition(event, canvas);
    
    if (isOrbiting && orbitMode) {
        const deltaX = mousePos.screenX - previousMousePosition.x;
        orbitCamera(deltaX);
        previousMousePosition = { x: mousePos.screenX, y: mousePos.screenY };
        return;
    }
    
    if (isDragging && !deleteMode) {
        updateDrag(mousePos, camera);
    }
    
    if (deleteMode && !isDragging) {
        handleDeleteHover(mousePos, camera);
    }
}

function onMouseUp(event) {
    if (isOrbiting) {
        isOrbiting = false;
    }
    
    if (isDragging) {
        endDrag();
    }
}

function onTouchStart(event) {
    event.preventDefault();
    onMouseDown(event);
}

function onTouchMove(event) {
    event.preventDefault();
    onMouseMove(event);
}

function onTouchEnd(event) {
    onMouseUp(event);
}

function startDrag(intersect) {
    selectedObject = intersect.object;
    const physicsObject = getPhysicsObjectByMesh(selectedObject);
    
    if (physicsObject && physicsObject.body) {
        isDragging = true;
        
        const bodyPos = physicsObject.body.position;
        
        dragBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Sphere(0.1),
            position: new CANNON.Vec3(
                intersect.point.x,
                intersect.point.y,
                intersect.point.z
            )
        });
        
        getWorld().addBody(dragBody);
        
        const localPivot = new CANNON.Vec3(
            intersect.point.x - bodyPos.x,
            intersect.point.y - bodyPos.y,
            intersect.point.z - bodyPos.z
        );
        
        dragConstraint = new CANNON.PointToPointConstraint(
            physicsObject.body,
            localPivot,
            dragBody,
            new CANNON.Vec3(0, 0, 0)
        );
        
        getWorld().addConstraint(dragConstraint);
        
        selectedObject.material.emissive.setHex(0x444444);
    }
}

function updateDrag(mousePos, camera) {
    if (!dragBody) return;
    
    raycaster.setFromCamera(new THREE.Vector2(mousePos.x, mousePos.y), camera);
    
    const planeNormal = new THREE.Vector3(0, 1, 0);
    const planeConstant = -dragBody.position.y;
    const plane = new THREE.Plane(planeNormal, planeConstant);
    const targetPoint = new THREE.Vector3();
    
    raycaster.ray.intersectPlane(plane, targetPoint);
    
    if (targetPoint) {
        dragBody.position.set(targetPoint.x, targetPoint.y, targetPoint.z);
    }
}

function endDrag() {
    if (dragConstraint) {
        getWorld().removeConstraint(dragConstraint);
        dragConstraint = null;
    }
    
    if (dragBody) {
        getWorld().removeBody(dragBody);
        dragBody = null;
    }
    
    if (selectedObject) {
        selectedObject.material.emissive.setHex(0x000000);
        selectedObject = null;
    }
    
    isDragging = false;
}

function handleDeleteClick(blockMesh) {
    const physicsObject = getPhysicsObjectByMesh(blockMesh);
    if (physicsObject) removePhysicsBody(physicsObject);
    
    const scene = getScene();
    scene.remove(blockMesh);
    
    removeObjectFromScene(blockMesh);
    
    if (window.decrementBlockCount) {
        window.decrementBlockCount();
    }
    
    showDeleteFlash();
}

function handleDeleteHover(mousePos, camera) {
    const objects = getObjects();
    const intersect = raycast(mousePos, camera, objects);
    
    objects.forEach(obj => {
        obj.material.emissive.setHex(0x000000);
    });
    
    if (intersect) {
        intersect.object.material.emissive.setHex(0xFF0000);
    }
}

function showDeleteFlash() {
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '1000';
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.remove();
    }, 200);
}

function setSnapMode(enabled) {
    snapMode = enabled;
}

function setOrbitMode(enabled) {
    orbitMode = enabled;
    if (enabled) {
        isOrbiting = false;
    }
}

function setDeleteMode(enabled) {
    deleteMode = enabled;
    if (!enabled) {
        const objects = getObjects();
        objects.forEach(obj => {
            obj.material.emissive.setHex(0x000000);
        });
    }
}

window.initInput = initInput;
window.setSnapMode = setSnapMode;
window.setOrbitMode = setOrbitMode;
window.setDeleteMode = setDeleteMode;