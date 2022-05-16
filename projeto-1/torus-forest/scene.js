"use strict";

let allInstancesInfo = [];
const count = 1;
let sceneObjects = [];
const raycaster = new THREE.Raycaster();
raycaster.far = 9;
let spawnTimer = 0;
let clock = new THREE.Clock();

const scene = {
    // Function called once at the start
    start: function start(sceneGraph) {
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
        
        // Create spotlight (with shadows)
        const spotLight = objects.createSpotLight(0xffffff, 0.8, Math.PI / 6, 0.5);
        spotLight.target = torusTubeCenter;

        // Create lamp object
        const lamp = objects.createLamp(0xffff00, 0.2, 0.6, 0.4, 32);
        lamp.position.set(0, 15, 0);
        lamp.name = "lamp";

        // Add objects to the scene
        // sceneGraph.add(spotLight);
        sceneGraph.add(torus);
        sceneGraph.add(torusCenter);
        torusCenter.add(torusTubeCenter);
        lamp.add(spotLight);
        torusTubeCenter.add(lamp);

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

        controls(torusCenter, torusTubeCenter);
        
        spawnTimer += clock.getDelta();

        if(spawnTimer > 1) {
            for(let i = 0; i < count; i++) {
                let direction = getRandomDirection();
                direction.transformDirection(lamp.matrixWorld);

                const instanceInfo = raycast(lampPosition, direction, torus);
                if(instanceInfo) {
                    allInstancesInfo.push(instanceInfo);
                }
            }

            for(let i = 0; i < allInstancesInfo.length; i++) {
                const point = allInstancesInfo[i].point;
                const normal = allInstancesInfo[i].normal;

                const object = objects.createRandomObject(point.x, point.y, point.z);
                sceneObjects.push(object);
                sceneElements.sceneGraph.add(object);
                object.lookAt(normal);
            }

            allInstancesInfo = [];
            spawnTimer = 0;
        }

        for(let i = 0; i < sceneObjects.length; i++) {
            if(isUnderLight(sceneObjects[i], lamp)) {
                if(sceneObjects[i].scale.x < 1) {
                    sceneObjects[i].scale.x += 0.005;
                    sceneObjects[i].scale.y += 0.005;
                    sceneObjects[i].scale.z += 0.005;
                }
            } else {
                sceneObjects[i].scale.x -= 0.005;
                sceneObjects[i].scale.y -= 0.005;
                sceneObjects[i].scale.z -= 0.005;
                
                if(sceneObjects[i].scale.x < 0) {
                    sceneElements.sceneGraph.remove(sceneObjects[i]);
                    sceneObjects.splice(i, 1);
                }
            }
        }

        // Rendering
        helper.render(sceneElements);
        // Update control of the camera
        sceneElements.control.update();
        // Call for the next frame
        requestAnimationFrame(update);

        function isUnderLight(object, lightSource) {
            let objectPos = object.position.clone();
            lightSource.worldToLocal(objectPos);

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

            return isInsideCircle(0.5, x, z);
        }

        // Check if point is inside a circle
        function isInsideCircle(r, x, z) {
            return x * x + z * z < r * r ? true : false;
        }

        // TODO: Change this to use polar coordinates
        // Get random direction for the raycasts from the lamp
        function getRandomDirection() {
            // To get a random direction for the raycast we imagine a circle 
            // that is under the lamp and pick a random point inside that
            // circle to point towards it, so the steps are:
            // 1) Define the radius of the circle
            // 2) Pick random coordinates inside the circle
            // 3) Check if the coordinates are inside the circle
            // 4) When coordinates are found create and return a direction

            const r = 0.5;
            let x = helper.randomFloatFromInterval(-r, r);
            let z = helper.randomFloatFromInterval(-r, r);

            while(!isInsideCircle(r, x, z)) {
                x = helper.randomFloatFromInterval(-r, r);
                z = helper.randomFloatFromInterval(-r, r);
            }

            let direction = new THREE.Vector3(x, -1, z)

            return direction.normalize();
        }

        function raycast(origin, direction, mesh) {
            raycaster.set(origin, direction);
            const intersects = raycaster.intersectObject(mesh)[0];
        
            if(intersects) {
                let normal = intersects.face.normal.clone();
                normal.transformDirection(mesh.matrixWorld);
                normal.add(intersects.point);
        
                return {point: intersects.point, normal: normal};
            }
        
            return null;
        }

        function controls(torusCenter, torusTubeCenter) {
            // To control the lamp WASD is used to alter the rotation of
            // the center of the torus and of the center of the torus tube,
            // to ensure the values of rotation don't grow infinitely big 
            // or small it's calculated the remainder of 2*PI so that the 
            // values are always between 0 and 2*PI

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
