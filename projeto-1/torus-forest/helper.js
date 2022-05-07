"use strict";

const helper = {
    initEmptyScene: function(sceneElements) {
        // Create the 3D scene
        sceneElements.sceneGraph = new THREE.Scene();

        // Add camera
        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
        sceneElements.camera = camera;
        camera.position.set(0, 40, 40);
        camera.lookAt(0, 0, 0);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 0.2);
        sceneElements.sceneGraph.add(ambientLight);

        // Create renderer (with shadow map)
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        sceneElements.renderer = renderer;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor('rgb(255, 255, 255)', 1.0);
        renderer.setSize(width, height);

        // Setup shadowMap property
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Add the rendered image in the HTML DOM
        const htmlElement = document.querySelector("#tagTorusForest");
        htmlElement.appendChild(renderer.domElement);

        // Control for the camera
        sceneElements.control = new THREE.OrbitControls(camera, renderer.domElement);
        sceneElements.control.screenSpacePanning = true;
    },

    render: function render(sceneElements) {
        sceneElements.renderer.render(sceneElements.sceneGraph, sceneElements.camera);
    },

    eventHandlers: function eventHandlers() {
        window.addEventListener('resize', resizeWindow);
        document.addEventListener('keydown', onDocumentKeyDown, false);
        document.addEventListener('keyup', onDocumentKeyUp, false);

        function resizeWindow(eventParam) {
            const width = window.innerWidth;
            const height = window.innerHeight;
        
            sceneElements.camera.aspect = width / height;
            sceneElements.camera.updateProjectionMatrix();
        
            sceneElements.renderer.setSize(width, height);
        }

        function onDocumentKeyDown(event) {
            switch (event.keyCode) {
                case 87: //w
                    keys.W = true;
                    break;
                case 65: //a
                    keys.A = true;
                    break;
                case 83: //s
                    keys.S = true;
                    break;
                case 68: //d
                    keys.D = true;
                    break;
            }
        }
        
        function onDocumentKeyUp(event) {
            switch (event.keyCode) {
                case 87: //w
                    keys.W = false;
                    break;
                case 65: //a
                    keys.A = false;
                    break;
                case 83: //s
                    keys.S = false;
                    break;
                case 68: //d
                    keys.D = false;
                    break;
            }
        }        
    }
};
