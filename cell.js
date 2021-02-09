function Cell(xIndex, yIndex, width, state, age, context) {
  this.xIndex = xIndex;
  this.yIndex = yIndex;
  this.width = width;
  this.x = xIndex * width;
  this.y = yIndex * width;
  this.age = age;
  this.state = state;
  this.context = context;
}

Cell.prototype.show = function () {
  this.context.beginPath();
  if (this.state == States.ALIVE) {
    // if (this.age < 50) {
    //   this.context.fill(255);
    // } else if (this.age > 50 && this.age < 100) {
    //   this.context.fill(86, 227, 159);
    // } else if (this.age > 100) {
    //   this.context.fill(250, 25, 139);
    // }
    // this.context.stroke(0);
    // this.context.rect(this.x, this.y, this.width - 1, this.width - 1);
    this.context.fillStyle = "#000000";
  } else {
    this.context.fillStyle = "#FFF";
    // this.context.rect(this.x, this.y, this.width - 1, this.width - 1);
  }
  this.context.strokeStyle = "#000000";
  this.context.lineWidth = 1;
  this.context.rect(this.x, this.y, this.width - 1, this.width - 1);
  this.context.fill();
  this.context.stroke();
  this.context.closePath();
};

Cell.prototype.countNeighbors = function (maxX, maxY, grid, infiniteMap) {
  let countAlive = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let neighborX;
      let neighborY;
      if (infiniteMap) {
        neighborX = (this.xIndex + i + maxX) % maxX;
        neighborY = (this.yIndex + j + maxY) % maxY;
      } else {
        neighborX = (this.xIndex + i);
        neighborY = (this.yIndex + j);
      }

      if ((neighborX >= 0 && neighborX < maxX) && (neighborY >= 0 && neighborY < maxY)) {
        // console.log(neighborX, neighborY);
        if (grid[neighborX][neighborY].state == States.ALIVE) {
          countAlive++;
        }
      }
    }
  }

  if (this.state == States.ALIVE) {
    countAlive--;
  }

  return countAlive;
};

Cell.prototype.changeState = function () {
  if (this.state == States.ALIVE) {
    this.state = States.DEAD;
  } else {
    this.state = States.ALIVE;
  }

  this.show();
};
