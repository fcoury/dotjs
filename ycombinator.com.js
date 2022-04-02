function _waitForElement(selector, delay = 10, tries = 100) {
  const element = document.querySelector(selector);


  if (!window[`__${selector}`]) {
    window[`__${selector}`] = 0;
    window[`__${selector}__delay`] = delay;
    window[`__${selector}__tries`] = tries;
  }

  function _search() {
    return new Promise((resolve) => {
      window[`__${selector}`]++;
      setTimeout(resolve, window[`__${selector}__delay`]);
    });
  }

  if (element === null) {
    if (window[`__${selector}`] >= window[`__${selector}__tries`]) {
      window[`__${selector}`] = 0;
      return Promise.resolve(null);
    }

    return _search().then(() => _waitForElement(selector));
  } else {
    return Promise.resolve(element);
  }
}

async function wait() {
  try {
    const el = await _waitForElement('.footer');
    el.remove();
  } catch (err) {
    console.error('Element not found');
  }
}

(function () {
  wait().catch(console.error);
})();
