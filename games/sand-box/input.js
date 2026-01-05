let raycaster;
let mouse;
let selectedObject = null;
let dragConstraint = null;
let dragBody = null;
let isDragging = false;
let selectedTool = 'none';
let bucketDragConstraint = null;
let bucketDragBody = null;

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

function raycastBucket(mousePos, camera, bucketMesh) {
    if (!raycaster || !camera || !bucketMesh) {
        return null;
    }

    raycaster.setFromCamera(
        new THREE.Vector2(mousePos.x, mousePos.y),
        camera
    );

    const bucketChildren = bucketMesh.children.filter(child => child.type === 'Mesh');
    const intersects = raycaster.intersectObjects(bucketChildren, false);
    return intersects.length > 0 ? intersects[0] : null;
}

function onMouseDown(event) {
    const canvas = document.getElementById('gameCanvas');
    const camera = getCamera();
    const objects = getObjects();
    const bucketMesh = getBucketMesh();
    const bucketBody = getBucketPhysicsBody();

    const mousePos = getMousePosition(event, canvas);
    mouse.set(mousePos.x, mousePos.y);

    let intersect = raycastBucket(mousePos, camera, bucketMesh);

    if (intersect && bucketBody) {
        startBucketDrag(intersect, bucketBody);
        return;
    }

    intersect = raycast(mousePos, camera, objects);

    if (intersect) {
        handleToolClick(intersect);
        startDrag(intersect);
    }
}

function onMouseMove(event) {
    if (isDragging) {
        if (bucketDragBody) {
            const canvas = document.getElementById('gameCanvas');
            const camera = getCamera();
            const mousePos = getMousePosition(event, canvas);
            updateBucketDrag(mousePos, camera);
        } else if (selectedObject) {
            const canvas = document.getElementById('gameCanvas');
            const camera = getCamera();
            const mousePos = getMousePosition(event, canvas);
            updateDrag(mousePos, camera);
        }
    }
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
    const bucketMesh = getBucketMesh();
    const bucketBody = getBucketPhysicsBody();

    const mousePos = getMousePosition(event, canvas);
    mouse.set(mousePos.x, mousePos.y);

    let intersect = raycastBucket(mousePos, camera, bucketMesh);

    if (intersect && bucketBody) {
        startBucketDrag(intersect, bucketBody);
        return;
    }

    intersect = raycast(mousePos, camera, objects);

    if (intersect) {
        handleToolClick(intersect);
        startDrag(intersect);
    }
}

function onTouchMove(event) {
    event.preventDefault();

    if (isDragging) {
        if (bucketDragBody) {
            const canvas = document.getElementById('gameCanvas');
            const camera = getCamera();
            const mousePos = getMousePosition(event, canvas);
            updateBucketDrag(mousePos, camera);
        } else if (selectedObject) {
            const canvas = document.getElementById('gameCanvas');
            const camera = getCamera();
            const mousePos = getMousePosition(event, canvas);
            updateDrag(mousePos, camera);
        }
    }
}

function onTouchEnd(event) {
    if (isDragging) {
        endDrag();
    }
}

function handleToolClick(intersect) {
    if (selectedTool === 'shovel') {
        playSound('tool');
    } else if (selectedTool === 'rake') {
        playSound('tool');
    } else if (selectedTool === 'mold') {
        playSound('tool');
    }
}

function startBucketDrag(intersect, bucketBody) {
    isDragging = true;
    bucketDragBody = bucketBody;

    bucketDragConstraint = new CANNON.PointToPointConstraint(
        bucketBody,
        new CANNON.Vec3(0, 4, 0),
        new CANNON.Body({ mass: 0 }),
        new CANNON.Vec3(0, 0, 0)
    );

    getWorld().addConstraint(bucketDragConstraint);
}

function updateBucketDrag(mousePos, camera) {
    if (!bucketDragBody || !bucketDragConstraint) return;

    raycaster.setFromCamera(
        new THREE.Vector2(mousePos.x, mousePos.y),
        camera
    );

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -8);
    const targetPoint = new THREE.Vector3();

    raycaster.ray.intersectPlane(plane, targetPoint);

    if (targetPoint) {
        bucketDragBody.position.set(
            targetPoint.x,
            Math.max(targetPoint.y, 4),
            targetPoint.z
        );
        bucketDragBody.velocity.set(0, 0, 0);
        bucketDragBody.angularVelocity.set(0, 0, 0);
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

    if (bucketDragConstraint) {
        getWorld().removeConstraint(bucketDragConstraint);
        bucketDragConstraint = null;
    }

    bucketDragBody = null;

    if (selectedObject) {
        selectedObject.material.emissive.setHex(0x000000);
        selectedObject = null;
    }

    isDragging = false;
}

function setSelectedTool(tool) {
    selectedTool = tool;
}

function getSelectedTool() {
    return selectedTool;
}

function getSelectedObject() {
    return selectedObject;
}

function isObjectDragging() {
    return isDragging;
}

window.initInput = initInput;
window.raycast = raycast;
window.raycastBucket = raycastBucket;
window.startDrag = startDrag;
window.updateDrag = updateDrag;
window.endDrag = endDrag;
window.setSelectedTool = setSelectedTool;
window.getSelectedTool = getSelectedTool;
window.getSelectedObject = getSelectedObject;
window.isObjectDragging = isObjectDragging;