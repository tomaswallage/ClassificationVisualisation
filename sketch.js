let tweets = [];
let start = 0,
  end;
let hover = false;
let infoWidth = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(8);

  if (data) {
    console.log("data loaded successfully");
  }

  for (let i = 0; i < data.length; i++) {
    tweets[i] = new tweet(
      random(width - 120),
      //   random(height - 120),
      random(200, 600),
      data[i].tweet_text,
      data[i].classification.hostility_level,
      data[i].view_count,
      data[i].source_url,
      data[i].tweet_created_at,
    );
  }
}

function draw() {
  background(0);

  textFont("Arial");
  textSize(20);
  fill(255);
  textAlign(LEFT);

  if (data) {
    for (let i = start; i < data.length; i++) {
      fill(255);
      tweets[i].hostilityCheck();
      tweets[i].hover();
      tweets[i].display();
      tweets[i].linkOnClick();
    }

    let hoverDisplayIndex = 0;
    for (let i = start; i < data.length; i++) {
      hoverDisplayIndex = tweets[i].interact(hoverDisplayIndex);
    }
  }

  hover = false;
}

class tweet {
  constructor(x, y, text, classification, engagement, link, time) {
    this.time = time.substring(11, 20);
    this.hours = this.time.substring(0, 2);
    this.minutes = this.time.substring(3, 5);
    this.seconds = this.time.substring(6, 8);
    this.timeValue =
      Number(this.hours) * 3600 +
      Number(this.minutes) * 60 +
      Number(this.seconds);

    this.x = map(this.timeValue, 0, 86400, 0, width - 120);
    // this.x = x + 40;
    this.y = y;
    this.text = text;
    this.class = classification;
    this.link = link;

    const engagementValue = Number(engagement);
    this.engagement = round(map(engagementValue, 0, 2000, 0, 50));
    if (isNaN(this.engagement)) {
      this.engagement = 0;
    }
    if (this.engagement > 50) {
      this.engagement = 50;
    }

    this.hoveredOver = false;
    this.infoX = map(this.x, 0, width, 50, width - 400);
    this.infoY = map(this.y, 0, height, 50, height - 400);

    let lineCountLoop = 0;
    for (let i = 0; i < this.text.length; i++) {
      if (this.text[i] === "\n") {
        lineCountLoop++;
      }
      this.lineCount = lineCountLoop;
      this.textBoxHeight =
        (textWidth(this.text) / 300 + this.lineCount) * 60 + 220;
      // this.gap = (textWidth(this.text) / (width - 300) + this.lineCount) * 60 + 220;
    }
  }

  hostilityCheck() {
    if (this.class == 0) {
      fill(255, 220, 220);
    } else if (this.class == 1) {
      fill(255, 150, 150);
    } else if (this.class == 2) {
      fill(255, 75, 75);
    } else {
      fill(255, 0, 0);
    }
  }

  display() {
    rect(this.x, this.y, this.engagement, this.engagement);
  }

  hover() {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.engagement &&
      mouseY > this.y &&
      mouseY < this.y + this.engagement
    ) {
      this.hoveredOver = true;
      hover = true;
    } else {
      this.hoveredOver = false;
    }
  }

  // -------------------------------------------------------------------------------------------------
  //
  // interact function with normal text boxes that pop up on hover with a white background and black text,
  // with the text box size adjusting based on the length of the text. If the text box height exceeds 600 pixels,
  // the width is set to 600 pixels and the height is adjusted accordingly. If the text box height is less than or equal to 600 pixels,
  //  the width is set to 300 pixels. The text box is positioned near the tweet that is being hovered over.
  //
  // -------------------------------------------------------------------------------------------------

  //   interact() {
  //     if (this.textBoxHeight > 600) {
  //       infoWidth = 600;
  //       this.textBoxHeight = (textWidth(this.text) / 600 + this.lineCount) * 60;
  //     } else {
  //       infoWidth = 300;
  //     }

  //     if (this.hoveredOver) {
  //       fill(255, 255, 255, 200);
  //       rect(
  //         this.infoX - 20,
  //         this.infoY - 20,
  //         infoWidth + 40,
  //         this.textBoxHeight,
  //       );
  //       fill(0);
  //       text(this.text, this.infoX, this.infoY, infoWidth);
  //       console.log(this.text);
  //       console.log(this.time);
  //       console.log(this.hours, this.minutes, this.seconds);
  //       console.log(this.timeValue);
  //     }
  //   }

  // -------------------------------------------------------------------------------------------------
  //
  // interact funciton to display tweet text based off of the chronologically displayed order.
  //
  // -------------------------------------------------------------------------------------------------

  interact(displayIndex) {
    infoWidth = width - 400;

    if (this.hoveredOver) {
      let yPos = 700;
      let xPos = 100 + displayIndex * 300;
      if (this.class > 0) {
        fill(255, 50, 50);
      } else {
        fill(255);
      }
      text(this.text, xPos, yPos, 250);
      displayIndex++;
    }
    return displayIndex;
  }

  linkOnClick() {
    if (this.hoveredOver) {
      ``;
      const url =
        "https://x.com/search?q=" + this.text + "&src=typed_query&f=top";
      window.open(url, "_blank");
    }
  }
}
