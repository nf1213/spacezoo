function Grid(size) {
  this.size = size;
  this.cell_size = 100;
  this.score = 0;

  this.initial = function() {
    var cells = [];

    for (var x = 0; x < this.size; x++) {
      var row = cells[x] = [];

      for (var y = 0; y < this.size; y++) {
        row.push(null);
      }
    }

    return cells;
  }

  this.cells = this.initial();

  this.pickShape = function() {
    var shapes = ['blob', 'eystalk', 'fourleg', 'monsterball', 'snake'];
    var level = [0, 300, 700, 2000]

    if(this.score >= level[3]) {
      shapes = shapes.slice(0, 5)
    }
    else if(this.score >= level[2]) {
      shapes = shapes.slice(0, 4)
    }
    else if(this.score >= level[1]) {
      shapes = shapes.slice(0, 3)
    }
    else {
      shapes = shapes.slice(0, 2)
    }

    var rand = Math.floor(Math.random() * shapes.length);
    return shapes[rand];
  }

  this.available_cells = function() {
    var available = [];
    for(var i = 0; i < this.size; i++) {
      for(var j = 0; j < this.size; j++) {
        if(!this.cells[i][j]) {
          available.push({i: i, j: j});
        }
      }
    }
    return available;
  }

  this.generate_new_shape = function() {
    var available = this.available_cells();
    var rand = Math.floor(Math.random() * available.length);
    var space = available[rand];
    shape = new Shape(this.cell_size, this.pickShape());
    this.cells[space.i][space.j] = shape;
  }

  this.generate_new_shape();
  this.generate_new_shape();

  this.threes = function() {
    this.cells = this.findThrees(this.cells);
    this.cells = this.transform(this.cells);
  }

  this.transform = function(array) {
    cellArray = array;
    for(var i=0; i < this.size; i++) {
      for(var j=0; j < this.size; j++) {
        try {
          left = j - 1;
          right = j + 1;
          if(cellArray[j][i].equals(cellArray[left][i]) && cellArray[j][i].equals(cellArray[right][i])) {
            cellArray[j][i] = null;
            cellArray[right][i] = null;
            cellArray[left][i] = null;
            this.score = this.score + 100;
          }
        }
        catch(err) {

        }
      }
    }

    return cellArray;
  }

  this.findThrees = function(array) {
    cellArray = array;
    for(var i=0; i < this.size; i++) {
      for(var j=0; j < this.size; j++) {
        try {
          left = j - 1;
          right = j + 1;
          if(cellArray[i][j].equals(cellArray[i][left]) && cellArray[i][j].equals(cellArray[i][right])) {
            cellArray[i][j] = null;
            cellArray[i][right] = null;
            cellArray[i][left] = null;
            this.score = this.score + 100;
          }
        }
        catch(err) {
        }
      }
    }

    return cellArray;
  }
}
