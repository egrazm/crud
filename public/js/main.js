function selectAll(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function reorderByVotes(listElement) {
  const items = selectAll("li.item", listElement);
  items.sort((a, b) => {
    const votesA = parseInt(a.querySelector("[data-votes]").textContent, 10);
    const votesB = parseInt(b.querySelector("[data-votes]").textContent, 10);
    return votesB - votesA; 
  });
  items.forEach(item => listElement.appendChild(item));
}

document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector(".list");
  if (!list) return;

  selectAll('form[action*="/upvote"], form[action*="/downvote"]').forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { "Accept": "application/json" }
        });
        if (!res.ok) throw new Error("Vote failed");

        const data = await res.json();

        const li = form.closest("li.item");
        const counter = li.querySelector("[data-votes]");
        counter.textContent = String(data.votes);

        reorderByVotes(list);
      } catch (err) {
    
        window.location.reload();
      }
    });
  });
});
