const {Engine, Render, Runner, World, Bodies, Body , Events} = Matter;

const cells = 6 ;
const width = 600;
const height = 600;
const unitLength = width / cells;

const engine = Engine.create ();
engine.world.gravity.y = 0;
const {world} = engine;
const render = Render.create ({
  element: document.body,
  engine: engine,
  options: {
    wireframes: true,
    width,
    height,
  },
});
Render.run (render);
Runner.run (Runner.create (), engine);

//walls

const walls = [
  Bodies.rectangle (width / 2, 0, width, 2, {isStatic: true}),
  Bodies.rectangle (0, height / 2, 2, height, {isStatic: true}),
  Bodies.rectangle (width, height / 2, 2, height, {isStatic: true}),
  Bodies.rectangle (width / 2, height, width, 2, {isStatic: true}),
];
World.add (world, walls);

const shuffle = arr => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor (Math.random () * counter);
    counter--;
    [arr[index], arr[counter]] = [arr[counter], arr[index]];
  }

  return arr;
};

//maze generation

const grid = Array (cells).fill (null).map (() => Array (cells).fill (false));

const verticals = Array (cells)
  .fill (null)
  .map (() => Array (cells - 1).fill (false));

const horizontals = Array (cells - 1)
  .fill (null)
  .map (() => Array (cells).fill (false));

const startRow = Math.floor (Math.random () * cells);
const startColumn = Math.floor (Math.random () * cells);

const iterateThroughCells = (row, column) => {
  //if i visited the cell at [row, column] then return
  if (grid[row][column]) {
    return;
  }

  //Mark this cell as being visited
  grid[row][column] = true;

  //assemble randomly-ordered list of neighbors
  const neighbors = shuffle ([
    [row - 1, column, 'up'],
    [row + 1, column, 'down'],
    [row, column - 1, 'left'],
    [row, column + 1, 'right'],
  ]);

  //for each neighbor ..
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;
    //see if that neghbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
    ) {
      continue;
    }

    //if we have visited that neighbor continue to next neighbor
    if (grid[nextRow][nextColumn]) {
      continue;
    }

    //remove a wall from either horizontals or verticals
    if (direction === 'left') {
      verticals[row][column - 1] = true;
    } else if (direction === 'right') {
      verticals[row][column] = true;
    } else if (direction === 'up') {
      horizontals[row - 1][column] = true;
    } else if (direction === 'down') {
      horizontals[row][column] = true;
    }

    iterateThroughCells (nextRow, nextColumn);
  }
  //visit that next cell
};

iterateThroughCells (startRow, startColumn);

horizontals.forEach ((row, indexRow) => {
  row.forEach ((open, indexColumn) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle (
      (indexColumn + 0.5) * unitLength,
      (indexRow + 1) * unitLength,
      unitLength,
      10,
      {
        label : 'wall',
        isStatic: true,
      }
    );
    World.add (world, wall);
  });
});

verticals.forEach ((row, indexRow) => {
  row.forEach ((open, indexColumn) => {
    if (open) return;

    const wall = Bodies.rectangle (
      (indexColumn + 1) * unitLength,
      (indexRow + 0.5) * unitLength,
      10,
      unitLength,
      {
        label : 'wall',
        isStatic: true,
      }
    );
    World.add (world, wall);
  });
});

// Goal

const goal = Bodies.rectangle (
  (cells - 0.5) * unitLength,
  (cells - 0.5) * unitLength,
  unitLength * 0.7,
  unitLength * 0.7,
  {
    label : 'goal',
    isStatic: true,
  }
);

World.add (world, goal);

// Ball

const ball = Bodies.circle (
  0.5 * unitLength,
  0.5 * unitLength,
  unitLength * 0.25,
  {
    label : 'ball'
  }
);

World.add (world, ball);

document.addEventListener ('keydown', event => {
  const {x, y} = ball.velocity;

  if (event.keyCode === 38) {
    //go up
    Body.setVelocity (ball, {x, y: y - 5});
  } else if (event.keyCode === 40) {
    //go down
    Body.setVelocity (ball, {x, y : y +5});
  } else if (event.keyCode === 39) {
    //go right
    Body.setVelocity (ball, {x: x + 5, y: y});
  } else if (event.keyCode === 37) {
    //go left
    Body.setVelocity (ball, {x: x - 5, y: y});
  }
});

//Won consition

Events.on(engine , 'collisionStart' , event => {
  event.pairs.forEach(collision => {
    const labels = ['ball' , 'goal'];

    if(labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)){
      world.gravity.y = 1;
      world.bodies.forEach(body =>{
        if(body.label === 'wall'){
          Body.setStatic(body , false);
        }
      });
    }

  });
});
