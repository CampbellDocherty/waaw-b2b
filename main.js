import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.5,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const edgesGeometry = new THREE.EdgesGeometry(geometry);
const edgesMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  linewidth: 10,
});
const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
scene.add(edges);

camera.position.z = 3;

const ballGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

let ballPosition = new THREE.Vector3(0, 0, 0);
let ballVelocity = new THREE.Vector3(0.01, 0.01, 0.01);

function animate() {
  requestAnimationFrame(animate);

  ballPosition.add(ballVelocity);

  if (Math.abs(ballPosition.x) + ballGeometry.parameters.radius > 0.35)
    ballVelocity.x = -ballVelocity.x;
  if (Math.abs(ballPosition.y) + ballGeometry.parameters.radius > 0.35)
    ballVelocity.y = -ballVelocity.y;
  if (Math.abs(ballPosition.z) + ballGeometry.parameters.radius > 0.35)
    ballVelocity.z = -ballVelocity.z;

  ball.position.set(ballPosition.x, ballPosition.y, ballPosition.z);

  cube.rotation.x += 0.01;
  edges.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  edges.rotation.y += 0.01;
  cube.rotation.z += 0.01;
  edges.rotation.z += 0.01;

  renderer.render(scene, camera);
}

animate();
