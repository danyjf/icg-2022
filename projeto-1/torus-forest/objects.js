﻿"use strict";

const objects = {
    possibleObjects: ["flower", "tree", "grass"],

    createFlower: function createFlower(posX, posY, posZ) {
        // Create stem
        const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 6);
        const stemMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00});
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.rotation.x = Math.PI / 2;

        stem.castShadow = true;
        stem.receiveShadow = true;
        
        // Create seeds
        const seedsGeometry = new THREE.SphereGeometry(0.1, 8, 4);
        const seedsMaterial = new THREE.MeshPhongMaterial({color: 0xffff00});
        const seeds = new THREE.Mesh(seedsGeometry, seedsMaterial);
        seeds.position.set(0, 0, 0.4);
    
        // Create petals
        const petalColors = [
            0xeb4034,   // red
            0xeb7d34,   // orange
            0xebdf34,   // yellow
            0x3474eb,   // blue
            0xb134eb,   // purple
            0xeb347a    // pink
        ];
        const petals = new THREE.Group();
        const petalGeometry = new THREE.PlaneGeometry(0.5, 0.5);
        const petalMaterial = new THREE.MeshBasicMaterial(
            {color: petalColors[helper.randomIntFromInterval(0, petalColors.length - 1)], side: THREE.DoubleSide}
        );
        
        var petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.position.set(-0.25, -0.4, 0.4);
        petals.add(petal);

        petal.castShadow = true;
        petal.receiveShadow = true;
    
        petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.position.set(0, -0.2, 0.4);
        petals.add(petal);

        petal.castShadow = true;
        petal.receiveShadow = true;
    
        petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.position.set(0.25, -0.4, 0.4);
        petals.add(petal);

        petal.castShadow = true;
        petal.receiveShadow = true;
    
        petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.position.set(0, -0.6, 0.4);
        petals.add(petal);

        petal.castShadow = true;
        petal.receiveShadow = true;
        
        petals.position.set(0, 0.4, 0);
    
        // Create flower
        var flower = new THREE.Group();
        flower.add(stem);
        flower.add(seeds);
        flower.add(petals);
    
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
        const trunkMaterial = new THREE.MeshPhongMaterial({color: 0x9c4b1c});
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        
        trunk.position.set(0, 0, 1);
        trunk.rotation.x = Math.PI / 2;

        trunk.castShadow = true;
        trunk.receiveShadow = true;

        // Create leafs
        const leafsGeometry = new THREE.ConeGeometry(0.7, 1.5, 32);
        const leafsMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00});
        const leafs = new THREE.Mesh(leafsGeometry, leafsMaterial);
        
        leafs.rotation.x = Math.PI / 2;
        leafs.position.set(0, 0, 2);

        leafs.castShadow = true;
        leafs.receiveShadow = true;

        var tree = new THREE.Group();
        tree.add(trunk);
        tree.add(leafs);

        tree.position.set(posX, posY, posZ);
        tree.scale.set(0.0001, 0.0001, 0.0001);

        return {
            object3D: tree, 
            material: leafsMaterial, 
            originalColor: leafsMaterial.color.clone(), 
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
