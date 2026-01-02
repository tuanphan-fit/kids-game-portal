let world;
let physicsObjects = [];
const TIME_STEP = 1 / 60;

function initPhysics() {
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
            friction: 0.5,
            restitution: 0.3
        }
    );

    world.addContactMaterial(defaultContactMaterial);

    createFloorBody(defaultMaterial);

    return { world };
}

function createFloorBody(material) {
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({
        mass: 0,
        shape: floorShape,
        material: material
    });

    floorBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        -Math.PI / 2
    );

    world.addBody(floorBody);
    return floorBody;
}

function createPhysicsBody(type, position, dimensions) {
    let shape;

    switch (type) {
        case 'cube':
            shape = new CANNON.Box(new CANNON.Vec3(
                dimensions.x / 2,
                dimensions.y / 2,
                dimensions.z / 2
            ));
            break;
        case 'cylinder':
            shape = new CANNON.Cylinder(
                dimensions.x,
                dimensions.x,
                dimensions.y,
                32
            );
            break;
        case 'sphere':
            shape = new CANNON.Sphere(dimensions.x);
            break;
        default:
            shape = new CANNON.Box(new CANNON.Vec3(
                dimensions.x / 2,
                dimensions.y / 2,
                dimensions.z / 2
            ));
    }

    const body = new CANNON.Body({
        mass: 1,
        shape: shape,
        linearDamping: 0.1,
        angularDamping: 0.1
    });

    body.position.set(position.x, position.y, position.z);

    world.addBody(body);

    const physicsObject = {
        body: body,
        mesh: null
    };

    physicsObjects.push(physicsObject);

    return physicsObject;
}

function syncMeshWithBody(physicsObject) {
    if (!physicsObject.body || !physicsObject.mesh) return;

    physicsObject.mesh.position.copy(physicsObject.body.position);
    physicsObject.mesh.quaternion.copy(physicsObject.body.quaternion);
}

function stepPhysics() {
    world.step(TIME_STEP);

    physicsObjects.forEach(physObj => {
        syncMeshWithBody(physObj);
    });
}

function removePhysicsBody(physicsObject) {
    if (physicsObject.body) {
        world.removeBody(physicsObject.body);
    }

    const index = physicsObjects.indexOf(physicsObject);
    if (index > -1) {
        physicsObjects.splice(index, 1);
    }
}

function clearPhysics() {
    for (let i = physicsObjects.length - 1; i >= 0; i--) {
        if (physicsObjects[i].body) {
            world.removeBody(physicsObjects[i].body);
        }
    }
    physicsObjects.length = 0;
}

function getPhysicsObjectByMesh(mesh) {
    return physicsObjects.find(physObj => physObj.mesh === mesh);
}

function getWorld() {
    return world;
}

function getPhysicsObjects() {
    return physicsObjects;
}

window.initPhysics = initPhysics;
window.createPhysicsBody = createPhysicsBody;
window.syncMeshWithBody = syncMeshWithBody;
window.stepPhysics = stepPhysics;
window.removePhysicsBody = removePhysicsBody;
window.clearPhysics = clearPhysics;
window.getPhysicsObjectByMesh = getPhysicsObjectByMesh;
window.getWorld = getWorld;
window.getPhysicsObjects = getPhysicsObjects;