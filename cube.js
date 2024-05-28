import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

const params = {
  segments: 100,
  edgeRadius: 0.07,
  notchRadius: 0.12,
  notchDepth: 0.1,
};

const createBoxGeometry = () => {
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
};

const createFaceTextures = () => {
  const faceTextures = [...Array(8)].fill(0).map((_, i) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    context.font = "bolder 90px verdana";
    context.fillStyle = "green";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fillText(i.toString(), 256, 256);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  });

  return faceTextures;
};

export const addCubeToScene = (scene, xPosition = -0.55) => {
  // const geometry = createBoxGeometry();

  const geometry = new THREE.OctahedronGeometry(0.5);

  const faceTextures = createFaceTextures();

  // geometry.faces.forEach((face) => {
  //   const v1 = geometry.vertices[face.a];
  //   const v2 = geometry.vertices[face.b];
  //   const v3 = geometry.vertices[face.c];

  //   const center = new THREE.Vector3().add(v1).add(v2).add(v3).divideScalar(3);

  //   faceCenters.push(center);
  // });

  function createTextCanvas(text, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "black";
    context.font = `${height / 2}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, width / 2, height / 2);
    return canvas;
  }

  // Create textures from canvases
  const size = 256;
  const textures = [
    new THREE.CanvasTexture(createTextCanvas("1", size, size)),
    new THREE.CanvasTexture(createTextCanvas("2", size, size)),
    new THREE.CanvasTexture(createTextCanvas("3", size, size)),
    new THREE.CanvasTexture(createTextCanvas("4", size, size)),
    new THREE.CanvasTexture(createTextCanvas("5", size, size)),
    new THREE.CanvasTexture(createTextCanvas("6", size, size)),
    new THREE.CanvasTexture(createTextCanvas("7", size, size)),
    new THREE.CanvasTexture(createTextCanvas("8", size, size)),
  ];

  // Create materials and assign textures
  const materials = [];
  for (let i = 0; i < geometry.attributes.position.count / 3; i++) {
    materials.push(
      new THREE.MeshBasicMaterial({ map: textures[i % textures.length] })
    );
  }

  // const material = new THREE.MeshBasicMaterial({
  //   color: 0xffffff,
  // });
  const dice = new THREE.Mesh(geometry, materials);

  scene.add(dice);
  dice.position.set(xPosition, 0, 0);

  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgesMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
  });
  const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
  scene.add(edges);

  edges.position.set(xPosition, 0, 0);

  return { dice, edges };
};

export const animateCube = (
  dice,
  edges,
  rotation = {
    x: 0.004,
    y: 0.004,
    z: 0.004,
  }
) => {
  edges.rotation.x += rotation.x;
  dice.rotation.x += rotation.x;
  edges.rotation.y += rotation.y;
  dice.rotation.y += rotation.y;
  edges.rotation.z += rotation.z;
  dice.rotation.z += rotation.z;
};
