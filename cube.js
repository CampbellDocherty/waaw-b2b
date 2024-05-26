import * as THREE from "three";

export const addCubeToScene = (scene) => {
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

  return { cube, edges };
};

export const animateCube = (cube, edges) => {
  cube.rotation.x += 0.008;
  edges.rotation.x += 0.008;
  cube.rotation.y += 0.008;
  edges.rotation.y += 0.008;
  cube.rotation.z += 0.008;
  edges.rotation.z += 0.008;
};
