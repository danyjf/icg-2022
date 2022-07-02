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
        torusCenter.rotation.x = Math.PI / 2;
        torusCenter.rotation.y = Math.PI / 2;
        
        // Create orbit
        const torusTubeCenter = new THREE.Group();
        torusTubeCenter.name = "torusTubeCenter";
        torusTubeCenter.position.set(20, 0, 0);

        torusTubeCenter.rotation.z = Math.PI;
        
        // Create spotlight (with shadows)
        const spotLight = objects.createSpotLight(0xffffff, 0.8, Math.PI / 6, 0.5);
        spotLight.target = torusTubeCenter;

        // Create lamp object
        const lamp = objects.createLamp(0xffff00, 0.2, 0.6, 0.4, 32);
        lamp.position.set(0, 15, 0);
        lamp.name = "lamp";

        // Test normal maps
        const light = new THREE.PointLight(0xffffff, 1, 2);
        light.position.set(0, 9, 20);
        light.name = "light";
        sceneGraph.add(light);
        const geometry = new THREE.SphereGeometry(0.03, 8, 4);
        const material = new THREE.MeshBasicMaterial({color: 0xffff00});
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(light.position.x, light.position.y, light.position.z);
        sphere.name = "lightObject";
        sceneGraph.add(sphere);

        // Test add ruins
        const stone = objects.createStone01(0, 7, 20);
        stone.name = "stone";
        sceneGraph.add(stone);

        // Add objects to the scene
        sceneGraph.add(torus);
        torus.add(torusCenter);
        torusCenter.add(torusTubeCenter);
        torusTubeCenter.add(lamp);
        lamp.add(spotLight);

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
        const stone = sceneElements.sceneGraph.getObjectByName("stone");
        const deltaTime = sceneElements.clock.getDelta();

        // Test normal maps
        const light = sceneElements.sceneGraph.getObjectByName("light");
        light.position.x = Math.sin(time/1000) * 5;
        const lightObject = sceneElements.sceneGraph.getObjectByName("lightObject");
        lightObject.position.set(light.position.x, light.position.y, light.position.z);

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
                changeColor(sceneObjects[i], new THREE.Color(0.87, 0.47, 0.28));
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
                    changeColor(sceneObjects[i], new THREE.Color(0.87, 0.47, 0.28));
                }
            }
        }

        // Rendering
        helper.render(sceneElements);
        // Update control of the camera
        // sceneElements.control.update(deltaTime);
        // Call for the next frame
        requestAnimationFrame(update);

        function controls(torusCenter, torusTubeCenter) {
            // To control the lamp WASD is used to alter the rotation of
            // the center of the torus and of the center of the torus tube,
            // to ensure the values of rotation don't grow infinitely big 
            // or small it's calculated the remainder of 2*PI so that the 
            // values are always between 0 and 2*PI

            let cameraSpeed = 0.1;
            let lampSpeed = 0.02;

            if(keys.SHIFT) {
                cameraSpeed *= 4;
            }

            if(keys.W) {
                sceneElements.control.moveForward(cameraSpeed);
            }
            if(keys.A) {
                sceneElements.control.moveRight(-cameraSpeed);
            }
            if(keys.S) {
                sceneElements.control.moveForward(-cameraSpeed);
            }
            if(keys.D) {
                sceneElements.control.moveRight(cameraSpeed);
            }
            if(keys.UP) {
                torusTubeCenter.rotation.z = (torusTubeCenter.rotation.z - lampSpeed) % (2 * Math.PI);
            }
            if(keys.LEFT) {
                torusCenter.rotation.y = (torusCenter.rotation.y + lampSpeed) % (2 * Math.PI);
            }
            if(keys.DOWN) {
                torusTubeCenter.rotation.z = (torusTubeCenter.rotation.z + lampSpeed) % (2 * Math.PI);
            }
            if(keys.RIGHT) {
                torusCenter.rotation.y = (torusCenter.rotation.y - lampSpeed) % (2 * Math.PI);
            }
        }

        function spawnObject() {
            /**
             *  To spawn an object the steps are:
             *  1) Find a random direction from the lamp towards the torus
             *  2) Cast a ray from the lamp with the direction found
             *  3) Create a random object at the position hit by the raycast
             *  4) Add the object to the list of objects on scene
             *  5) Make the object perpendicular to the face hit
             */

            let direction = helper.getRandomDirection();
            direction.transformDirection(lamp.matrixWorld);
            
            const instanceInfo = helper.raycast(lampWorldPosition, direction, [torus, stone]);
            if(instanceInfo) {
                const point = instanceInfo.point;
                const normal = instanceInfo.normal;

                const object = objects.createRandomObject(point.x, point.y, point.z);
                sceneObjects.push(object);
                sceneElements.sceneGraph.add(object.object3D);
                object.object3D.lookAt(normal);
            }
        }

        // Linearly increase the scale of the object
        function grow(object) {
            object.scale.x += 0.005;
            object.scale.y += 0.005;
            object.scale.z += 0.005;
        }

        // Linearly decrease the scale of the object
        function die(object) {
            object.scale.x -= 0.005;
            object.scale.y -= 0.005;
            object.scale.z -= 0.005;
        }

        // Change the color of the object to the target color over time
        function changeColor(object, targetColor) {
            /** 
             *  To change the color of the object the steps are:
             *  1) Lerp from the material color to the target color
             *  2) Check if the color is equal to the target color
             *  3) If they are equal classify the object as dead
             */  

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
