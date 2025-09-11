// public/js/main.js
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

function reorderByVotes(listEl){
  const items = $all('li.item', listEl);
  items.sort((a,b)=>{
    const av = parseInt(a.querySelector('[data-votes]').textContent,10) || 0;
    const bv = parseInt(b.querySelector('[data-votes]').textContent,10) || 0;
    return bv - av;
  });
  items.forEach(i => listEl.appendChild(i));
}

document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector(".list");
  if (!list) return;

  // Interceptar formularios de voto ▲/▼
  $all('form[action*="/upvote"], form[action*="/downvote"]').forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { "Accept": "application/json" }
        });
        if (!res.ok) throw new Error("Vote failed");
        const data = await res.json(); // {id, votes}
        // actualizar contador en el DOM
        const li = form.closest("li.item");
        const counter = li.querySelector("[data-votes]");
        counter.textContent = String(data.votes);
        // reordenar visualmente
        reorderByVotes(list);
      } catch (err) {
        // fallback: si algo falla, recargo
        location.reload();
      }
    });
  });
});
