import { Group } from "@tweenjs/tween.js";
import { initDice } from "./dice.js";
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

const timerElement = document.getElementById("timer");

const initialCountdownTime = 3600;
let countdownTime = initialCountdownTime;
function updateTimer() {
  const hours = Math.floor(countdownTime / 3600);
  const minutes = Math.floor((countdownTime % 3600) / 60);
  const seconds = countdownTime % 60;

  timerElement.textContent = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  countdownTime--;

  if (countdownTime < 0) {
    countdownTime = initialCountdownTime;
  }
}

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
