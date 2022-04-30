"use strict";

// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null,
    renderer: null,
};

// Functions are called
//  1. Initialize the empty scene
//  2. Add elements within the scene
//  3. Render the scene
helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);

// HANDLING EVENTS
// Event Listeners
window.addEventListener('resize', resizeWindow);

//To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false;
document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

// Update render image size and camera aspect when the window is resized
function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = true;
            break;
        case 83: //s
            keyS = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 87: //w
            keyW = true;
            break;
    }
}
function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;
    }
}

function createFlower(posX, posY, posZ, rotX, rotY, rotZ) {
    // Create stem
    const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 6);
    const stemMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00});
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);

    // Create seeds
    const seedsGeometry = new THREE.SphereGeometry(0.1, 8, 4);
    const seedsMaterial = new THREE.MeshPhongMaterial({color: 0xffff00});
    const seeds = new THREE.Mesh(seedsGeometry, seedsMaterial);
    seeds.position.set(0, 0.4, 0);

    // Create petals
    const petals = new THREE.Group();
    const petalGeometry = new THREE.PlaneGeometry(0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.DoubleSide});
    
    var petal = new THREE.Mesh(petalGeometry, material);
    petal.position.set(-0.25, 0, 0);
    petal.rotation.x = -Math.PI / 2;
    petals.add(petal);

    petal = new THREE.Mesh(petalGeometry, material);
    petal.position.set(0, 0, 0.25);
    petal.rotation.x = -Math.PI / 2;
    petals.add(petal);

    petal = new THREE.Mesh(petalGeometry, material);
    petal.position.set(0.25, 0, 0);
    petal.rotation.x = -Math.PI / 2;
    petals.add(petal);

    petal = new THREE.Mesh(petalGeometry, material);
    petal.position.set(0, 0, -0.25);
    petal.rotation.x = -Math.PI / 2;
    petals.add(petal);
    
    petals.position.set(0, 0.4, 0);

    // Create flower
    var flower = new THREE.Group();
    flower.add(stem);
    flower.add(seeds);
    flower.add(petals);

    flower.position.set(posX, posY, posZ);
    flower.rotation.x = rotX;
    flower.rotation.y = rotY;
    flower.rotation.z = rotZ;

    return flower;
}

function createGrass(posX, posY, posZ, rotX, rotY, rotZ) {

}

function createTree(posX, posY, posZ, rotX, rotY, rotZ) {

}

// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {
    // Create torus
    const torusGeometry = new THREE.TorusGeometry(20, 8, 32, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({color: 0xbbff00});
    const torusObject = new THREE.Mesh(torusGeometry, torusMaterial);
    torusObject.rotation.x = Math.PI / 2;
    sceneGraph.add(torusObject);

    // Create torus wireframe
    const torusWireframeMaterial = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true});
    const torusWireframeObject = new THREE.Mesh(torusGeometry, torusWireframeMaterial);
    torusWireframeObject.rotation.x = torusObject.rotation.x;
    sceneGraph.add(torusWireframeObject);

    // Torus center
    const torusCenter = new THREE.Group();
    sceneGraph.add(torusCenter);

    // Create orbit
    const orbit = new THREE.Group();
    torusCenter.add(orbit);
    orbit.position.set(20, 0, 0);

    // Create spotlight object
    const light = sceneGraph.getObjectByName("light");
    const spotlightGeometry = new THREE.CylinderGeometry(0.2, 0.6, 0.4, 32);
    const spotlightMaterial = new THREE.MeshPhongMaterial({color: 0xffff00});
    const spotlight = new THREE.Mesh(spotlightGeometry, spotlightMaterial);
    spotlight.position.set(0, 15, 0);
    light.target = orbit;
    spotlight.add(light)
    orbit.add(spotlight);

    // Create flower
    sceneGraph.add(createFlower(0, 0, 0, 0, 0, 0));

    torusCenter.rotation.y = Math.PI;
}

function computeFrame(time) {
    // Rendering
    helper.render(sceneElements);

    // Update control of the camera
    sceneElements.control.update();

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}
