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

// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {
    // Create torus
    const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({color: 0xffff00});
    const torusObject = new THREE.Mesh(torusGeometry, torusMaterial);
    torusObject.rotation.x = Math.PI / 2;
    sceneGraph.add(torusObject);

    const torusWireframeMaterial = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true});
    const torusWireframeObject = new THREE.Mesh(torusGeometry, torusWireframeMaterial);
    torusWireframeObject.rotation.x = torusObject.rotation.x;
    sceneGraph.add(torusWireframeObject);
}

function computeFrame(time) {
    // Rendering
    helper.render(sceneElements);

    // Update control of the camera
    sceneElements.control.update();

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}
