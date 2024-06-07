export function initNameCanvas(backgroundImages) {
  const canvas = document.getElementById("name-canvas");
  const context = canvas.getContext("2d");

  const draw = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    context.fillStyle = "transparent";
    context.fillRect(0, 0, canvas.width, canvas.height);

    backgroundImages.forEach((backgroundImage, index) => {
      const { src, width, height } = backgroundImage;
      let { x, y, xSpeed, ySpeed } = backgroundImage;
      x = x + xSpeed;
      y = y + ySpeed;

      const image = new Image(width, height);
      image.src = src;

      if (x > canvas.width - image.width || x < 0) {
        xSpeed = -xSpeed;
      }
      if (y > canvas.height - image.height || y < 0) {
        ySpeed = -ySpeed;
      }

      context.drawImage(image, x, y, width, height);
      backgroundImage.x = x;
      backgroundImage.y = y;
      backgroundImage.xSpeed = xSpeed;
      backgroundImage.ySpeed = ySpeed;
    });

    window.requestAnimationFrame(draw);
  };
  const scaleCanvas = () => {
    const dpi = window.devicePixelRatio;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    context.scale(dpi, dpi);
  };
  scaleCanvas();
  window.requestAnimationFrame(draw);
}
