document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("archive-container");
  const items = document.querySelectorAll(".archive-item");

  let highestZIndex = items.length;

  function scatterItems() {
    items.forEach((item, index) => {
      const maxX = container.clientWidth - item.offsetWidth;
      const maxY = container.clientHeight - item.offsetHeight;
      const randomX = Math.random() * maxX;
      const randomY = Math.random() * maxY;

      const randomRot = (Math.random() - 0.5) * 30;

      item.style.left = `${randomX}px`;
      item.style.top = `${randomY}px`;
      item.style.transform = `rotate(${randomRot}deg)`;
      item.style.zIndex = index;
    });
  }

  items.forEach((item) => {
    let isDragging = false;
    let hasMoved = false;
    let offsetX, offsetY;

    item.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDragging = true;
      hasMoved = false;

      highestZIndex++;
      item.style.zIndex = highestZIndex;
      item.classList.add("is-dragging");

      offsetX = e.clientX - item.offsetLeft;
      offsetY = e.clientY - item.offsetTop;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(e) {
      if (!isDragging) return;
      hasMoved = true;

      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      const maxX = container.clientWidth - item.offsetWidth;
      const maxY = container.clientHeight - item.offsetHeight;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      item.style.left = `${newX}px`;
      item.style.top = `${newY}px`;
    }

    function onMouseUp() {
      isDragging = false;
      item.classList.remove("is-dragging");

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    item.addEventListener("click", (e) => {
      if (hasMoved) {
        e.preventDefault();
      }
    });
  });

  scatterItems();
});
