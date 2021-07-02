(function() {
  function checkForWpm() {
    const wpmEl = document.querySelectorAll('.wpm > [data-balloon-pos="up"]');
    if (wpmEl) {
      const wpm = wpmEl[0].textContent;
      if (wpm.indexOf('-') === -1) {
        console.log('wpm', wpm);
        fetch(`http://clackbot.herokuapp.com/finishWpm?wpm=${wpm}`);
        return;
      }
    }
    setTimeout(checkForWpm, 200);
  }

  console.log('checking for wpm...');
  checkForWpm();
})();
