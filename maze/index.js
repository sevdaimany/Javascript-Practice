const {Engine, Render, Runner, World, Bodies} = Matter;

const engine = Engine.create ();
const {world} = engine;
const width = 600;
const height = 600;

const render = Render.create ({
  element: document.body,
  engine: engine,
  options: {
    wireframes: true,
    width ,
    height,
  },
});

Render.run (render);
Runner.run (Runner.create (), engine);


//walls

const walls = [
  Bodies.rectangle (width /2, 0, width, 40, {isStatic: true}),
  Bodies.rectangle (0, height /2, 40, height, {isStatic: true}),
  Bodies.rectangle (width, height/2, 40, height, {isStatic: true}),
  Bodies.rectangle (width/2, height, width, 40, {isStatic: true}),
];
World.add(world, walls);
