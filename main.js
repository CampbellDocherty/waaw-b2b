import * as CANNON from "cannon-es";

import * as THREE from "three";

const canvasEl = document.querySelector("#canvas");

let renderer, scene, camera, physicsWorld;

let gravity = false;

const params = {
  numberOfDice: 2,
  segments: 40,
  edgeRadius: 0.07,
  notchRadius: 0.12,
  notchDepth: 0.1,
};

const options = [
  {
    value: 1,
    randomForce: 0.1 + 0.2 * 0.5054330461600753,
    position: new CANNON.Vec3(0, 0, 0.2),
  },
  {
    value: 2,
    randomForce: 0.2 + 0.4 * 0.6195434488172735,
    position: new CANNON.Vec3(0.4, 0, 0.2),
  },
  {
    value: 3,
    randomForce: 0.2 + 0.4 * 0.6898916672811655,
    position: new CANNON.Vec3(0.4, 0.8, 0.6),
  },
  {
    value: 4,
    randomForce: 0.1 + 0.2 * 0.9532962453133706,
    position: new CANNON.Vec3(0, 0, 0.2),
  },
  {
    value: 5,
    randomForce: 0.2 + 0.4 * 0.6382086306602428,
    position: new CANNON.Vec3(0.4, 0.8, 0.6),
  },
  {
    value: 6,
    randomForce: 0.2 + 0.4 * 0.21318827165314658,
    position: new CANNON.Vec3(0.4, 0, 0.2),
  },
];

let alreadyShown = [];
let diceRolls = 0;

function resetShown() {
  alreadyShown = [];
}

const diceArray = [];

initPhysics();
initScene();

window.addEventListener("resize", updateSceneSize);
window.addEventListener("click", triggerDiceThrow);

function triggerDiceThrow() {
  gravity = true;
  physicsWorld.gravity.set(0, -50, 0);
  throwDice();
}

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

  createFloor();
  for (let i = 0; i < params.numberOfDice; i++) {
    diceArray.push(createDice());
  }

  initDicePosition();

  render();
}

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

function createDice() {
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

function render() {
  physicsWorld.fixedStep();

  diceArray.forEach((dice, index) => {
    dice.mesh.position.copy(dice.body.position);
    dice.mesh.quaternion.copy(dice.body.quaternion);
    if (gravity) {
      return;
    }
    dice.mesh.rotation.x += index === 0 ? 0.007 : 0.004;
    dice.mesh.rotation.y += index === 0 ? 0.003 : 0.003;
    dice.mesh.rotation.z += index === 0 ? 0.004 : 0.008;
    dice.body.quaternion.copy(dice.mesh.quaternion);
  });

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function updateSceneSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function getRandomElement(arr) {
  const copyArr = arr.slice();

  const index = Math.floor(Math.random() * copyArr.length);

  let element = copyArr.splice(index, 1)[0];

  while (alreadyShown.includes(element.value)) {
    element = copyArr.splice(index, 1)[0];
  }

  alreadyShown.push(element.value);

  return element;
}

function initDicePosition() {
  diceArray.forEach((d, dIdx) => {
    d.body.velocity.setZero();
    d.body.angularVelocity.setZero();

    d.body.position = new CANNON.Vec3(dIdx === 0 ? -2 : 2, 0, 1);
    d.mesh.position.copy(d.body.position);

    d.mesh.rotation.set(0, 0, 0);
    d.body.quaternion.copy(d.mesh.quaternion);
  });
}

function throwDice() {
  diceRolls += 1;

  if (diceRolls > 3) {
    resetShown();
    diceRolls = 1;
  }

  diceArray.forEach((d, dIdx) => {
    d.body.velocity.setZero();
    d.body.angularVelocity.setZero();

    d.body.position = new CANNON.Vec3(dIdx === 0 ? -2 : 2, 0, 1);
    d.mesh.position.copy(d.body.position);

    d.mesh.rotation.set(0, 0, 0);
    d.body.quaternion.copy(d.mesh.quaternion);

    const element = getRandomElement(options);

    const { randomForce, position } = element;

    if (gravity) {
      d.body.applyImpulse(new CANNON.Vec3(0, randomForce, 0), position);
    }

    d.body.allowSleep = true;
  });
}
