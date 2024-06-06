import * as THREE from "three";

export function updateDjName(text, id) {
  const el = document.getElementById(id);
  el.textContent = text;
}

export function updateDjsOnDice(dice, djsToSubstitute) {
  dice.forEach((dice) => {
    const textureLoader = new THREE.TextureLoader();

    let currentdjAssets = [
      "assets/naomi.png",
      "assets/becca.png",
      "assets/abdiablo.png",
      "assets/lc.png",
      "assets/randy.png",
      "assets/viriss.png",
    ];

    const newDjAssets = ["assets/albertina.png", "assets/hiteca.png"];

    djsToSubstitute.forEach((djToSubstitute, i) => {
      const index = currentdjAssets.indexOf(djToSubstitute.link);

      if (index > -1) {
        currentdjAssets[index] = newDjAssets[i];
      }
    });

    const textures = currentdjAssets.map((dj) => textureLoader.load(dj));

    const materials = textures.map(
      (texture) =>
        new THREE.MeshLambertMaterial({
          map: texture,
          alphaTest: 0.8,
        })
    );

    dice.mesh.material = materials;
  });
}
