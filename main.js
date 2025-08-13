$(document).ready(function () {
  $(".stream-container").ripples({
    resolution: 512,
    dropRadius: 20,
    perturbance: 0.04,
  });

  const Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Runner = Matter.Runner,
    Events = Matter.Events;

  const container = document.querySelector(".stream");
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const engine = Engine.create({
    gravity: { y: 0 },
  });
  const world = engine.world;

  const streamItems = document.querySelectorAll(".stream-item");
  const bodies = [];

  streamItems.forEach((el, i) => {
    const width = el.clientWidth;
    const height = el.clientHeight;

    const body = Bodies.rectangle(
      containerWidth + 200 + i * 150,
      Math.random() * containerHeight,
      width,
      height,
      {
        frictionAir: 0.1,
        restitution: 0.3,
        angle: 0.2 * Math.random() * Math.PI * 2,
      },
    );
    body.waveOffset = Math.random() * Math.PI * 2;

    body.domElement = el;
    bodies.push(body);
  });

  World.add(world, bodies);

  const wallOptions = { isStatic: true, render: { visible: false } };
  World.add(world, [
    Bodies.rectangle(containerWidth / 2, -10, containerWidth, 20, wallOptions),
    Bodies.rectangle(
      containerWidth / 2,
      containerHeight + 10,
      containerWidth,
      20,
      wallOptions,
    ),
  ]);

  let hoveredBody = null;

  streamItems.forEach((el, i) => {
    const body = bodies[i];

    el.addEventListener("mouseenter", () => {
      hoveredBody = body;
      Matter.Body.setStatic(body, true);
    });

    el.addEventListener("mouseleave", () => {
      hoveredBody = null;
      Matter.Body.setStatic(body, false);
    });
  });

  $(".stream-container").on("wheel", function (event) {
    event.preventDefault();

    const delta = event.originalEvent.deltaX || event.originalEvent.deltaY;

    if (Math.abs(delta) < 1) return;

    const scrollForce = delta * 0.0005;

    bodies.forEach((body) => {
      if (!body.isStatic) {
        Matter.Body.applyForce(body, body.position, { x: -scrollForce, y: 0 });
      }
    });
  });

  let time = 0;
  (function update() {
    time += 0.01;
    bodies.forEach((body) => {
      if (!body.isStatic) {
        const waveForceY =
          Math.sin(time + body.waveOffset) * 0.00008 * body.mass;

        body.torque = (Math.random() - 0.5) * 0.0002 * body.mass;

        const currentForceX = -0.0005 * body.mass;

        Matter.Body.applyForce(body, body.position, {
          x: currentForceX,
          y: waveForceY,
        });
      }

      if (body.position.x < -100) {
        Matter.Body.setPosition(body, {
          x: containerWidth + 100,
          y: Math.random() * containerHeight,
        });
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
      }

      const { x, y } = body.position;
      const angle = body.angle;
      body.domElement.style.left = `${x - body.domElement.clientWidth / 2}px`;
      body.domElement.style.top = `${y - body.domElement.clientHeight / 2}px`;
      body.domElement.style.transform = `rotate(${angle}rad)`;
    });

    requestAnimationFrame(update);
  })();

  const runner = Runner.create();
  Runner.run(runner, engine);
});
