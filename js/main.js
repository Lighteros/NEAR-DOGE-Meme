const canvas = document.getElementById("sparks");
const ctx = canvas.getContext("2d");
const glow = document.querySelector(".glow");
const bar = document.querySelector(".progress");
let width = 0;
let height = 0;
let dots = [];

function size() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  const count = Math.min(90, Math.floor(width / 16));
  dots = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.6 + 0.3,
    v: Math.random() * 0.45 + 0.08,
    a: Math.random() * 0.45 + 0.12
  }));
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  for (const d of dots) {
    d.y -= d.v;
    d.x += Math.sin(d.y * 0.01) * 0.15;
    if (d.y < -4) {
      d.y = height + 4;
      d.x = Math.random() * width;
    }
    ctx.beginPath();
    ctx.fillStyle = `rgba(61,255,136,${d.a})`;
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}

size();
draw();
window.addEventListener("resize", size);

window.addEventListener("pointermove", (event) => {
  glow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
});

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}, { passive: true });

const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
});
links.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => links.classList.remove("open"));
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      const label = button.querySelector("em");
      label.textContent = "Copied";
      button.classList.add("done");
      setTimeout(() => {
        label.textContent = "Copy";
        button.classList.remove("done");
      }, 1600);
    } catch (err) {
      button.querySelector("em").textContent = "Select";
    }
  });
});
