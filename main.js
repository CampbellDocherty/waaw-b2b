import * as CANNON from "cannon-es";

import * as THREE from "three";
import { options } from "./options.js";
import { Tween, Easing, Group } from "@tweenjs/tween.js";
import { initDice } from "./dice.js";

const canvasEl = document.querySelector("#canvas");

export let renderer, scene, camera, physicsWorld;

let gravity = false;
let djSelected = false;

const tweensGroup = new Group();

initPhysics();
initScene();

window.addEventListener("resize", updateSceneSize);

function initScene() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvasEl,
  });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    300
  );
  camera.position.set(0, 12, 0);
  camera.lookAt(0, 0, 0);

  updateSceneSize();

  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);
  const topLight = new THREE.PointLight(0xffffff, 0.5);
  topLight.position.set(0, 4, 0);
  topLight.castShadow = true;
  topLight.shadow.camera.near = 5;
  topLight.shadow.camera.far = 700;
  scene.add(topLight);
}

const diceArray = initDice();
createFloor();
render();

function initPhysics() {
  physicsWorld = new CANNON.World({
    allowSleep: true,
  });
  physicsWorld.defaultContactMaterial.restitution = 0.3;
}

function createFloor() {
  let floor;
  const loader = new THREE.TextureLoader();
  loader.load("assets/text.png", function (texture) {
    floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshBasicMaterial({
        map: texture,
        alphaHash: true,
        alphaMap: texture,
      })
    );
    floor.receiveShadow = true;
    floor.position.y = -7;
    floor.quaternion.setFromAxisAngle(
      new THREE.Vector3(-1, 0, 0),
      Math.PI * 0.5
    );
    scene.add(floor);
    const floorBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    floorBody.position.copy(floor.position);
    floorBody.quaternion.copy(floor.quaternion);
    physicsWorld.addBody(floorBody);
  });
}

function render() {
  physicsWorld.fixedStep();

  diceArray.forEach((dice, index) => {
    dice.mesh.position.copy(dice.body.position);
    dice.mesh.quaternion.copy(dice.body.quaternion);
    if (gravity || djSelected) {
      return;
    }

    dice.mesh.rotation.x += index === 0 ? 0.007 : 0.004;
    dice.mesh.rotation.y += index === 0 ? 0.003 : 0.003;
    dice.mesh.rotation.z += index === 0 ? 0.004 : 0.008;
    dice.body.quaternion.copy(dice.mesh.quaternion);
  });

  renderer.render(scene, camera);
  const tweens = tweensGroup.getAll();
  tweens.forEach((tween) => {
    tween.update();
  });
  requestAnimationFrame(render);
}

function updateSceneSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("click", triggerDiceThrow);

function triggerDiceThrow() {
  gravity = true;
  physicsWorld.gravity.set(0, -50, 0);
  throwDice();
}

function getRandomElement(arr) {
  const index = Math.floor(Math.random() * arr.length);

  const element = arr.splice(index, 1)[0];

  return element;
}

let copy = options.slice();

function throwDice() {
  tweensGroup.removeAll();
  if (copy.length === 0) {
    copy = options.slice();
  }

  diceArray.forEach((d, dIdx) => {
    d.body.velocity.setZero();
    d.body.angularVelocity.setZero();

    d.body.position = new CANNON.Vec3(dIdx === 0 ? -2 : 2, 0, 1);
    d.mesh.position.copy(d.body.position);

    d.mesh.rotation.set(0, 0, 0);
    d.body.quaternion.copy(d.mesh.quaternion);

    const element = getRandomElement(copy);

    const { randomForce, position } = element;

    if (gravity) {
      d.body.applyImpulse(new CANNON.Vec3(0, randomForce, 0), position);
    }

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

      djSelected = true;
      tweensGroup.add(tween);
      setTimeout(() => {
        tween.start();
        gravity = false;
      }, 1000);
    });
  });
}
