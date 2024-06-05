import * as CANNON from "cannon-es";

export function initPhysics() {
  const physicsWorld = new CANNON.World({
    allowSleep: true,
  });
  physicsWorld.defaultContactMaterial.restitution = 0.3;

  return physicsWorld;
}
