let tweets = [];
let data;
let hover = false;
let infoWidth = 300;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(10);

  data = await loadJSON("tweetData.json");

  textFont("Arial");
  textSize(20); // set font BEFORE computing textWidth in constructors

  let gapCounts = new Array(144).fill(0);
  for (let i = 0; i < data.length; i++) {
    tweets[i] = new Tweet(
      data[i].tweet_text,
      data[i].classification.hostility_level,
      data[i].view_count,
      data[i].source_url,
      data[i].tweet_created_at,
      gapCounts,
    );
  }
}

function draw() {
  background(0);
  textFont("Arial");
  textSize(20);
  textAlign(LEFT);

  hover = false;

  for (let i = 0; i < tweets.length; i++) {
    tweets[i].update(); // hover check
    tweets[i].display();
  }

  // Interact (tooltip) drawn on top, after all tweets
  let hoverDisplayIndex = 0;
  for (let i = 0; i < tweets.length; i++) {
    hoverDisplayIndex = tweets[i].interact(hoverDisplayIndex);
  }
}

// Open link on click only — not every frame
function mousePressed() {
  for (let i = 0; i < tweets.length; i++) {
    if (tweets[i].hoveredOver) {
      const url =
        "https://x.com/search?q=" + tweets[i].text + "&src=typed_query&f=top";
      window.open(url, "_blank");
      break; // only open one
    }
  }
}

class Tweet {
  constructor(text, classification, engagement, link, time, gapCounts) {
    this.time = time.substring(11, 20);
    this.hours = Number(this.time.substring(0, 2));
    this.minutes = Number(this.time.substring(3, 5));
    this.seconds = Number(this.time.substring(6, 8));
    this.timeValue = this.hours * 3600 + this.minutes * 60 + this.seconds;

    this.gapIndex = constrain(
      Math.floor((this.hours * 60 + this.minutes) / 10),
      0,
      143,
    );
    this.x = map(this.gapIndex, 0, 143, 100, width - 100);

    const slotSize = width / 144;
    this.y = height - 100 - gapCounts[this.gapIndex] * slotSize;
    gapCounts[this.gapIndex]++;

    this.text = text;
    this.class = classification;
    this.link = link;
    this.size = (width - 500) / 144;
    this.colValue = map(this.class, 0, 3, 255, 0);

    const engagementValue = Number(engagement);
    this.engagement = constrain(
      round(map(engagementValue, 0, 2000, 4, 50)),
      0,
      50,
    );
    if (isNaN(this.engagement)) this.engagement = 0;

    this.hoveredOver = false;
    this.infoX = width / 12;
    this.infoY = height / 4;

    this.lineCount = (this.text.match(/\n/g) || []).length;
    this.textBoxHeight =
      (textWidth(this.text) / 300 + this.lineCount) * 60 + 220;
  }

  update() {
    this.hoveredOver =
      mouseX > this.x &&
      mouseX < this.x + this.size &&
      mouseY > this.y &&
      mouseY < this.y + this.size;
    if (this.hoveredOver) hover = true;
  }

  display() {
    noStroke();
    fill(255, this.colValue, this.colValue);
    rect(this.x, this.y, this.size, this.size);
  }

  interact(hoverDisplayIndex) {
    if (!this.hoveredOver) return hoverDisplayIndex;

    let iw = this.textBoxHeight > 600 ? 600 : 300;
    let th =
      this.textBoxHeight > 600
        ? (textWidth(this.text) / 600 + this.lineCount) * 60
        : this.textBoxHeight;

    fill(255, this.colValue, this.colValue);
    strokeWeight(2);
    stroke(255, 0, 0);
    rect(this.infoX, this.infoY, iw + 40, th);
    line(
      this.infoX + iw,
      this.infoY + th,
      this.x + this.size / 2,
      this.y + this.size / 2,
    );

    fill(0);
    noStroke();
    text(this.text, this.infoX + 20, this.infoY + 20, iw);

    return hoverDisplayIndex + 1;
  }
}
