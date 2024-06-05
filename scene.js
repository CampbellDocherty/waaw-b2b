import * as THREE from "three";
import * as CANNON from "cannon-es";

const canvasEl = document.querySelector("#canvas");

export function initScene() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvasEl,
  });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    300
  );
  camera.position.set(0, 12, 0);
  camera.lookAt(0, 0, 0);

  updateSceneSize(camera, renderer);
  window.addEventListener("resize", () => updateSceneSize(camera, renderer));

  const ambientLight = new THREE.AmbientLight(16777215, 2);
  scene.add(ambientLight);
  const topLight = new THREE.PointLight(16777215, 0.5);
  topLight.position.set(0, 4, 0);
  topLight.castShadow = true;
  topLight.shadow.camera.near = 5;
  topLight.shadow.camera.far = 700;
  scene.add(topLight);
  return { renderer, camera, scene };
}

export function createFloor(scene, physicsWorld) {
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

export function updateSceneSize(camera, renderer) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
