"use strict";

const SPAWN_TIME = 0.25;
const MAX_OBJECTS = 1000;

let sceneObjects = [];
let spawnTimer = 0;

const scene = {
    // Function called once at the start
    start: function start(sceneGraph) {
        // Create torus
        const torus = objects.createTorus(0xc1ff80, 20, 8, 32, 100);
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
        const lamp = sceneElements.sceneGraph.getObjectByName("lamp");
        const lampWorldPosition = new THREE.Vector3();
        lamp.getWorldPosition(lampWorldPosition);
        const torus = sceneElements.sceneGraph.getObjectByName("torus");
        const deltaTime = sceneElements.clock.getDelta();

        controls(torusCenter, torusTubeCenter);
        
        spawnTimer += deltaTime;

        if(spawnTimer > SPAWN_TIME && sceneObjects.length < MAX_OBJECTS) {
            spawnObject();
            
            spawnTimer = 0;
        }

        for(let i = 0; i < sceneObjects.length; i++) {
            sceneObjects[i].lifeTime -= deltaTime;

            const underLight = helper.isUnderLight(sceneObjects[i].object3D, lamp);

            if(sceneObjects[i].object3D.scale.x > 1) {
                sceneObjects[i].isGrowing = false;
                sceneObjects[i].isDying = false;
                sceneObjects[i].isDead = false;

                sceneObjects[i].object3D.scale.set(1, 1, 1);
            }

            if(sceneObjects[i].lifeTime < 0) {
                changeColor(sceneObjects[i]);
            }

            if(sceneObjects[i].isDead) {
                die(sceneObjects[i].object3D);
                
                if(sceneObjects[i].object3D.scale.x < 0) {
                    sceneElements.sceneGraph.remove(sceneObjects[i].object3D);
                    sceneObjects.splice(i, 1);
                }
            }

            if(underLight) {
                if(sceneObjects[i].isGrowing) {
                    grow(sceneObjects[i].object3D);
                }

                if(sceneObjects[i].isDying) {
                    sceneObjects[i].material.color.lerp(sceneObjects[i].originalColor, 0.05);

                    if(helper.equalColors(sceneObjects[i].material.color, sceneObjects[i].originalColor, 0.05)) {
                        sceneObjects[i].material.color.set(sceneObjects[i].originalColor);

                        sceneObjects[i].isGrowing = true;
                        sceneObjects[i].isDying = false;
                        sceneObjects[i].isDead = false;
                    }
                }
            } else {
                sceneObjects[i].isGrowing = false;
                sceneObjects[i].isDying = true;
                sceneObjects[i].isDead = false;

                if(sceneObjects[i].isDying) {
                    changeColor(sceneObjects[i]);
                }
            }
        }

        // Rendering
        helper.render(sceneElements);
        // Update control of the camera
        sceneElements.control.update();
        // Call for the next frame
        requestAnimationFrame(update);

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

        function spawnObject() {
            let direction = helper.getRandomDirection();
            direction.transformDirection(lamp.matrixWorld);
            
            const instanceInfo = helper.raycast(lampWorldPosition, direction, torus);
            if(instanceInfo) {
                const point = instanceInfo.point;
                const normal = instanceInfo.normal;

                const object = objects.createRandomObject(point.x, point.y, point.z);
                sceneObjects.push(object);
                sceneElements.sceneGraph.add(object.object3D);
                object.object3D.lookAt(normal);
            }
        }

        function grow(object) {
            object.scale.x += 0.005;
            object.scale.y += 0.005;
            object.scale.z += 0.005;
        }

        function die(object) {
            object.scale.x -= 0.005;
            object.scale.y -= 0.005;
            object.scale.z -= 0.005;
        }

        function changeColor(object) {
            const targetColor = new THREE.Color(0.87, 0.47, 0.28);
            object.material.color.lerp(targetColor, 0.02);

            if(helper.equalColors(object.material.color, targetColor, 0.05)) {
                object.material.color.set(targetColor);

                object.isGrowing = false;
                object.isDying = false;
                object.isDead = true;
            }
        }
    }
};
