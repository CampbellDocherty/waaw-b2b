import * as CANNON from "cannon-es";

export const options = [
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
