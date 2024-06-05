import { Group } from "@tweenjs/tween.js";
import { initDice } from "./dice.js";
import { options } from "./options.js";
import { initPhysics } from "./physics.js";
import { createFloor, initScene } from "./scene.js";
import { render } from "./render.js";
import { throwDice } from "./dice.js";

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
});
