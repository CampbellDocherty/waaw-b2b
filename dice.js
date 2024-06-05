import * as CANNON from "cannon-es";
import * as THREE from "three";
import { scene, physicsWorld } from "./main.js";

export function initDice() {
  const dice1 = createDice();
  const dice2 = createDice();

  const dice = [dice1, dice2];
  initDicePosition(dice);
  return dice;
}

export function createDice() {
  const textureLoader = new THREE.TextureLoader();
  const textures = [
    textureLoader.load("assets/naomi.png"),
    textureLoader.load("assets/becca.png"),
    textureLoader.load("assets/abdiablo.png"),
    textureLoader.load("assets/lc.png"),
    textureLoader.load("assets/randy.png"),
    textureLoader.load("assets/viriss.png"),
  ];

  const materials = textures.map(
    (texture) =>
      new THREE.MeshLambertMaterial({
        map: texture,
        alphaTest: 0.8,
      })
  );

  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const cube = new THREE.Mesh(geometry, materials);

  scene.add(cube);

  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    sleepTimeLimit: 0.1,
  });
  physicsWorld.addBody(body);

  return { mesh: cube, body };
}

export function initDicePosition(dice) {
  dice.forEach((d, dIdx) => {
    d.body.velocity.setZero();
    d.body.angularVelocity.setZero();

    d.body.position = new CANNON.Vec3(dIdx === 0 ? -2 : 2, 0, 1);
    d.mesh.position.copy(d.body.position);

    d.mesh.rotation.set(0, 0, 0);
    d.body.quaternion.copy(d.mesh.quaternion);
  });
}
