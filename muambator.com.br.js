(function () {
  // hides ad
  const adbar = document.getElementsByClassName('HB-Bar')[0];
  console.log('adbar', adbar);
  if (adbar) {
    adbar.style = 'display: none';
  }

  const bannerPro = document.getElementById('banner-pro');
  if (bannerPro) {
    bannerPro.style = 'display: none';
  }

  const faq = document.getElementsByClassName('faq-section');
  console.log('faq', faq, faq.length);
  if (faq.length) {
    faq[0].style = 'display: none';
  }


  const logoEl = document.getElementsByTagName('img')[0];
  const linkEl = logoEl.parentElement;
  linkEl.setAttribute('href', '/pacotes/pendentes/');

  const el = document.getElementsByClassName('dropdown-toggle')[0];
  const parentEl = el.parentElement;

  const ulEl = parentEl.getElementsByTagName('ul')[0];
  console.log(parentEl)
  console.log(ulEl)

  const newEl = document.createElement('a');
  newEl.setAttribute('class', 'menu-item');
  newEl.setAttribute('href', '/pacotes/pendentes/');
  newEl.setAttribute('title', 'Pendentes');
  newEl.textContent = 'Pendentes';

  parentEl.removeChild(ulEl);
  parentEl.removeChild(el);
  parentEl.appendChild(newEl);
})();
