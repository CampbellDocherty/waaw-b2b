import * as THREE from "three";

export const addBallToScene = (
  scene,
  position = { x: 0, y: 0, z: 0 },
  velocity = 0.008,
  color = "red"
) => {
  const ballGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const ballMaterial = new THREE.MeshBasicMaterial({ color });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ball);

  const ballPosition = new THREE.Vector3(position.x, position.y, position.z);
  const ballVelocity = new THREE.Vector3(velocity, velocity, velocity);

  return { ball, ballGeometry, ballPosition, ballVelocity };
};

export const animateBall = (
  ball,
  geometry,
  position,
  velocity,
  threshold = 0.35
) => {
  position.add(velocity);

  if (Math.abs(position.x) + geometry.parameters.radius > threshold)
    velocity.x = -velocity.x;
  if (Math.abs(position.y) + geometry.parameters.radius > threshold)
    velocity.y = -velocity.y;
  if (Math.abs(position.z) + geometry.parameters.radius > threshold)
    velocity.z = -velocity.z;

  ball.position.set(position.x, position.y, position.z);
};
