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

  // Track how many tweets have landed in each 10-min gap column
  let gapCounts = new Array(144).fill(0);

  for (let i = 0; i < data.length; i++) {
    tweets[i] = new tweet(
      data[i].tweet_text,
      data[i].classification.hostility_level,
      data[i].view_count,
      data[i].source_url,
      data[i].tweet_created_at,
      gapCounts, // pass the shared counter in
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
      // tweets[i].getTenMinuteGap();
      // tweets[i].getXFromGap();
      tweets[i].hostileColourValue();
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

// tweet class
//
// ---------------------------------------------------------------------------------------------------------------------

class tweet {
  constructor(text, classification, engagement, link, time, gapCounts) {
    this.time = time.substring(11, 20);
    this.hours = this.time.substring(0, 2);
    this.minutes = this.time.substring(3, 5);
    this.seconds = this.time.substring(6, 8);
    this.timeValue =
      Number(this.hours) * 3600 +
      Number(this.minutes) * 60 +
      Number(this.seconds);

    this.gapIndex = this.getTenMinuteGap();
    this.x = this.getXFromGap();

    const slotSize = width / 144;
    const slotInColumn = gapCounts[this.gapIndex];
    const yy = slotInColumn * slotSize; // stack downward within band
    //  + map(classification, 0, 3, 0, 1) * (height - 200);
    this.y = height - 100 - yy;
    gapCounts[this.gapIndex]++; // increment for next tweet in this gap

    // this.x = map(this.timeValue, 0, 86400, 0, width);
    // this.x = this.getXFromGap();

    // this.y = map(classification, 0, 3, 100, height - 100);
    // this.y = y;
    this.text = text;
    this.class = classification;
    this.link = link;
    this.size = (width - 500) / 144;

    const engagementValue = Number(engagement);
    this.engagement = round(map(engagementValue, 0, 2000, 4, 50));
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

  hostileColourValue() {
    let colValue = map(this.class, 0, 3, 255, 0);
    fill(255, colValue, colValue);
  }

  getTenMinuteGap() {
    const totalMinutes = Number(this.hours) * 60 + Number(this.minutes);
    const gapIndex = Math.floor(totalMinutes / 10);
    return constrain(gapIndex, 0, 143);
  }

  getXFromGap() {
    const gapIndex = this.getTenMinuteGap();
    return map(gapIndex, 0, 143, 100, width - 100);
  }

  // Display function to display tweets as rectangles with size based on engagement, with the x position based on the time of the tweet.
  // The color of the rectangle is based on the hostility classification of the tweet.
  //
  display() {
    noStroke();
    rect(this.x, this.y, this.size, this.size);
  }

  // display() {
  //   noStroke();
  //   rect(this.x, this.y, 2, 300);
  // }

  hover() {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.size &&
      mouseY > this.y &&
      mouseY < this.y + this.size
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

  // interact() {
  //   if (this.textBoxHeight > 600) {
  //     infoWidth = 600;
  //     this.textBoxHeight = (textWidth(this.text) / 600 + this.lineCount) * 60;
  //   } else {
  //     infoWidth = 300;
  //   }

  //   if (this.hoveredOver) {
  //     fill(255, 255, 255, 200);
  //     rect(
  //       this.infoX - 20,
  //       this.infoY - 20,
  //       infoWidth + 40,
  //       this.textBoxHeight,
  //     );
  //     fill(0);
  //     text(this.text, this.infoX, this.infoY, infoWidth);
  //     console.log(this.text);
  //     console.log(this.time);
  //     console.log(this.hours, this.minutes, this.seconds);
  //     console.log(this.timeValue);
  //   }
  // }

  interact() {
    if (this.textBoxHeight > 600) {
      infoWidth = 600;
      this.textBoxHeight = (textWidth(this.text) / 600 + this.lineCount) * 60;
    } else {
      infoWidth = 300;
    }

    if (this.hoveredOver) {
      this.hostileColourValue();
      strokeWeight(2);
      stroke(255, 0, 0);

      rect(200, 300, infoWidth + 40, this.textBoxHeight);
      line(
        200 + infoWidth,
        300 + this.textBoxHeight,
        this.x + this.size / 2,
        this.y + this.size / 2,
      );
      fill(0);
      noStroke();
      text(this.text, 200 + 20, 300 + 20, infoWidth);
    }
  }

  // -------------------------------------------------------------------------------------------------
  //
  // interact funciton to display tweet text based off of the chronologically displayed order.
  //
  // -------------------------------------------------------------------------------------------------
  //
  // interact(displayIndex) {
  //   infoWidth = width - 400;
  //
  //   if (this.hoveredOver) {
  //     let yPos = 700;
  //     let xPos = 100 + displayIndex * 300;
  //     if (this.class > 0) {
  //       fill(255, 50, 50);
  //     } else {
  //       fill(255);
  //     }
  //     text(this.text, xPos, yPos, 250);
  //     displayIndex++;
  //   }
  //   return displayIndex;
  // }

  linkOnClick() {
    if (this.hoveredOver) {
      ``;
      const url =
        "https://x.com/search?q=" + this.text + "&src=typed_query&f=top";
      window.open(url, "_blank");
    }
  }
}
