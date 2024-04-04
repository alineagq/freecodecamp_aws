import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create balls
const ball1 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
const ball2 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
camera.position.z = 10;
scene.add(ball1, ball2);
renderer.render(scene, camera);
// Set initial positions
ball1.position.set(-5, 0, 0);
ball2.position.set(5, 0, 0);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Set up controls
const controls = {
    ball1: { left: 65, right: 68 },
    ball2: { left: 37, right: 39 }
};

// Keyboard input handling
const keys = {};
window.addEventListener('keydown', (event) => {
    keys[event.keyCode] = true;
});
window.addEventListener('keyup', (event) => {
    keys[event.keyCode] = false;
});

// Update function
const update = () => {
    if (keys[controls.ball1.left]) ball1.position.x -= 0.1;
    if (keys[controls.ball1.right]) ball1.position.x += 0.1;
    if (keys[controls.ball2.left]) ball2.position.x -= 0.1;
    if (keys[controls.ball2.right]) ball2.position.x += 0.1;

    renderer.render(scene, camera);
    requestAnimationFrame(update);
};

// Start the update loop
update();