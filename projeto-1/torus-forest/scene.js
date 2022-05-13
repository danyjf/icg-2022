"use strict";

function raycast(origin, direction, near, far, mesh) {
    const raycaster = new THREE.Raycaster(origin, direction, near, far);
    const intersects = raycaster.intersectObject(mesh)[0];

    if(intersects) {
        let point = intersects.point;
        // flower.position.copy(point);

        let normal = intersects.face.normal.clone();
        normal.transformDirection(mesh.matrixWorld);
        normal.add(point);

        // flower.lookAt(normal);

        return {point: point, normal: normal};
    }

    return null;
}

let canCastRays = true;
let allInstancesInfo = [];
const count = 20;

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
        flower.name = "flower";

        const test = objects.createFlower(0, 0, 0, 0, 0, 0);
        test.name = "test";

        // Add objects to the scene
        sceneGraph.add(spotLight);
        sceneGraph.add(torus);
        sceneGraph.add(torusCenter);
        torusCenter.add(torusTubeCenter);
        lamp.add(spotLight);
        torusTubeCenter.add(lamp);
        sceneGraph.add(flower);
        sceneGraph.add(test);

        helper.render(sceneElements);
    },

    // Function called every frame
    update: function update(time) {
        const torusCenter = sceneElements.sceneGraph.getObjectByName("torusCenter");
        const torusTubeCenter = sceneElements.sceneGraph.getObjectByName("torusTubeCenter");
        const torusTubeCenterPosition = new THREE.Vector3();
        torusTubeCenter.getWorldPosition(torusTubeCenterPosition);
        const lamp = sceneElements.sceneGraph.getObjectByName("lamp");
        const lampPosition = new THREE.Vector3();
        lamp.getWorldPosition(lampPosition);
        const torus = sceneElements.sceneGraph.getObjectByName("torus");
        const flower = sceneElements.sceneGraph.getObjectByName("flower");
        const test = sceneElements.sceneGraph.getObjectByName("test");

        if(canCastRays) {
            for(let i = 0; i < count; i++) {
                let direction = getRandomDirection();
                direction.transformDirection(lamp.matrixWorld);

                const instanceInfo = raycast(lampPosition, direction, 0, 9, torus);
                if(instanceInfo) {
                    allInstancesInfo.push(instanceInfo);
                }
            }

            for(let i = 0; i < allInstancesInfo.length; i++) {
                const point = allInstancesInfo[i].point;
                const normal = allInstancesInfo[i].normal;

                const object = objects.createFlower(point.x, point.y, point.z, 0, 0, 0);
                sceneElements.sceneGraph.add(object);
                object.lookAt(normal);
            }

            console.log(allInstancesInfo);

            canCastRays = false;
        }

        controls(torusCenter, torusTubeCenter);

        // Rendering
        helper.render(sceneElements);
    
        // Update control of the camera
        sceneElements.control.update();
    
        // Call for the next frame
        requestAnimationFrame(update);

        function randomFromInterval(min, max) {
            return Math.random() * (max - min) + min;
        }

        function isInsideCircle(r, x, z) {
            return x * x + z * z < r * r ? true : false;
        }

        function getRandomDirection() {
                const r = 0.5;
                let x = randomFromInterval(-0.5, 0.5);
                let z = randomFromInterval(-0.5, 0.5);

                while(!isInsideCircle(r, x, z)) {
                    x = randomFromInterval(-0.5, 0.5);
                    z = randomFromInterval(-0.5, 0.5);
                }

                let direction = new THREE.Vector3(x, -1, z)

                return direction.normalize();
        }

        function controls(torusCenter, torusTubeCenter) {
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
        }
    }
};
