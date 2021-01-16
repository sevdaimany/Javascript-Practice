maze ();

function maze () {
  const {Engine, Render, Runner, World, Bodies, Body, Events} = Matter;

  const cellsHorizontal = 14;
  const cellsVertical = 10;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const unitLengthX = width / cellsHorizontal;
  const unitLengthY = height / cellsVertical;

  const engine = Engine.create ();
  engine.world.gravity.y = 0;
  const {world} = engine;
  const render = Render.create ({
    element: document.body,
    engine: engine,
    options: {
      wireframes: false,
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

  const grid = Array (cellsVertical)
    .fill (null)
    .map (() => Array (cellsHorizontal).fill (false));

  const verticals = Array (cellsVertical)
    .fill (null)
    .map (() => Array (cellsHorizontal - 1).fill (false));

  const horizontals = Array (cellsVertical - 1)
    .fill (null)
    .map (() => Array (cellsHorizontal).fill (false));

  const startRow = Math.floor (Math.random () * cellsVertical);
  const startColumn = Math.floor (Math.random () * cellsHorizontal);

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
        nextRow >= cellsVertical ||
        nextColumn < 0 ||
        nextColumn >= cellsHorizontal
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
        (indexColumn + 0.5) * unitLengthX,
        (indexRow + 1) * unitLengthY,
        unitLengthX,
        10,
        {
          label: 'wall',
          isStatic: true,
          render: {
            fillStyle: 'red',
          },
        }
      );
      World.add (world, wall);
    });
  });

  verticals.forEach ((row, indexRow) => {
    row.forEach ((open, indexColumn) => {
      if (open) return;

      const wall = Bodies.rectangle (
        (indexColumn + 1) * unitLengthX,
        (indexRow + 0.5) * unitLengthY,
        10,
        unitLengthY,
        {
          label: 'wall',
          isStatic: true,
          render: {
            fillStyle: 'red',
          },
        }
      );
      World.add (world, wall);
    });
  });

  // Goal

  const goal = Bodies.rectangle (
    (cellsHorizontal - 0.5) * unitLengthX,
    (cellsVertical - 0.5) * unitLengthY,
    unitLengthX * 0.7,
    unitLengthY * 0.7,
    {
      label: 'goal',
      isStatic: true,
      render: {
        fillStyle: 'green',
      },
    }
  );

  World.add (world, goal);

  // Ball

  const ballRadius = Math.min (unitLengthX, unitLengthY) / 4;
  const ball = Bodies.circle (
    0.5 * unitLengthX,
    0.5 * unitLengthY,
    ballRadius,
    {
      label: 'ball',
      render: {
        fillStyle: 'CornflowerBlue',
      },
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
      Body.setVelocity (ball, {x, y: y + 5});
    } else if (event.keyCode === 39) {
      //go right
      Body.setVelocity (ball, {x: x + 5, y: y});
    } else if (event.keyCode === 37) {
      //go left
      Body.setVelocity (ball, {x: x - 5, y: y});
    }
  });

  //Won consition

  Events.on (engine, 'collisionStart', event => {
    event.pairs.forEach (collision => {
      const labels = ['ball', 'goal'];

      if (
        labels.includes (collision.bodyA.label) &&
        labels.includes (collision.bodyB.label)
      ) {
        world.gravity.y = 1;

        document.querySelector ('.winner').classList.remove ('hidden');
        document.querySelector ('button').addEventListener ('click', event => {
          render.canvas.remove ();
          render.canvas = null;
          render.context = null;
          render.textures = {};
          document.querySelector ('.winner').classList.add('hidden');
          maze ();
        });

        world.bodies.forEach (body => {
          if (body.label === 'wall') {
            Body.setStatic (body, false);
          }
        });
      }
    });
  });
}
