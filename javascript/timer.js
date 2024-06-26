const timerElement = document.getElementById("timer");

export const initialCountdownTime = 10;

let countdownTime = initialCountdownTime;

export function resetTimer() {
  countdownTime = initialCountdownTime;
}

export function updateTimer(cb) {
  const hours = Math.floor(countdownTime / 3600);
  const minutes = Math.floor((countdownTime % 3600) / 60);
  const seconds = countdownTime % 60;

  timerElement.textContent = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  countdownTime--;

  if (countdownTime < 0) {
    timerElement.textContent = "";
    cb();
    countdownTime = initialCountdownTime;
  }
}
