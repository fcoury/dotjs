(function() {
  const urlParams = new URLSearchParams(window.location.href.split('#')[1]);
  const title = urlParams.get('title');

  if (title) {
    const el = document.querySelector('p.text-capitalize[title]');
    const newTitle = `<b>${title}</b><br>${el.textContent}`;
    el.innerHTML = newTitle;
  }
})();
