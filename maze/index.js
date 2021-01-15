const {Engine, Render, Runner , World, Bodies} = Matter;

const engine = Engine.create();
const {world} = engine;

const render = Render.create({
    element : document.body,
    engine : engine,
    option : {
        width : 800 ,
        height : 400,
    }
});

Render.run(render);
Runner.run(Runner.create() , engine);