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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.325);
        sceneElements.sceneGraph.add(ambientLight);

        // Create renderer (with shadow map)
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        sceneElements.renderer = renderer;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0xe39469, 1.0);
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

        // Add raycaster
        sceneElements.raycaster = new THREE.Raycaster();
        sceneElements.raycaster.far = 9;

        // Add clock
        sceneElements.clock = new THREE.Clock();
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
    },

    // Random float from min (including) to max (excluding)
    randomFloatFromInterval: function randomFloatFromInterval(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Random int from min (including) to max (including)
    randomIntFromInterval: function randomIntFromInterval(min, max) {
        min = Math.ceil(min);
        max = Math.ceil(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    equalColors: function equalColors(color1, color2, threshold) {
        if(
            Math.abs(color1.r - color2.r) < threshold 
            && Math.abs(color1.g - color2.g) < threshold
            && Math.abs(color1.b - color2.b) < threshold
        ) {
            return true;
        }
        
        return false;
    },

    raycast: function raycast(origin, direction, mesh) {
        sceneElements.raycaster.set(origin, direction);
        const intersects = sceneElements.raycaster.intersectObject(mesh)[0];
    
        if(intersects) {
            let normal = intersects.face.normal.clone();
            normal.transformDirection(mesh.matrixWorld);
            normal.add(intersects.point);
    
            return {point: intersects.point, normal: normal};
        }
    
        return null;
    },

    // Get random direction for the raycasts from the lamp
    getRandomDirection: function getRandomDirection() {
        // To get a random direction for the raycast we imagine a circle 
        // that is under the lamp and pick a random point inside that
        // circle to point towards it, so the steps are:
        // 1) Define a random angle inside the circle [0, 2*PI[
        // 2) Choose a random distance from the center of the circle [0, radius[
        // 3) Get the cartesian coordinates from the obtained polar coordinates
        // 4) Create and return the direction from the ligth to the point inside the circle

        const angle = this.randomFloatFromInterval(0, 2*Math.PI);
        const r = this.randomFloatFromInterval(0, 0.6);

        const x = r * Math.cos(angle);
        const z = r * Math.sin(angle);

        let direction = new THREE.Vector3(x, -1, z)

        return direction.normalize();
    },

    // Check if point is inside a circle
    isInsideCircle: function isInsideCircle(r, x, z) {
        return x * x + z * z < r * r ? true : false;
    },

    isUnderLight: function isUnderLight(object, lightSource) {
        let objectPos = object.position.clone();
        lightSource.worldToLocal(objectPos);

        if(objectPos.length() > 10) {
            return false;
        }

        let direction = objectPos.normalize();

        /** 
         * Plane equation:
         * x = x
         * y = -1
         * z = z
         * 
         * Line equation:
         * x = ta
         * y = tb
         * z = tc
         * 
         * x = ta
         * -1 = tb
         * z = tc
         * 
         * x = ta
         * t = -1/b
         * z = tc
        */

        const t = -1 / direction.y;
        const x = t * direction.x;
        const z = t * direction.z;

        return this.isInsideCircle(0.6, x, z);
    }
};
