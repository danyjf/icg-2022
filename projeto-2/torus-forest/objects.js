"use strict";

const objects = {
    possibleObjects: ["flower", "tree", "grass"],

    flowerObject: null,

    createFlower: function createFlower(posX, posY, posZ) {
        const petalColors = [
            0xeb4034,   // red
            0xebdf34,   // yellow
            0x3474eb,   // blue
            0xb134eb,   // purple
            0xeb347a    // pink
        ];

        let flower = this.flowerObject.clone();

        const petalMaterial = new THREE.MeshPhongMaterial({color: petalColors[helper.randomIntFromInterval(0, petalColors.length - 1)], side: THREE.DoubleSide});
        const stemMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00, side: THREE.DoubleSide});

        flower.children[0].position.z = -1.1;
        flower.children[0].rotation.x = Math.PI / 2;
        flower.children[0].scale.set(2, 1, 2);
        flower.children[0].material = petalMaterial;
        flower.children[0].castShadow = true;
        flower.children[0].receiveShadow = true;

        flower.children[1].rotation.x = Math.PI / 2;
        flower.children[1].scale.set(1.5, 0.1, 1.5);
        flower.children[1].material = stemMaterial;
        flower.children[1].castShadow = true;
        flower.children[1].receiveShadow = true;

        const seedsGeometry = new THREE.SphereGeometry(0.035, 8, 4);
        const seedsMaterial = new THREE.MeshPhongMaterial({color: 0xffff00});
        const seeds = new THREE.Mesh(seedsGeometry, seedsMaterial);
        seeds.position.set(0, 0, 0.22);
        flower.add(seeds);

        flower.position.set(posX, posY, posZ);
        flower.scale.set(0.0001, 0.0001, 0.0001);

        return {
            object3D: flower, 
            material: petalMaterial, 
            originalColor: petalMaterial.color.clone(), 
            lifeTime: helper.randomIntFromInterval(20, 40), 
            isGrowing: true, 
            isDying: false, 
            isDead: false
        };
    },

    createTree: function createTree(posX, posY, posZ) {
        // Create trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
        const trunkTexture = new THREE.TextureLoader().load("../assets/textures/bark/Bark_06_height.png");
        const trunkNormalMap = new THREE.TextureLoader().load("../assets/textures/bark/Bark_06_normal.jpg");
        const trunkMaterial = new THREE.MeshPhongMaterial({color: 0xcc6600, map: trunkTexture, normalMap: trunkNormalMap});
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

        trunk.position.set(0, 0, 1);
        trunk.rotation.x = Math.PI / 2;

        trunk.castShadow = true;
        trunk.receiveShadow = true;

        // Create leafs
        // const leavesGeometry = new THREE.ConeGeometry(0.7, 1.5, 16);
        let leavesGeometry = new THREE.SphereGeometry(0.7, 32, 16);
        const leavesTexture = new THREE.TextureLoader().load("../assets/textures/leaves/Hedge_001_Height.png");
        leavesTexture.wrapS = THREE.RepeatWrapping;
        leavesTexture.wrapT = THREE.RepeatWrapping;
        leavesTexture.repeat.set(2, 2);
        const leavesNormalMap = new THREE.TextureLoader().load("../assets/textures/leaves/Hedge_001_Normal.jpg");
        leavesNormalMap.wrapS = THREE.RepeatWrapping;
        leavesNormalMap.wrapT = THREE.RepeatWrapping;
        leavesNormalMap.repeat.set(2, 2);
        const leavesMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00, map: leavesTexture, normalMap: leavesNormalMap});

        const leaves1 = new THREE.Mesh(leavesGeometry, leavesMaterial);
        
        leaves1.rotation.x = Math.PI / 2;
        leaves1.position.set(0, 0, 1.75);
        leaves1.castShadow = true;
        leaves1.receiveShadow = true;
        
        leavesGeometry = new THREE.SphereGeometry(0.5, 32, 16);
        const leaves2 = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves2.rotation.x = Math.PI / 2;
        leaves2.position.set(0, 0.5, 1.5);
        leaves2.castShadow = true;
        leaves2.receiveShadow = true;
        
        leavesGeometry = new THREE.SphereGeometry(0.5, 32, 16);
        const leaves3 = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves3.rotation.x = Math.PI / 2;
        leaves3.position.set(0.5, 0.1, 1.7);
        leaves3.castShadow = true;
        leaves3.receiveShadow = true;
        
        let leaves = new THREE.Group();
        leaves.add(leaves1);
        leaves.add(leaves2);
        leaves.add(leaves3);

        leaves.rotation.z = helper.randomFloatFromInterval(0, 2 * Math.PI);

        let tree = new THREE.Group();
        tree.add(trunk);
        tree.add(leaves);

        tree.position.set(posX, posY, posZ);
        tree.scale.set(0.0001, 0.0001, 0.0001);

        return {
            object3D: tree, 
            material: leavesMaterial, 
            originalColor: leavesMaterial.color.clone(), 
            lifeTime: helper.randomIntFromInterval(20, 40), 
            isGrowing: true, 
            isDying: false, 
            isDead: false
        };
    },

    createGrass: function createGrass(posX, posY, posZ) {
        // Create grass
        const grassGeometry = new THREE.ConeGeometry(0.1, 0.5, 3);
        const grassMaterial = new THREE.MeshPhongMaterial({color: 0x66e37d});
        const grass1 = new THREE.Mesh(grassGeometry, grassMaterial);

        grass1.rotation.x = Math.PI / 2;

        grass1.castShadow = true;
        grass1.receiveShadow = true;
        
        const grass2 = new THREE.Mesh(grassGeometry, grassMaterial);
        
        grass2.rotation.x = Math.PI / 2;
        grass2.rotation.y = Math.PI / 3;
        grass2.scale.y = 0.7;
        grass2.position.set(0.15, 0, -0.075);

        grass2.castShadow = true;
        grass2.receiveShadow = true;

        const grass3 = new THREE.Mesh(grassGeometry, grassMaterial);
        
        grass3.rotation.x = Math.PI / 2;
        grass3.rotation.y = Math.PI / 6;
        grass3.scale.y = 1.2;
        grass3.position.set(0.05, 0.17, 0.05);

        grass3.castShadow = true;
        grass3.receiveShadow = true;

        const grass4 = new THREE.Mesh(grassGeometry, grassMaterial);
        
        grass4.rotation.x = Math.PI / 2;
        grass4.rotation.y = Math.PI / 2;
        grass4.position.set(0.2, 0.17, 0);

        grass4.castShadow = true;
        grass4.receiveShadow = true;

        var grassPatch = new THREE.Group();
        grassPatch.add(grass1);
        grassPatch.add(grass2);
        grassPatch.add(grass3);
        grassPatch.add(grass4);

        grassPatch.position.set(posX, posY, posZ);
        grassPatch.scale.set(0.0001, 0.0001, 0.0001);

        return {
            object3D: grassPatch, 
            material: grassMaterial, 
            originalColor: grassMaterial.color.clone(), 
            lifeTime: helper.randomIntFromInterval(20, 40), 
            isGrowing: true, 
            isDying: false, 
            isDead: false
        };
    },

    createRandomObject: function createRandomObject(posX, posY, posZ) {
        const i = helper.randomIntFromInterval(0, this.possibleObjects.length - 1);
        switch(this.possibleObjects[i]) {
            case "flower":
                return this.createFlower(posX, posY, posZ);
            case "tree":
                return this.createTree(posX, posY, posZ);
            case "grass":
                return this.createGrass(posX, posY, posZ);
        }
    },

    createSpotLight: function createSpotLight(color, intensity, angle, penumbra) {
        const spotLight = new THREE.SpotLight(color, intensity);

        spotLight.angle = angle;
        spotLight.penumbra = penumbra;
        spotLight.distance = 15;

        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        
        return spotLight;
    },

    createTorus: function createTorus(color, radius, tubeRadius, radialSegments, tubularSegments) {
        const torusGeometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
        const torusMaterial = new THREE.MeshPhongMaterial({color: color});
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);

        torus.receiveShadow = true;

        return torus;
    },

    createLamp: function createLamp(color, radiusTop, radiusBottom, height, radialSegments) {
        const lampGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        const lampMaterial = new THREE.MeshPhongMaterial({color: color});
        const lamp = new THREE.Mesh(lampGeometry, lampMaterial);

        return lamp;
    }
};
