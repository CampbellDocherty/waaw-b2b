import { initNameCanvas } from "./canvas.js";

let fonts = {
  abdi: {
    src: "assets/fonts/abdiablo-font.png",
    width: 400,
    height: 150,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
  naomi: {
    src: "assets/fonts/naomi-font.png",
    width: 400,
    height: 150,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
  clarisse: {
    src: "assets/fonts/viriss-font.png",
    width: 400,
    height: 150,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
  becca: {
    src: "assets/fonts/becca-font.png",
    width: 400,
    height: 150,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
  lc: {
    src: "assets/fonts/lc-font.png",
    width: 400,
    height: 150,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
  randy: {
    src: "assets/fonts/randy-font.png",
    width: 500,
    height: 200,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
  albertina: {
    src: "assets/fonts/albertina-font.png",
    width: 400,
    height: 150,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
  hiteca: {
    src: "assets/fonts/hiteca-font.png",
    width: 400,
    height: 150,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
};

export function updateDjName(djOne, djTwo) {
  const fontOne = fonts[djOne];
  const fontTwo = fonts[djTwo];

  fontOne.x = 700;
  fontOne.y = 5;

  fontTwo.x = 605;
  fontTwo.y = 405;
  fontTwo.xSpeed = -fontTwo.xSpeed;
  fontTwo.ySpeed = -fontTwo.ySpeed;

  initNameCanvas([fonts[djOne], fonts[djTwo]]);
}
