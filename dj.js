import { initNameCanvas } from "./canvas.js";

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let fonts = {
  abdi: {
    src: "assets/abdi-font.jpg",
    width: 500,
    height: 200,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
  naomi: {
    src: "assets/naomi-font.jpg",
    width: 500,
    height: 200,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
  clarisse: {
    src: "assets/viriss-font.jpg",
    width: 500,
    height: 200,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
  becca: {
    src: "assets/becca-font.jpg",
    width: 500,
    height: 200,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
  lc: {
    src: "assets/lc-font.jpg",
    width: 500,
    height: 200,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
  randy: {
    src: "assets/randy-font.jpg",
    width: 600,
    height: 250,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
  albertina: {
    src: "assets/albertina-font.jpg",
    width: 500,
    height: 200,
    xSpeed: 0.9,
    ySpeed: 0.9,
  },
  hiteca: {
    src: "assets/hiteca-font.jpg",
    width: 500,
    height: 200,
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
  fontTwo.y = 805;
  fontTwo.xSpeed = -fontTwo.xSpeed;
  fontTwo.ySpeed = -fontTwo.ySpeed;

  initNameCanvas([fonts[djOne], fonts[djTwo]]);
}

export function clearDjName() {
  const elOne = document.getElementById("dj-one");
  const elTwo = document.getElementById("dj-two");

  elOne.src = "";
  elTwo.src = "";
}
