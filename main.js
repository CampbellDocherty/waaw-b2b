import * as THREE from "three";
import { addCubeToScene, animateCube } from "./cube";
import { addBallToScene, animateBall } from "./ball";

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

const { cube, edges } = addCubeToScene(scene);
const { ball, ballGeometry, ballPosition, ballVelocity } =
  addBallToScene(scene);

camera.position.z = 3;

const animate = () => {
  requestAnimationFrame(animate);
  animateBall(ball, ballGeometry, ballPosition, ballVelocity);
  animateCube(cube, edges);

  renderer.render(scene, camera);
};

animate();
