import * as THREE from "three";
import { addCubeToScene, animateCube } from "./cube.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const { dice, edges } = addCubeToScene(scene);
const { dice: dice2, edges: edges2 } = addCubeToScene(scene, 0.55);

camera.position.z = 3;

const animate = () => {
  requestAnimationFrame(animate);

  animateCube(dice, edges, { x: 0.001, y: 0.002, z: 0.003 });
  animateCube(dice2, edges2, { x: 0.001, y: 0.002, z: 0.002 });

  renderer.render(scene, camera);
};

animate();
