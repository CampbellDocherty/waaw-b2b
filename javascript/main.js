import { Group } from "@tweenjs/tween.js";
import { initDice, throwDice } from "./dice.js";
import { initPhysics } from "./physics.js";
import { render } from "./render.js";
import { createFloor, initScene } from "./scene.js";

export let djSelected = false;

const tweensGroup = new Group();

const physicsWorld = initPhysics();
export const { renderer, camera, scene } = initScene();

export const dice = initDice({ physicsWorld, scene });
createFloor(scene, physicsWorld);

render({
  dice,
  renderer,
  tweensGroup,
  scene,
  camera,
  physicsWorld,
});

window.addEventListener("click", () => {
  throwDice({
    dice,
    physicsWorld,
    tweensGroup,
  });
  djSelected = true;
  setTimeout(() => {
    djSelected = false;
  }, 6000);
});
