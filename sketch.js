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
      random(height - 120),
      data[i].tweet_text,
      data[i].classification.hostility_level,
      data[i].view_count,
      data[i].source_url,
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
    console.log(data.length);

    for (let i = start; i < data.length; i++) {
      fill(255);
      tweets[i].hostilityCheck();
      tweets[i].hover();
      tweets[i].display();
    }

    for (let i = start; i < data.length; i++) {
      tweets[i].interact();
    }
  }

  hover = false;
}

class tweet {
  constructor(x, y, text, classification, engagement, link) {
    this.x = x + 40;
    this.y = y + 40;
    this.text = text;
    this.class = classification;
    this.link = link;

    const engagementValue = Number(engagement);
    this.engagement = round(map(engagementValue, 0, 2000, 0, 70));
    if (isNaN(this.engagement)) {
      this.engagement = 0;
    }
    if (this.engagement > 70) {
      this.engagement = 70;
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
      this.textBoxHeight = (textWidth(this.text) / 300 + this.lineCount) * 60;
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

  interact() {
    if ( this.textBoxHeight > 600) {
        infoWidth = 600;
        this.textBoxHeight = (textWidth(this.text) / 600 + this.lineCount) * 60;
    }else{
infoWidth = 300;    
  }

    if (this.hoveredOver) {
      fill(255, 255, 255, 200);
      rect(this.infoX - 20, this.infoY - 20, infoWidth + 40, this.textBoxHeight + 200);
      fill(0);
      text(this.text, this.infoX, this.infoY, infoWidth);
      console.log(this.text);
      console.log("lines: " + this.textBoxHeight);
      console.log("new lines: " + this.lineCount);
      console.log("total text box height: " + this.textBoxHeight);
    }
  }

  link() {
    if (this.hoveredOver) {
      const url = `this.link`;
      window.open(url, "_blank");
    }
  }
}
