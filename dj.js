export function updateDjName(djOne, djTwo) {
  const elOne = document.getElementById("dj-one");
  const elTwo = document.getElementById("dj-two");

  elOne.textContent = djOne;
  elTwo.textContent = djTwo;
}

export function clearDjName() {
  const elOne = document.getElementById("dj-one");
  const elTwo = document.getElementById("dj-two");

  elOne.textContent = "";
  elTwo.textContent = "";
}
