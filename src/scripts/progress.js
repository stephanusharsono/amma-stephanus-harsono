// Leesvoortgang voor pagina's zonder eigen bewegingsscript (de brief).
// Eén lezing en één schrijfactie per frame; zonder JavaScript blijft de lijn simpelweg onzichtbaar.
const header = document.querySelector('.site-header');
let frame = 0;

function update() {
  frame = 0;
  const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
  header.style.setProperty('--page-progress', Math.min(1, Math.max(0, scrollY / max)).toFixed(4));
}

function schedule() {
  if (!frame && !document.hidden) frame = requestAnimationFrame(update);
}

if (header) {
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('pageshow', schedule);
  document.addEventListener('visibilitychange', schedule);
  schedule();
}
