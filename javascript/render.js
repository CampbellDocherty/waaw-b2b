import { djSelected } from "./main.js";

export function render({
  dice,
  renderer,
  tweensGroup,
  scene,
  camera,
  physicsWorld,
}) {
  physicsWorld.fixedStep();

  const [firstDice, secondDice] = dice;

  rotate({
    physicsWorld,
    dice: firstDice,
    rotation: {
      x: 0.007,
      y: 0.003,
      z: 0.004,
    },
  });
  rotate({
    physicsWorld,
    dice: secondDice,
    rotation: {
      x: -0.004,
      y: -0.003,
      z: 0.008,
    },
  });

  renderer.render(scene, camera);
  const tweens = tweensGroup.getAll();
  tweens.forEach((tween) => {
    tween.update();
  });
  requestAnimationFrame(() =>
    render({
      dice,
      renderer,
      tweensGroup,
      scene,
      camera,
      physicsWorld,
    })
  );
}
function rotate({ physicsWorld, dice, rotation }) {
  dice.mesh.position.copy(dice.body.position);
  dice.mesh.quaternion.copy(dice.body.quaternion);
  if (!physicsWorld.gravity.isZero() || djSelected) {
    return;
  }

  dice.mesh.rotation.x += rotation.x;
  dice.mesh.rotation.y += rotation.y;
  dice.mesh.rotation.z += rotation.z;
  dice.body.quaternion.copy(dice.mesh.quaternion);
}
