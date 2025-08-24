document.addEventListener("DOMContentLoaded", () => {
  //TODO: add more tags here
  const tagData = {
    Default: [{ title: "No articles found for this tag yet.", url: "#" }],
  };

  const overlay = document.getElementById("tag-overlay");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayList = document.getElementById("overlay-list");
  const closeOverlayBtn = document.getElementById("close-overlay");
  const { Engine, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

  const container = document.getElementById("tag-pond");
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const engine = Engine.create({
    gravity: { x: 0, y: 0 },
  });
  const world = engine.world;

  const tags = document.querySelectorAll(".tag");
  const bodies = [];

  let mousedownCoords = null;
  const clickThreshold = 5;

  tags.forEach((tag) => {
    const startX = Math.random() * containerWidth;
    const startY = Math.random() * containerHeight;
    const width = tag.offsetWidth;
    const height = tag.offsetHeight;

    const body = Bodies.rectangle(startX, startY, width, height, {
      frictionAir: 0.01,
      restitution: 0.8,
    });

    body.domElement = tag;
    bodies.push(body);

    tag.addEventListener("mousedown", (event) => {
      mousedownCoords = { x: event.clientX, y: event.clientY };
    });

    tag.addEventListener("mouseup", (event) => {
      if (!mousedownCoords) return;

      const deltaX = Math.abs(event.clientX - mousedownCoords.x);
      const deltaY = Math.abs(event.clientY - mousedownCoords.y);

      if (deltaX < clickThreshold && deltaY < clickThreshold) {
        event.preventDefault();
        Runner.stop(runner);

        const tagName = tag.textContent;
        const articles = tagData[tagName] || tagData["Default"];

        overlayTitle.textContent = tagName;
        overlayList.innerHTML = "";
        articles.forEach((article) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.textContent = article.title;
          a.href = article.url;
          li.appendChild(a);
          overlayList.appendChild(li);
        });

        overlay.classList.add("is-visible");
      }

      mousedownCoords = null;
    });
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
    Bodies.rectangle(
      -10,
      containerHeight / 2,
      20,
      containerHeight,
      wallOptions,
    ),
    Bodies.rectangle(
      containerWidth + 10,
      containerHeight / 2,
      20,
      containerHeight,
      wallOptions,
    ),
  ]);

  const mouse = Mouse.create(container);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  World.add(world, mouseConstraint);

  function closeOverlay() {
    overlay.classList.remove("is-visible");
    Runner.start(runner, engine);
  }

  closeOverlayBtn.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeOverlay();
    }
  });

  (function update() {
    bodies.forEach((body) => {
      const driftForce = {
        x: (Math.random() - 0.5) * 0.0001 * body.mass,
        y: (Math.random() - 0.5) * 0.0001 * body.mass,
      };
      Matter.Body.applyForce(body, body.position, driftForce);

      const { x, y } = body.position;
      body.domElement.style.left = `${x - body.domElement.offsetWidth / 2}px`;
      body.domElement.style.top = `${y - body.domElement.offsetHeight / 2}px`;
    });

    requestAnimationFrame(update);
  })();

  const runner = Runner.create();
  Runner.run(runner, engine);
});
