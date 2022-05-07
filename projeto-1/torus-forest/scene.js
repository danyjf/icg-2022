"use strict";

const scene = {
    // Function called once at the start
    start: function start(sceneGraph) {
        // Create spotlight (with shadows)
        const spotLight = objects.createSpotLight('rgb(255, 255, 255)', 0.8, Math.PI / 6, 0.5);
        
        // Create torus
        const torus = objects.createTorus(0xbbff00, 20, 8, 32, 100);
        torus.rotation.x = Math.PI / 2;
        torus.name = "torus";
        
        // Torus center
        const torusCenter = new THREE.Group();
        torusCenter.name = "torusCenter";
        
        // Create orbit
        const torusTubeCenter = new THREE.Group();
        torusTubeCenter.name = "torusTubeCenter";
        torusTubeCenter.position.set(20, 0, 0);
        
        // Create lamp object
        const lamp = objects.createLamp(0xffff00, 0.2, 0.6, 0.4, 32);
        lamp.position.set(0, 15, 0);
        lamp.name = "lamp";
        
        spotLight.target = torusTubeCenter;
        
        // Create flower
        const flower = objects.createFlower(0, 0, 0, 0, 0, 0);
        
        sceneGraph.add(spotLight);
        sceneGraph.add(torus);
        sceneGraph.add(torusCenter);
        torusCenter.add(torusTubeCenter);
        lamp.add(spotLight);
        torusTubeCenter.add(lamp);
        sceneGraph.add(flower);
    },

    // Function called every frame
    update: function update(time) {
        const torusCenter = sceneElements.sceneGraph.getObjectByName("torusCenter");
        const torusTubeCenter = sceneElements.sceneGraph.getObjectByName("torusTubeCenter");
        const lamp = sceneElements.sceneGraph.getObjectByName("lamp");
        const lampPosition = new THREE.Vector3();
        const torus = sceneElements.sceneGraph.getObjectByName("torus");
        
        lamp.getWorldPosition(lampPosition);
        const raycaster = new THREE.Raycaster(lampPosition, new THREE.Vector3(0, -1, 0), 0, 15);
        const intersects = raycaster.intersectObject(torus);
    
        // Using the remainder of 2PI makes it so the rotation value doesn't get infinitely big or small
        if(keys.A) {
            torusCenter.rotation.y = (torusCenter.rotation.y - 0.02) % (2 * Math.PI);
        }
        if(keys.D) {
            torusCenter.rotation.y = (torusCenter.rotation.y + 0.02) % (2 * Math.PI);
        }
        if(keys.W) {
            torusTubeCenter.rotation.z = (torusTubeCenter.rotation.z - 0.02) % (2 * Math.PI);
        }
        if(keys.S) {
            torusTubeCenter.rotation.z = (torusTubeCenter.rotation.z + 0.02) % (2 * Math.PI);
        }
    
        // Rendering
        helper.render(sceneElements);
    
        // Update control of the camera
        sceneElements.control.update();
    
        // Call for the next frame
        requestAnimationFrame(update);
    }
};
