import * as THREE from "three";

export const addBallToScene = (
  scene,
  position = 0,
  velocity = 0.008,
  color = "red"
) => {
  const ballGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const ballMaterial = new THREE.MeshBasicMaterial({ color });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ball);

  const ballPosition = new THREE.Vector3(position, position, position);
  const ballVelocity = new THREE.Vector3(velocity, velocity, velocity);

  return { ball, ballGeometry, ballPosition, ballVelocity };
};

export const animateBall = (ball, geometry, position, velocity) => {
  position.add(velocity);

  if (Math.abs(position.x) + geometry.parameters.radius > 0.35)
    velocity.x = -velocity.x;
  if (Math.abs(position.y) + geometry.parameters.radius > 0.35)
    velocity.y = -velocity.y;
  if (Math.abs(position.z) + geometry.parameters.radius > 0.35)
    velocity.z = -velocity.z;

  ball.position.set(position.x, position.y, position.z);
};
