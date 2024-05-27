import * as THREE from "three";
import { addCubeToScene, animateCube } from "./cube.js";
import { addBallToScene, animateBall } from "./ball.js";

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

const edges = addCubeToScene(scene);
const edges2 = addCubeToScene(scene, 1);
// const {
//   ball: ball1,
//   ballGeometry: ballGeometry1,
//   ballPosition: ballPosition1,
//   ballVelocity: ballVelocity1,
// } = addBallToScene(
//   scene,
//   {
//     x: 0.1,
//     y: 0.1,
//     z: 0.1,
//   },
//   0.007,
//   "red"
// );

// const {
//   ball: ball2,
//   ballGeometry: ballGeometry2,
//   ballPosition: ballPosition2,
//   ballVelocity: ballVelocity2,
// } = addBallToScene(
//   scene,
//   {
//     x: -0.2,
//     y: -0.2,
//     z: -0.4,
//   },
//   0.005,
//   "blue"
// );

// const {
//   ball: ball3,
//   ballGeometry: ballGeometry3,
//   ballPosition: ballPosition3,
//   ballVelocity: ballVelocity3,
// } = addBallToScene(
//   scene,
//   {
//     x: 0.1,
//     y: -0.2,
//     z: -0.4,
//   },
//   0.006,
//   "sandybrown"
// );

camera.position.z = 3;

const animate = () => {
  requestAnimationFrame(animate);
  // animateBall(ball1, ballGeometry1, ballPosition1, ballVelocity1);
  // animateBall(ball2, ballGeometry2, ballPosition2, ballVelocity2, 0.4);
  // animateBall(ball3, ballGeometry3, ballPosition3, ballVelocity3, 0.5);
  animateCube(edges, { x: 0.001, y: 0.002, z: 0.003 });
  animateCube(edges2, { x: 0.001, y: 0.002, z: 0.002 });

  renderer.render(scene, camera);
};

animate();
