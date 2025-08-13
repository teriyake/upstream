$(document).ready(function () {
  $(".stream-container").ripples({
    resolution: 1024,
    dropRadius: 10,
    perturbance: 0.01,
  });

  const organicTransforms = [
    { y: 20, rot: -5 },
    { y: -15, rot: 3 },
    { y: 10, rot: 6 },
    { y: -25, rot: -2 },
    { y: 5, rot: -4 },
    { y: 25, rot: 8 },
  ];

  $(".stream a").each(function (index) {
    const transform = organicTransforms[index % organicTransforms.length];
    const originalTransform = `translateY(${transform.y}px) rotate(${transform.rot}deg)`;

    $(this).css("transform", originalTransform);
    $(this).data("original-transform", originalTransform);
  });

  $(".stream a")
    .on("mouseenter", function () {
      $(this).addClass("is-hovered");
    })
    .on("mouseleave", function () {
      $(this).removeClass("is-hovered");
    });

  $(".stream-container")
    .on("mousemove", function (e) {
      const mouseX = e.pageX;
      const mouseY = e.pageY;

      $(".stream a").each(function () {
        const el = $(this);
        const originalTransform = el.data("original-transform");
        if (el.hasClass("is-hovered")) {
          const hoverTransform = `${originalTransform} scale(1.1)`;
          el.css("transform", hoverTransform);
          return;
        }
        const elOffset = el.offset();
        const elWidth = el.width();
        const elHeight = el.height();

        const elCenterX = elOffset.left + elWidth / 2;
        const elCenterY = elOffset.top + elHeight / 2;

        const dx = elCenterX - mouseX;
        const dy = elCenterY - mouseY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = 1 - distance / maxDistance;
          const pushX = (dx / distance) * (force * 30);
          const pushY = (dy / distance) * (force * 30);

          const newTransform = `translate(${pushX}px, ${pushY}px) ${originalTransform}`;

          el.css("transform", newTransform);
        } else {
          el.css("transform", el.data("original-transform"));
        }
      });
    })
    .on("mouseleave", function () {
      $(".stream a").each(function () {
        $(this).css("transform", $(this).data("original-transform"));
      });
    });
});
