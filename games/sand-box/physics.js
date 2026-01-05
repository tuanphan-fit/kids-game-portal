let world;
let physicsObjects = [];
let bucketPhysicsBody;
const TIME_STEP = 1 / 60;

function initPhysics() {
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 15;

    const defaultMaterial = new CANNON.Material('default');
    const sandMaterial = new CANNON.Material('sand');
    const bucketMaterial = new CANNON.Material('bucket');

    const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
            friction: 0.5,
            restitution: 0.3
        }
    );

    const sandContactMaterial = new CANNON.ContactMaterial(
        sandMaterial,
        defaultMaterial,
        {
            friction: 0.8,
            restitution: 0.1
        }
    );

    const bucketContactMaterial = new CANNON.ContactMaterial(
        bucketMaterial,
        sandMaterial,
        {
            friction: 0.9,
            restitution: 0.05
        }
    );

    world.addContactMaterial(defaultContactMaterial);
    world.addContactMaterial(sandContactMaterial);
    world.addContactMaterial(bucketContactMaterial);

    createFloorBody(defaultMaterial);
    createBucketBody(bucketMaterial);

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

function createBucketBody(material) {
    const bucketRadius = 12;
    const bucketHeight = 8;

    const bucketShape = new CANNON.Cylinder(bucketRadius, bucketRadius * 0.95, bucketHeight, 32);

    bucketPhysicsBody = new CANNON.Body({
        mass: 20,
        shape: bucketShape,
        material: material,
        linearDamping: 0.3,
        angularDamping: 0.3
    });

    bucketPhysicsBody.position.set(0, 4, 0);

    world.addBody(bucketPhysicsBody);
    return bucketPhysicsBody;
}

function createSandGrainBody(position, dimensions) {
    const size = dimensions.x;

    const shape = new CANNON.Sphere(size);

    const body = new CANNON.Body({
        mass: 0.1,
        shape: shape,
        linearDamping: 0.2,
        angularDamping: 0.2
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

function syncBucketWithBody(bucketMesh, bucketBody) {
    if (!bucketMesh || !bucketBody) return;

    bucketMesh.position.copy(bucketBody.position);
    bucketMesh.quaternion.copy(bucketBody.quaternion);
}

function stepPhysics() {
    world.step(TIME_STEP);

    physicsObjects.forEach(physObj => {
        syncMeshWithBody(physObj);
    });

    if (bucketMesh && bucketPhysicsBody) {
        syncBucketWithBody(bucketMesh, bucketPhysicsBody);
    }
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

function getBucketPhysicsBody() {
    return bucketPhysicsBody;
}

function getWorld() {
    return world;
}

function getPhysicsObjects() {
    return physicsObjects;
}

window.initPhysics = initPhysics;
window.createSandGrainBody = createSandGrainBody;
window.syncMeshWithBody = syncMeshWithBody;
window.syncBucketWithBody = syncBucketWithBody;
window.stepPhysics = stepPhysics;
window.removePhysicsBody = removePhysicsBody;
window.clearPhysics = clearPhysics;
window.getPhysicsObjectByMesh = getPhysicsObjectByMesh;
window.getBucketPhysicsBody = getBucketPhysicsBody;
window.getWorld = getWorld;
window.getPhysicsObjects = getPhysicsObjects;