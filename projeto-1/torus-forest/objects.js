﻿"use strict";

const objects = {
    createFlower: function createFlower(posX, posY, posZ, rotX, rotY, rotZ) {
        // Create stem
        const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 6);
        const stemMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00});
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    
        // Create seeds
        const seedsGeometry = new THREE.SphereGeometry(0.1, 8, 4);
        const seedsMaterial = new THREE.MeshPhongMaterial({color: 0xffff00});
        const seeds = new THREE.Mesh(seedsGeometry, seedsMaterial);
        seeds.position.set(0, 0.4, 0);
    
        // Create petals
        const petals = new THREE.Group();
        const petalGeometry = new THREE.PlaneGeometry(0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.DoubleSide});
        
        var petal = new THREE.Mesh(petalGeometry, material);
        petal.position.set(-0.25, 0, 0);
        petal.rotation.x = -Math.PI / 2;
        petals.add(petal);
    
        petal = new THREE.Mesh(petalGeometry, material);
        petal.position.set(0, 0, 0.25);
        petal.rotation.x = -Math.PI / 2;
        petals.add(petal);
    
        petal = new THREE.Mesh(petalGeometry, material);
        petal.position.set(0.25, 0, 0);
        petal.rotation.x = -Math.PI / 2;
        petals.add(petal);
    
        petal = new THREE.Mesh(petalGeometry, material);
        petal.position.set(0, 0, -0.25);
        petal.rotation.x = -Math.PI / 2;
        petals.add(petal);
        
        petals.position.set(0, 0.4, 0);
    
        // Create flower
        var flower = new THREE.Group();
        flower.add(stem);
        flower.add(seeds);
        flower.add(petals);
    
        flower.position.set(posX, posY, posZ);
        flower.rotation.x = rotX;
        flower.rotation.y = rotY;
        flower.rotation.z = rotZ;
    
        return flower;
    },

    createTree: function createTree(posX, posY, posZ, rotX, rotY, rotZ) {

    },

    createGrass: function createGrass(posX, posY, posZ, rotX, rotY, rotZ) {

    },

    createSpotLight: function createSpotLight(color, intensity, angle, penumbra) {
        const spotLight = new THREE.SpotLight(color, intensity);

        spotLight.angle = angle;
        spotLight.penumbra = penumbra;

        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        
        return spotLight;
    },

    createTorus: function createTorus(color, radius, tubeRadius, radialSegments, tubularSegments) {
        const torusGeometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
        const torusMaterial = new THREE.MeshPhongMaterial({color: color});
        const torusObject = new THREE.Mesh(torusGeometry, torusMaterial);

        return torusObject;
    },

    createLamp: function createLamp(color, radiusTop, radiusBottom, height, radialSegments) {
        const lampGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        const lampMaterial = new THREE.MeshPhongMaterial({color: color});
        const lamp = new THREE.Mesh(lampGeometry, lampMaterial);

        return lamp;
    }
};