const fonts = {
  abdi: "assets/abdi-font.jpg",
  naomi: "assets/naomi-font.jpg",
  clarisse: "assets/viriss-font.jpg",
  becca: "assets/becca-font.jpg",
  lc: "assets/lc-font.jpg",
  randy: "assets/randy-font.jpg",
  albertina: "assets/albertina-font.jpg",
  hiteca: "assets/hiteca-font.jpg",
};

export function updateDjName(djOne, djTwo) {
  const elOne = document.getElementById("dj-one");
  const elTwo = document.getElementById("dj-two");

  elOne.src = fonts[djOne];
  elTwo.src = fonts[djTwo];
}

export function clearDjName() {
  const elOne = document.getElementById("dj-one");
  const elTwo = document.getElementById("dj-two");

  elOne.src = "";
  elTwo.src = "";
}
