function Grid(maxX, maxY, infiniteMap) {
  this.maxX = maxX;
  this.maxY = maxY;
  this.resolution;
  this.grid;
  this.canvas = document.getElementById("grid");
  this.context;
  this.infiniteMap= infiniteMap;

  this.buildGrid();
  this.addEvents();
}

Grid.prototype.buildGrid = function () {
  // debugger;
  this.grid = make2DArray(this.maxX, this.maxY);
  this.canvas = document.getElementById("grid");
  this.canvas.setAttribute("width", this.canvas.offsetWidth);
  this.canvas.setAttribute("height", this.canvas.offsetWidth);
  this.context = this.canvas.getContext("2d");
  this.resolution = this.canvas.offsetWidth / this.maxY;

  this.printGrid(true, false);
};

Grid.prototype.addEvents = function () {
  let _this = this;
  let pressed = false;
  let lastPressed = { x: null, y: null};
  let playing = false;
  let interval;

  let changeState = function (evt) {
    if (pressed) {
      let x = Math.floor(evt.offsetX / _this.resolution);
      let y = Math.floor(evt.offsetY / _this.resolution);
      if( x < _this.maxX * _this.resolution && y < _this.maxY * _this.resolution ) {
        if (x !== lastPressed.x || y !== lastPressed.y) {
          _this.grid[x][y].changeState();
          lastPressed.x = x;
          lastPressed.y = y;
        }
      }
    }
  };

  let stopChangeState = function () {
    pressed = false;
    lastPressed.x = null;
    lastPressed.y = null;
  };

  this.canvas.addEventListener("mousedown", function (evt) {
    pressed = true;
    changeState(evt);
  });

  this.canvas.addEventListener("mousemove", function (evt) {
    changeState(evt);
  });
  this.canvas.addEventListener("mouseup", stopChangeState);
  this.canvas.addEventListener("mouseleave", stopChangeState);

  let playButton = document.getElementById('playButton');
  let resetButton = document.getElementById('resetButton');
  let randomButton = document.getElementById('randomButton');

  playButton.addEventListener('click', () => {
    if(!playing) {
      playing = true;
      playButton.innerText = 'Pause';
      interval = setInterval(() => {
        this.nextGeneration();
      }, 500);
    } else {
      playing = false;
      playButton.innerText = 'Play';
      clearInterval(interval);
      interval = null;
    }
  });

  resetButton.addEventListener('click', () => {
    if(interval) {
      clearInterval(interval);
      interval = null;
    }
    this.printGrid(true);
    playing = false;
    playButton.innerText = 'Play';

  });

  randomButton.addEventListener('click', () => {
    this.printGrid(true, true);
  });

};

Grid.prototype.nextGeneration = function() {
  let next = make2DArray(this.maxX, this.maxY);

  // Compute next based on grid
  for (let i = 0; i < this.maxX; i++) {
    for (let j = 0; j < this.maxY; j++) {
      // let state = grid[i][j].state;
      let state = this.grid[i][j].state;
      // Count live neighbors!
      // let neighbors = grid[i][j].countNeighbors();
      let neighbors = this.grid[i][j].countNeighbors(this.maxX, this.maxY, this.grid);
      if (state == 0 && neighbors == 3) {
        next[i][j] = new Cell(i, j, this.resolution, States.ALIVE, 0, this.context);
      } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = new Cell(i, j, this.resolution, States.DEAD, 0, this.context);
      } else {
        let age = 0;
        if (this.grid[i][j].state == States.ALIVE) {
          age = this.grid[i][j].age + 1;
        }
        next[i][j] = new Cell(i, j, this.resolution, this.grid[i][j].state, age, this.context);
      }
    }
  }

  this.grid = next;
  this.printGrid(false, false);
}

Grid.prototype.printGrid = function(createCell, random) {
  for (let i = 0; i < this.maxX; i++) {
    for (let j = 0; j < this.maxY; j++) {
      if(createCell) {
        let state = random ? Math.floor(Math.random() * (2)) : States.DEAD;
        this.grid[i][j] = new Cell(i, j, this.resolution, state, 0, this.context);
      }
      this.grid[i][j].show();
    }
  }
}
