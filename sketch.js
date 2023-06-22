// Variable declaration
let thinFont;
let font;
let video;
let videoReady = false;
let clicked = false;
let correctGuess = false;
let timer = 1;
let showMoreTriangles = false;
let clickedShapeX = null;
let clickedShapeY = null;
let shapes = ["triangle", "ellipse", "rectangle"];
let backgroundColor = "#C92D1F"; // Background color

let audio;

// Preload function
function preload() {
  thinFont = loadFont("PPNeueMontreal-Thin.otf");
  font = loadFont("PPNeueMontreal-Book.otf");
  video = createVideo(["01.mp4"], videoLoaded);
  video.hide();
  video.loop();
  video.onended(showVideo02);
  audio = loadSound("audio.mp3"); // Load the audio file
}

// Video loaded callback
function videoLoaded() {
  videoReady = true;
}

// Show video 02
function showVideo02() {
  video02.show();
  video02.loop();
  video02.elt.style.opacity = "0.5";
}

// Setup function
function setup() {
  createCanvas(519, 842);
  background(backgroundColor); // Change background color
  stroke("#FFF5E4");
  strokeWeight(0.2);

  video02 = createVideo(["02.mp4"]);
  video02.size(width, height);
  video02.hide();
  video02.position(0, 0);
}

// Draw function
function draw() {
  background(backgroundColor); // Change background color

  if (videoReady) {
    image(video, 0, 0, width, height);
  }

  // Grid with dots
  for (let y = 0; y < height; y += 40) {
    line(0, y, width, y);
    for (let x = 0; x < width; x += 40) {
      stroke("#FFF5E4");
      line(x, y, x, y + 40);
      line(x, y, x + 40, y);
      fill("#FFF5E4");
      let pointX = x + 20;
      let pointY = y + 20;
      let pointSize = 0.3;
      ellipse(pointX, pointY, pointSize, pointSize);
    }
  }

  // Drawing numbers on axes
  fill("#FFF5E4");
  textSize(12);
  textAlign(CENTER, CENTER);

  for (let x = 0; x <= width; x += 40) {
    let circleX = x + 20;
    let circleY = 20;
    let radius = 15;
    let lineLength = 7;

    noFill();
    stroke("#FFF5E4");
    ellipse(circleX, circleY, radius * 2);
    line(circleX - lineLength, circleY, circleX + lineLength, circleY);
    line(circleX, circleY - lineLength, circleX, circleY + lineLength);

    fill("#FFF5E4");
    noStroke();
    text(x / 40, circleX, circleY);
  }

  for (let y = 0; y <= height; y += 40) {
    let circleX = 20;
    let circleY = y + 20;
    let radius = 15;
    let lineLength = 7;

    noFill();
    stroke("#FFF5E4");
    ellipse(circleX, circleY, radius * 2);
    line(circleX - lineLength, circleY, circleX + lineLength, circleY);
    line(circleX, circleY - lineLength, circleX, circleY + lineLength);

    fill("#FFF5E4");
    noStroke();
    text(y / 40, circleX, circleY);
  }

  // Display text
  if (correctGuess) {
    fill("#FFF5E4");
    textSize(30);
    textFont(font);
    textAlign(CENTER, CENTER);
    text("CORRECT!", width / 2, height / 2);
  } else {
    fill("#FFF5E4");
    textSize(30);
    textFont(font);
    textAlign(CENTER, CENTER);
    text("NEW WEBSITE COMING SOON", width / 2, height / 2);

    if (clicked && !correctGuess) {
      fill("#C92D1F"); // Change the color to #C92D1F
      textSize(22);
      textFont(thinFont);
      textAlign(CENTER, CENTER);
      let guessText = "GUESS AGAIN";
      push();
      translate(width - 60, 600); // Adjusted translation values
      rotate(-HALF_PI);
      text(guessText, 0, 0);
      pop();
    } else {
      fill("#FFF5E4");
      textSize(22);
      textFont(thinFont);
      textAlign(CENTER, CENTER);
      let guessText = "GUESS THE DATE";
      push();
      translate(width - 60, 600); // Adjusted translation values
      rotate(-HALF_PI);
      text(guessText, 0, 0);
      pop();
    }
  }

  // Handle mouse click
  if (mouseIsPressed && !clicked) {
    let clickedRow = Math.floor(mouseY / 40);
    let clickedColumn = Math.floor(mouseX / 40);
    let targetRow = 12; // Target row
    let targetColumn = 6; // Target column

    if (clickedRow === targetRow && clickedColumn === targetColumn) {
      clicked = true;
      correctGuess = true;

      // Start turning the grid red pixel by pixel
      let pixels = get(); // Get the current pixels on the canvas

      for (let y = 0; y < height; y += 40) {
        for (let x = 0; x < width; x += 40) {
          if (pixels.get(x, y)[0] === 255) {
            setTimeout(() => {
              set(x, y, color(201, 45, 31)); // Change the pixel color to red
              updatePixels();
            }, timer);
            timer += 1;
          }
        }
      }
    } else {
      clicked = true;
      correctGuess = false;
      clickedShapeX = clickedColumn;
      clickedShapeY = clickedRow;
    }
  } else if (!mouseIsPressed) {
    clicked = false;
  }

  // Case of correct guess
  if (correctGuess) {
    // Play the audio file when the correct part is clicked
    audio.play();
  }

  // Case of showing additional video
  if (showMoreTriangles && millis() - timer <= 2000) {
    video02.show();
    video02.loop();
  }

  // Show clicked shape
  if (clickedShapeX !== null && clickedShapeY !== null) {
    fill(backgroundColor); // Change shape color
    //stroke("#F44336");
    let shapeX = clickedShapeX * 40;
    let shapeY = clickedShapeY * 40;
    let shapeSize = 40;

    if (shapes[clickedShapeX % 3] === "triangle") {
      triangle(
        shapeX + shapeSize / 2,
        shapeY + shapeSize,
        shapeX,
        shapeY,
        shapeX + shapeSize,
        shapeY
      );
    } else if (shapes[clickedShapeX % 3] === "ellipse") {
      ellipse(shapeX + shapeSize / 2, shapeY + shapeSize / 2, shapeSize);
    } else if (shapes[clickedShapeX % 3] === "rectangle") {
      rect(shapeX, shapeY, shapeSize, shapeSize);
    }
  }
}

// Mouse clicked event
function mouseClicked() {
  if (correctGuess) {
    showMoreTriangles = true;
    timer = millis();
  }
}
