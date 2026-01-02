let raycaster;
let mouse;
let selectedObject = null;
let dragConstraint = null;
let dragBody = null;
let isDragging = false;

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
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;

    return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1,
        screenX: clientX,
        screenY: clientY
    };
}

function raycast(mousePos, camera, objects) {
    if (!raycaster || !camera || !objects || objects.length === 0) {
        return null;
    }

    raycaster.setFromCamera(
        new THREE.Vector2(mousePos.x, mousePos.y),
        camera
    );

    const intersects = raycaster.intersectObjects(objects, false);
    return intersects.length > 0 ? intersects[0] : null;
}

function onMouseDown(event) {
    const canvas = document.getElementById('gameCanvas');
    const camera = getCamera();
    const objects = getObjects();

    const mousePos = getMousePosition(event, canvas);
    mouse.set(mousePos.x, mousePos.y);

    const intersect = raycast(mousePos, camera, objects);

    if (intersect) {
        startDrag(intersect);
    }
}

function onMouseMove(event) {
    if (!isDragging || !selectedObject) return;

    const canvas = document.getElementById('gameCanvas');
    const camera = getCamera();
    const mousePos = getMousePosition(event, canvas);

    updateDrag(mousePos, camera);
}

function onMouseUp(event) {
    if (isDragging) {
        endDrag();
    }
}

function onTouchStart(event) {
    event.preventDefault();

    const canvas = document.getElementById('gameCanvas');
    const camera = getCamera();
    const objects = getObjects();

    const mousePos = getMousePosition(event, canvas);
    mouse.set(mousePos.x, mousePos.y);

    const intersect = raycast(mousePos, camera, objects);

    if (intersect) {
        startDrag(intersect);
    }
}

function onTouchMove(event) {
    event.preventDefault();

    if (!isDragging || !selectedObject) return;

    const canvas = document.getElementById('gameCanvas');
    const camera = getCamera();
    const mousePos = getMousePosition(event, canvas);

    updateDrag(mousePos, camera);
}

function onTouchEnd(event) {
    if (isDragging) {
        endDrag();
    }
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

    raycaster.setFromCamera(
        new THREE.Vector2(mousePos.x, mousePos.y),
        camera
    );

    const planeNormal = new THREE.Vector3(0, 1, 0);
    const planeConstant = -dragBody.position.y;

    const plane = new THREE.Plane(planeNormal, planeConstant);
    const targetPoint = new THREE.Vector3();

    raycaster.ray.intersectPlane(plane, targetPoint);

    if (targetPoint) {
        dragBody.position.set(
            targetPoint.x,
            targetPoint.y,
            targetPoint.z
        );
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

function getSelectedObject() {
    return selectedObject;
}

function isObjectDragging() {
    return isDragging;
}

window.initInput = initInput;
window.raycast = raycast;
window.startDrag = startDrag;
window.updateDrag = updateDrag;
window.endDrag = endDrag;
window.getSelectedObject = getSelectedObject;
window.isObjectDragging = isObjectDragging;