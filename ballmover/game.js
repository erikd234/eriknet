window.addEventListener("DOMContentLoaded", () => {
  console.log("Dom Conent Loaded");
  // Define Game Globals.
  window.GameOver = false;
  window.MoveDirection = "None";

  // Define Game Objects:
  class Circle {
    constructor(ctx, x, y) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
    }

    fillCircle(x, y, radius, fillColor) {
      this.ctx.beginPath(); // Start a new path
      this.ctx.arc(x, y, radius, 0, Math.PI * 2, true); // Create an arc for the circle
      this.ctx.fillStyle = fillColor; // Set the fill color
      this.ctx.fill(); // Fill the circle with the specified color
    }
  }
  // Sets movement direction for the ball
  function handleKeyPress(event) {
    switch (event.key) {
      case "h":
        console.log("h key pressed");
        window.MoveDirection = "LEFT";
        break;
      case "j":
        console.log("j key pressed");
        window.MoveDirection = "DOWN";
        break;
      case "k":
        console.log("k key pressed");
        window.MoveDirection = "UP";
        break;
      case "l":
        console.log("l key pressed");
        window.MoveDirection = "RIGHT";
        break;
      default:
        // Handle other keys if needed
        break;
    }
  }

  function init() {
    const canvas = document.getElementById("gamecanvas");
    if (!canvas.getContext) {
      return console.log("Error Loading Failure");
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const ctx = canvas.getContext("2d");
    // Test drawing. make a rectangle
    const circle = new Circle(ctx);
    circle.fillCircle(centerX, centerY, 100, "red");
    document.addEventListener("keypress", handleKeyPress);
  }
  window.addEventListener("load", init);
});
