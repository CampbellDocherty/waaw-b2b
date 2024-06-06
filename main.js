import { Group } from "@tweenjs/tween.js";
import { initDice } from "./dice.js";
import { initPhysics } from "./physics.js";
import { createFloor, initScene } from "./scene.js";
import { render } from "./render.js";
import { throwDice } from "./dice.js";
import { updateTimer, initialCountdownTime } from "./timer.js";

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

window.addEventListener("click", updateTimer, { once: true });
window.addEventListener(
  "click",
  () => {
    setInterval(updateTimer, 1000);
    throwDice({
      dice,
      physicsWorld,
      tweensGroup,
    });
    djSelected = true;
    setInterval(() => {
      djSelected = false;
      throwDice({
        dice,
        physicsWorld,
        tweensGroup,
      });
      djSelected = true;
    }, initialCountdownTime * 1000);
  },
  { once: true }
);
