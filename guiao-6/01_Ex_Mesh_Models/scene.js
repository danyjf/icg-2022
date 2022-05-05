"use strict";

//  Adapted from Daniel Rohmer tutorial
//
// 		https://imagecomputing.net/damien.rohmer/teaching/2019_2020/semester_1/MPRI_2-39/practice/threejs/content/000_threejs_tutorial/index.html
//
// 		J. Madeira - April 2021


// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    renderer: null,
};


// Functions are called
//  1. Initialize the empty scene
//  2. Add elements within the scene
//  3. Animate
helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);


//////////////////////////////////////////////////////////////////

// NEW - MESH MODELING - Creating geometries
//
// Adapted from threejsfundamentals.org

function createCubeMesh_V1() {

    // Repeated Vertices --- No indices !!
    // 6 vertices per cube face
    // 2 triangles per cube face

    // For each vertex: coordinates and normal vector

    const vertices = [
        // front
        { pos: [-1, -1, 1], norm: [0, 0, 1] },
        { pos: [1, -1, 1], norm: [0, 0, 1] },
        { pos: [-1, 1, 1], norm: [0, 0, 1] },

        { pos: [-1, 1, 1], norm: [0, 0, 1] },
        { pos: [1, -1, 1], norm: [0, 0, 1] },
        { pos: [1, 1, 1], norm: [0, 0, 1] },
        // right
        { pos: [1, -1, 1], norm: [1, 0, 0] },
        { pos: [1, -1, -1], norm: [1, 0, 0] },
        { pos: [1, 1, 1], norm: [1, 0, 0] },

        { pos: [1, 1, 1], norm: [1, 0, 0] },
        { pos: [1, -1, -1], norm: [1, 0, 0] },
        { pos: [1, 1, -1], norm: [1, 0, 0] },
        // back
        { pos: [1, -1, -1], norm: [0, 0, -1] },
        { pos: [-1, -1, -1], norm: [0, 0, -1] },
        { pos: [1, 1, -1], norm: [0, 0, -1] },

        { pos: [1, 1, -1], norm: [0, 0, -1] },
        { pos: [-1, -1, -1], norm: [0, 0, -1] },
        { pos: [-1, 1, -1], norm: [0, 0, -1] },
        // left
        { pos: [-1, -1, -1], norm: [-1, 0, 0] },
        { pos: [-1, -1, 1], norm: [-1, 0, 0] },
        { pos: [-1, 1, -1], norm: [-1, 0, 0] },

        { pos: [-1, 1, -1], norm: [-1, 0, 0] },
        { pos: [-1, -1, 1], norm: [-1, 0, 0] },
        { pos: [-1, 1, 1], norm: [-1, 0, 0] },
        // top
        { pos: [1, 1, -1], norm: [0, 1, 0] },
        { pos: [-1, 1, -1], norm: [0, 1, 0] },
        { pos: [1, 1, 1], norm: [0, 1, 0] },

        { pos: [1, 1, 1], norm: [0, 1, 0] },
        { pos: [-1, 1, -1], norm: [0, 1, 0] },
        { pos: [-1, 1, 1], norm: [0, 1, 0] },
        // bottom
        { pos: [1, -1, 1], norm: [0, -1, 0] },
        { pos: [-1, -1, 1], norm: [0, -1, 0] },
        { pos: [1, -1, -1], norm: [0, -1, 0] },

        { pos: [1, -1, -1], norm: [0, -1, 0] },
        { pos: [-1, -1, 1], norm: [0, -1, 0] },
        { pos: [-1, -1, -1], norm: [0, -1, 0] },
    ];

    const positions = [];
    const normals = [];

    for (const vertex of vertices) {
        positions.push(...vertex.pos);
        normals.push(...vertex.norm);
    }

    // BufferGeometry
    const geometry = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));

    const material = new THREE.MeshPhongMaterial({ color: 'rgb(200, 0, 200)', shininess: 100 });

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function createCubeMesh_V2() {

    // Less Repeated Vertices --- With indices !!
    // 4 vertices per cube face
    // 2 triangles per cube face

    // For each vertex: coordinates and normal vector

    const vertices = [
        // front
        { pos: [-1, -1, 1], norm: [0, 0, 1] },
        { pos: [1, -1, 1], norm: [0, 0, 1] },
        { pos: [-1, 1, 1], norm: [0, 0, 1] },
        { pos: [1, 1, 1], norm: [0, 0, 1] },

        // right
        { pos: [1, -1, 1], norm: [1, 0, 0] },
        { pos: [1, -1, -1], norm: [1, 0, 0] },
        { pos: [1, 1, -1], norm: [1, 0, 0] },
        { pos: [1, 1, 1], norm: [1, 0, 0] },

        // back
        { pos: [1, -1, -1], norm: [0, 0, -1] },
        { pos: [-1, -1, -1], norm: [0, 0, -1] },
        { pos: [1, 1, -1], norm: [0, 0, -1] },
        { pos: [-1, 1, -1], norm: [0, 0, -1] },

        // left
        { pos: [-1, -1, -1], norm: [-1, 0, 0] },
        { pos: [-1, -1, 1], norm: [-1, 0, 0] },
        { pos: [-1, 1, -1], norm: [-1, 0, 0] },
        { pos: [-1, 1, 1], norm: [-1, 0, 0] },

        // top
        { pos: [1, 1, -1], norm: [0, 1, 0] },
        { pos: [-1, 1, -1], norm: [0, 1, 0] },
        { pos: [1, 1, 1], norm: [0, 1, 0] },
        { pos: [-1, 1, 1], norm: [0, 1, 0] },

        // bottom
        { pos: [1, -1, 1], norm: [0, -1, 0] },
        { pos: [-1, -1, 1], norm: [0, -1, 0] },
        { pos: [1, -1, -1], norm: [0, -1, 0] },
        { pos: [-1, -1, -1], norm: [0, -1, 0] },
    ];

    const positions = [];
    const normals = [];

    for (const vertex of vertices) {
        positions.push(...vertex.pos);
        normals.push(...vertex.norm);
    }

    // BufferGeometry
    const geometry = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));

    geometry.setIndex([
        0, 1, 2, 2, 1, 3,  // front
        4, 5, 6, 6, 7, 4,  // right
        8, 9, 10, 10, 9, 11,  // back
        12, 13, 14, 14, 13, 15,  // left
        16, 17, 18, 18, 17, 19,  // top
        20, 21, 22, 22, 21, 23,  // bottom
    ]);

    const material = new THREE.MeshPhongMaterial({ color: 'rgb(200, 0, 200)', shininess: 100 });

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}


function createCubeMesh_V3() {

    // No Repeated Vertices --- With indices !!
    // 8 vertices and AVERAGED NORMALS
    // 2 triangles per cube face

    // For each vertex: coordinates and normal vector

    const vertices = [

        // top vertices
        { pos: [1, 1, -1], norm: [1, 1, -1] },
        { pos: [-1, 1, -1], norm: [-1, 1, -1] },
        { pos: [1, 1, 1], norm: [1, 1, 1] },
        { pos: [-1, 1, 1], norm: [-1, 1, 1] },

        // bottom vertices
        { pos: [1, -1, 1], norm: [1, -1, 1] },
        { pos: [-1, -1, 1], norm: [-1, -1, 1] },
        { pos: [1, -1, -1], norm: [1, -1, -1] },
        { pos: [-1, -1, -1], norm: [-1, -1, -1] },
    ];

    const positions = [];
    const normals = [];

    for (const vertex of vertices) {
        positions.push(...vertex.pos);
        normals.push(...vertex.norm);
    }

    // BufferGeometry
    const geometry = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));

    geometry.setIndex([
        2, 3, 5, 2, 5, 4,  // front
        0, 2, 4, 0, 4, 6,  // right
        0, 7, 1, 0, 6, 7,  // back
        3, 1, 5, 1, 7, 5,  // left
        0, 1, 3, 0, 3, 2,  // top
        7, 6, 4, 7, 4, 5,  // bottom
    ]);

    // TO GET UNIT VECTORS

    geometry.normalizeNormals();

    console.log(geometry);

    const material = new THREE.MeshPhongMaterial({ color: 'rgb(200, 0, 200)', shininess: 100 });

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function createTetrahedronMesh() {
    const vertices = [
        {pos: [-1, 0, -1], norm: [0, -1, 0]},
        {pos: [1, 0, 0], norm: [0, -1, 0]},
        {pos: [0, 0, 1], norm: [0, -1, 0]},
        
        {pos: [0, 0, 1], norm: [1, 1, 1]},
        {pos: [1, 0, 0], norm: [1, 1, 1]},
        {pos: [0, 1, 0], norm: [1, 1, 1]},

        {pos: [1, 0, 0], norm: [1, 1, -2]},
        {pos: [-1, 0, -1], norm: [1, 1, -2]},
        {pos: [0, 1, 0], norm: [1, 1, -2]},

        {pos: [-1, 0, -1], norm: [2, -1, -1]},
        {pos: [0, 0, 1], norm: [2, -1, -1]},
        {pos: [0, 1, 0], norm: [2, -1, -1]},
    ];

    const positions = [];
    const normals = [];

    for (const vertex of vertices) {
        positions.push(...vertex.pos);
        normals.push(...vertex.norm);
    }

    // BufferGeometry
    const geometry = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));

    geometry.setIndex([
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11,
        12, 13, 14,
        15, 16, 17
    ]);

    const material = new THREE.MeshPhongMaterial({ color: 'rgb(200, 0, 200)', shininess: 100 });

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

    // NEW
    // Create simple mesh models

    const cube_1 = createCubeMesh_V1();
    cube_1.name = "Cube_1";
    sceneGraph.add(cube_1);
    cube_1.translateX(-6).translateY(3);

    const cube_2 = createCubeMesh_V2();
    cube_2.name = "Cube_2";
    sceneGraph.add(cube_2);
    cube_2.translateY(3);

    const cube_3 = createCubeMesh_V3();
    cube_3.name = "Cube_3";
    sceneGraph.add(cube_3);
    cube_3.translateX(6).translateY(3);

    const tetrahedron = createTetrahedronMesh();
    tetrahedron.name = "Tetrahedron";
    sceneGraph.add(tetrahedron);
    tetrahedron.translateY(-3);
}

var delta = 0.5;

function computeFrame(time) {

    // LIGHT moves from left to right and right to left

    // Can extract an object from the scene Graph from its name
    const light = sceneElements.sceneGraph.getObjectByName("light");

    // Apply a small displacement
    if (light.position.x >= 30) {
        delta *= -1;
    } else if (light.position.x <= -30) {
        delta *= -1;
    }
    light.translateX(delta);

    // Rotating the first cube

    const cube_1 = sceneElements.sceneGraph.getObjectByName("Cube_1");

    cube_1.rotateX(0.01);
    cube_1.rotateY(0.01);
    cube_1.rotateZ(0.01);

    // Rotating the second cube

    const cube_2 = sceneElements.sceneGraph.getObjectByName("Cube_2");

    cube_2.rotateX(0.01);
    cube_2.rotateY(0.01);
    cube_2.rotateZ(0.01);

    // Rotating the third cube

    const cube_3 = sceneElements.sceneGraph.getObjectByName("Cube_3");

    cube_3.rotateX(0.01);
    cube_3.rotateY(0.01);
    cube_3.rotateZ(0.01);

    // Rotating the tetrahedron

    const tetrahedron = sceneElements.sceneGraph.getObjectByName("Tetrahedron");

    tetrahedron.rotateX(0.01);
    tetrahedron.rotateY(0.01);
    tetrahedron.rotateZ(0.01);

    // Rendering
    helper.render(sceneElements);

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}
