(function() {
  const action = (els) => {
    els.forEach(el => {
      const link = el.getAttribute('href');
      const parent = el.parentNode.parentNode.parentNode.parentNode.parentNode;
      const target = parent.querySelectorAll('a[data-original-title]')[0];
      const title = target.getAttribute('data-original-title');
      el.setAttribute('href', link + '&title=' + title);
    });
  };

  const check = () => {
    const els = document.querySelectorAll('div[data-name] p[title] a');
    if (els.length > 0) {
      action(els);
    } else {
      setTimeout(() => check(), 500);
    }
  };

  check();
})();
