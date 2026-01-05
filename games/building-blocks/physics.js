let world;
let physicsObjects = [];
const TIME_STEP = 1 / 60;
let defaultBlockMaterial;

function initPhysics() {
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    
    const blockMaterial = new CANNON.Material('block');
    const floorMaterial = new CANNON.Material('floor');
    
    const blockContact = new CANNON.ContactMaterial(
        blockMaterial, blockMaterial,
        { friction: 0.8, restitution: 0.1 }
    );
    
    const floorContact = new CANNON.ContactMaterial(
        blockMaterial, floorMaterial,
        { friction: 0.9, restitution: 0.1 }
    );
    
    world.addContactMaterial(blockContact);
    world.addContactMaterial(floorContact);
    
    createFloorBody(floorMaterial);
    
    defaultBlockMaterial = blockMaterial;
    
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
            shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
            break;
        case 'tall':
            shape = new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5));
            break;
        case 'flat':
            shape = new CANNON.Box(new CANNON.Vec3(1, 0.25, 1));
            break;
        case 'cylinder':
            shape = new CANNON.Cylinder(0.5, 0.5, 1, 32);
            break;
        case 'sphere':
            shape = new CANNON.Sphere(0.5);
            break;
        case 'L':
            shape = new CANNON.Box(new CANNON.Vec3(0.75, 0.5, 0.75));
            break;
        case 'T':
            shape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 0.5));
            break;
        case 'ramp':
            shape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 0.5));
            break;
        case 'pyramid':
            shape = new CANNON.Box(new CANNON.Vec3(0.35, 0.5, 0.35));
            break;
        case 'stairs':
            shape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 1));
            break;
        default:
            shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    }
    
    const body = new CANNON.Body({
        mass: 1,
        shape: shape,
        material: defaultBlockMaterial,
        linearDamping: 0.3,
        angularDamping: 0.3
    });
    
    body.position.set(position.x, position.y, position.z);
    world.addBody(body);
    
    const physicsObject = {
        body: body,
        mesh: null,
        type: type,
        dimensions: dimensions
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
window.stepPhysics = stepPhysics;
window.removePhysicsBody = removePhysicsBody;
window.clearPhysics = clearPhysics;
window.getPhysicsObjectByMesh = getPhysicsObjectByMesh;
window.getWorld = getWorld;
window.getPhysicsObjects = getPhysicsObjects;