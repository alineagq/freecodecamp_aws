import * as Three from 'three';

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new Three.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var loader = new Three.TextureLoader().load('wood.jpg');
loader.wrapS = Three.RepeatWrapping;
loader.wrapT = Three.RepeatWrapping;
loader.repeat.set(1, 1);

const geometry = new Three.CircleGeometry(0.5, 1000);
const material = new Three.MeshBasicMaterial({ color: 0xaa3a22 });
const cube = new Three.Mesh(geometry, material);
const rect = new Three.Mesh(new Three.BoxGeometry(0.2, 0.4, 0.05), new Three.MeshBasicMaterial({ map: loader }));
scene.add(cube);
scene.add(rect);
camera.position.z = 5;

// add background cover

const backgroundGeometry = new Three.PlaneGeometry(5800, 3200, 1);
var bg = new Three.TextureLoader().load('bg2.jpg');
const backgroundMaterial = new Three.MeshBasicMaterial({ map: bg });
const background = new Three.Mesh(backgroundGeometry, backgroundMaterial);
background.position.x = 0;
background.position.z = -600;
scene.add(background);


// move the rect with wasd

const keyState = {};
window.addEventListener('keydown', (e) => {
  keyState[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keyState[e.key] = false;
});

const speed = 0.1;

const moveRect = () => {
  if (keyState['w']) {
    rect.position.z -= speed;
    cube.position.z -= speed;
  }

  if (keyState['s']) {
    rect.position.z += speed;
    cube.position.z += speed;
  }

  if (keyState['a']) {
    rect.position.x -= speed;
    cube.position.x -= speed;
  }

  if (keyState['d']) {
    rect.position.x += speed;
    cube.position.x += speed;
  }
}

rect.position.y = -0.6;

// throw a sphere when press space

window.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    const sphere = new Three.Mesh(new Three.SphereGeometry(0.1, 1000, 1000), new Three.MeshBasicMaterial({ color: 0x00ff00 }));
    sphere.position.x = rect.position.x;
    sphere.position.y = rect.position.y;
    sphere.position.z = rect.position.z;
    scene.add(sphere);

    const direction = new Three.Vector3(0, 0, -1);
    direction.applyQuaternion(rect.quaternion);

    const speed = 0.1;
    sphere.userData.speed = speed;
    sphere.userData.direction = direction;
  }
});

const bounce = (sphere) => {
  if (sphere.position.x > 2 || sphere.position.x < -2) {
    sphere.userData.direction.x *= -1;
  }

  if (sphere.position.y > 2 || sphere.position.y < -2) {
    sphere.userData.direction.y *= -1;
  }

  if (sphere.position.z > 2 || sphere.position.z < -2) {
    sphere.userData.direction.z *= -1;
  }
}

const moveSphere = (sphere) => {
  sphere.position.add(sphere.userData.direction.clone().multiplyScalar(sphere.userData.speed));
}

const updateSpheres = () => {
  scene.children.forEach((child) => {
    if (child instanceof Three.Mesh && child.geometry.type === 'SphereGeometry') {
      moveSphere(child);
      bounce(child);
    }
  });
}

const updateAll = () => {
  updateSpheres();
}

// move camera with mouse

let isMouseDown = false;
let previousMousePosition = { x: 0, y: 0 };

window.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
}
);

window.addEventListener('mouseup', () => {
  isMouseDown = false;
}
);

window.addEventListener('mousemove', (e) => {
  if (isMouseDown) {
    const deltaMove = {
      x: e.clientX - previousMousePosition.x,
      y: e.clientY - previousMousePosition.y
    };

    camera.rotation.x += deltaMove.y * 0.01;
    camera.rotation.y += deltaMove.x * 0.01;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  }
}
);

// main loop


const animate = () => {
  updateAll();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  moveRect();

  renderer.render(scene, camera);
}

animate();
