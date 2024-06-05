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

  dice.forEach((dice, index) => {
    dice.mesh.position.copy(dice.body.position);
    dice.mesh.quaternion.copy(dice.body.quaternion);
    if (!physicsWorld.gravity.isZero() || djSelected) {
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
