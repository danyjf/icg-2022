"use strict";

// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null,
    renderer: null,
    raycaster: null,
    clock: null
};

helper.initEmptyScene(sceneElements);
helper.eventHandlers();
scene.start(sceneElements.sceneGraph);
requestAnimationFrame(scene.update);
