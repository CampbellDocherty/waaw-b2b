import * as CANNON from "cannon-es";
import * as THREE from "three";
import { Easing, Tween } from "@tweenjs/tween.js";
import { options } from "./options.js";

export function initDice({ physicsWorld, scene }) {
  const dice1 = createDice({ physicsWorld, scene });
  const dice2 = createDice({ physicsWorld, scene });

  const dice = [dice1, dice2];
  initDicePosition(dice);
  return dice;
}

export function createDice({ physicsWorld, scene }) {
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

function getRandomElement(arr) {
  const index = Math.floor(Math.random() * arr.length);
  const element = arr.splice(index, 1)[0];
  return element;
}

let copy = options.slice();

export function throwDice({ dice, physicsWorld, tweensGroup }) {
  physicsWorld.gravity.set(0, -50, 0);
  tweensGroup.removeAll();
  if (copy.length === 0) {
    copy = options.slice();
  }

  dice.forEach((d, dIdx) => {
    d.body.velocity.setZero();
    d.body.angularVelocity.setZero();

    d.body.position = new CANNON.Vec3(dIdx === 0 ? -2 : 2, 0, 1);
    d.mesh.position.copy(d.body.position);

    d.mesh.rotation.set(0, 0, 0);
    d.body.quaternion.copy(d.mesh.quaternion);

    const element = getRandomElement(copy);

    const { randomForce, position } = element;

    d.body.applyImpulse(new CANNON.Vec3(0, randomForce, 0), position);

    d.body.allowSleep = true;

    const endPosition = {
      x: d.body.position.x,
      y: d.body.position.y,
      z: d.body.position.z,
    };
    d.body.addEventListener("sleep", () => {
      const startPosition = {
        x: d.body.position.x,
        y: d.body.position.y,
        z: d.body.position.z,
      };

      const tween = new Tween(startPosition)
        .to(endPosition, 2000)
        .easing(Easing.Quadratic.InOut)
        .onUpdate(() => {
          d.body.quaternion.copy(d.mesh.quaternion);

          d.body.position = new CANNON.Vec3(
            startPosition.x,
            startPosition.y,
            startPosition.z
          );
          d.mesh.position.copy(d.body.position);
        });

      tweensGroup.add(tween);

      setTimeout(() => {
        tween.start();
        physicsWorld.gravity.setZero();
      }, 1000);
    });
  });
}