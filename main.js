import * as CANNON from "cannon-es";

import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

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

function createDiceMesh() {
  const boxMaterialOuter = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  });
  const boxMaterialInner = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0,
    metalness: 1,
    side: THREE.DoubleSide,
  });

  const diceMesh = new THREE.Group();
  const innerMesh = new THREE.Mesh(createInnerGeometry(), boxMaterialInner);
  const boxGeometry = createBoxGeometry();
  const outerMesh = new THREE.Mesh(boxGeometry, boxMaterialOuter);
  outerMesh.castShadow = true;
  diceMesh.add(innerMesh, outerMesh);

  return diceMesh;
}

function createDice() {
  const mesh = createDiceMesh();

  scene.add(mesh);

  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    sleepTimeLimit: 0.1,
  });
  physicsWorld.addBody(body);

  return { mesh, body };
}

function createBoxGeometry() {
  let boxGeometry = new THREE.BoxGeometry(
    1,
    1,
    1,
    params.segments,
    params.segments,
    params.segments
  );

  const positionAttr = boxGeometry.attributes.position;
  const subCubeHalfSize = 0.5 - params.edgeRadius;

  for (let i = 0; i < positionAttr.count; i++) {
    let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i);

    const subCube = new THREE.Vector3(
      Math.sign(position.x),
      Math.sign(position.y),
      Math.sign(position.z)
    ).multiplyScalar(subCubeHalfSize);
    const addition = new THREE.Vector3().subVectors(position, subCube);

    if (
      Math.abs(position.x) > subCubeHalfSize &&
      Math.abs(position.y) > subCubeHalfSize &&
      Math.abs(position.z) > subCubeHalfSize
    ) {
      addition.normalize().multiplyScalar(params.edgeRadius);
      position = subCube.add(addition);
    } else if (
      Math.abs(position.x) > subCubeHalfSize &&
      Math.abs(position.y) > subCubeHalfSize
    ) {
      addition.z = 0;
      addition.normalize().multiplyScalar(params.edgeRadius);
      position.x = subCube.x + addition.x;
      position.y = subCube.y + addition.y;
    } else if (
      Math.abs(position.x) > subCubeHalfSize &&
      Math.abs(position.z) > subCubeHalfSize
    ) {
      addition.y = 0;
      addition.normalize().multiplyScalar(params.edgeRadius);
      position.x = subCube.x + addition.x;
      position.z = subCube.z + addition.z;
    } else if (
      Math.abs(position.y) > subCubeHalfSize &&
      Math.abs(position.z) > subCubeHalfSize
    ) {
      addition.x = 0;
      addition.normalize().multiplyScalar(params.edgeRadius);
      position.y = subCube.y + addition.y;
      position.z = subCube.z + addition.z;
    }

    const notchWave = (v) => {
      v = (1 / params.notchRadius) * v;
      v = Math.PI * Math.max(-1, Math.min(1, v));
      return params.notchDepth * (Math.cos(v) + 1);
    };
    const notch = (pos) => notchWave(pos[0]) * notchWave(pos[1]);

    const offset = 0.23;

    if (position.y === 0.5) {
      position.y -= notch([position.x, position.z]);
    } else if (position.x === 0.5) {
      position.x -= notch([position.y + offset, position.z + offset]);
      position.x -= notch([position.y - offset, position.z - offset]);
    } else if (position.z === 0.5) {
      position.z -= notch([position.x - offset, position.y + offset]);
      position.z -= notch([position.x, position.y]);
      position.z -= notch([position.x + offset, position.y - offset]);
    } else if (position.z === -0.5) {
      position.z += notch([position.x + offset, position.y + offset]);
      position.z += notch([position.x + offset, position.y - offset]);
      position.z += notch([position.x - offset, position.y + offset]);
      position.z += notch([position.x - offset, position.y - offset]);
    } else if (position.x === -0.5) {
      position.x += notch([position.y + offset, position.z + offset]);
      position.x += notch([position.y + offset, position.z - offset]);
      position.x += notch([position.y, position.z]);
      position.x += notch([position.y - offset, position.z + offset]);
      position.x += notch([position.y - offset, position.z - offset]);
    } else if (position.y === -0.5) {
      position.y += notch([position.x + offset, position.z + offset]);
      position.y += notch([position.x + offset, position.z]);
      position.y += notch([position.x + offset, position.z - offset]);
      position.y += notch([position.x - offset, position.z + offset]);
      position.y += notch([position.x - offset, position.z]);
      position.y += notch([position.x - offset, position.z - offset]);
    }

    positionAttr.setXYZ(i, position.x, position.y, position.z);
  }

  boxGeometry.deleteAttribute("normal");
  boxGeometry.deleteAttribute("uv");
  boxGeometry = BufferGeometryUtils.mergeVertices(boxGeometry);

  boxGeometry.computeVertexNormals();

  return boxGeometry;
}

function createInnerGeometry() {
  const baseGeometry = new THREE.PlaneGeometry(
    1 - 2 * params.edgeRadius,
    1 - 2 * params.edgeRadius
  );
  const offset = 0.48;
  return BufferGeometryUtils.mergeGeometries(
    [
      baseGeometry.clone().translate(0, 0, offset),
      baseGeometry.clone().translate(0, 0, -offset),
      baseGeometry
        .clone()
        .rotateX(0.5 * Math.PI)
        .translate(0, -offset, 0),
      baseGeometry
        .clone()
        .rotateX(0.5 * Math.PI)
        .translate(0, offset, 0),
      baseGeometry
        .clone()
        .rotateY(0.5 * Math.PI)
        .translate(-offset, 0, 0),
      baseGeometry
        .clone()
        .rotateY(0.5 * Math.PI)
        .translate(offset, 0, 0),
    ],
    false
  );
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

    d.body.position = new CANNON.Vec3(dIdx === 0 ? -1 : 1, 0, 1);
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

    d.body.position = new CANNON.Vec3(dIdx === 0 ? -1 : 1, 0, 1);
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
