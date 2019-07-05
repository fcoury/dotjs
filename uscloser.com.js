function query(q) {
  const els = Array.prototype.slice.call(document.querySelectorAll(q));
  return els.length && els[0];
}

function get(control) {
  return query(`[formarrayname="${control}"]`);
}

function saveItem(id, desc, value) {
  const savedDataStr = localStorage.getItem('$savedData');
  const savedData = (savedDataStr && JSON.parse(savedDataStr)) || [];

  const origItem = savedData.find(d => d.id === id);
  const idx = origItem && savedData.indexOf(origItem);
  const item = origItem || {};
  item.id = id;
  item.desc = desc;
  item.value = value;

  if (idx) {
    savedData[idx] = item;
  } else {
    savedData.push(item);
  }

  console.log('savedData', savedData);

  localStorage.setItem('$savedData', JSON.stringify(savedData));
}

function save() {
  const descs = document.getElementsByName('descricao[]');

  const savedData = [];
  descs.forEach(el => {
    const id = el.id.split('-')[1];
    const desc = el.value;
    const value = document.getElementById(`declaracao-${id}`).value;
    saveItem(id, desc, value);
  });
}

function load() {
  const data = localStorage.getItem('$savedData');
  if (!data) {
    return;
  }
  const rows = JSON.parse(data);
  rows.forEach(row => {
    const desc = document.getElementById(`descricao-${row.id}`);
    const value = document.getElementById(`declaracao-${row.id}`);
    if (desc) {
      desc.value = row.desc;
    }
    if (value) {
      value.value = row.value;
    }
  });
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function processEndereco() {
  query('#endereco-label-2 input').checked = true;
  document.getElementById('extra_7').checked = true;
  document.getElementById('extra_8').checked = true;
}

function sendString(el, str) {
  for (let i = 0; i < str.length; i++) {
    const key = str.charAt(i);
    const code = str.charCodeAt(i);
    const ev = new KeyboardEvent('keypress', {which: code, keyCode: code, key})
    el.dispatchEvent(ev);
  }
}

function processDeclaracao() {
  console.log('processDeclaracao');
  const els = Array.prototype.slice.call(document.querySelectorAll('[formarrayname="cartitems"] img'));
  console.log('els', els);
  if (!els.length) {
    return setTimeout(() => processDeclaracao(), 250);
  }
  els.forEach((el, idx) => {
    const data = localStorage.getItem('$savedData');
    if (!data) {
      return;
    }
    const rows = JSON.parse(data);
    const row = rows.find(row => row.id === el.src);

    const descr = document.getElementById(`descricao-declarado-${idx}`);
    const valor = document.getElementById(`valor-declarado-${idx}`);
    if (row) {
      descr.value = row.desc;
      descr.dispatchEvent(new Event('input'));

      sendString(descr, row.desc);
      if (valor.value === 'U$ 0,00') {
        sendString(valor, row.value);
      }
      descr.dispatchEvent(new Event('blur'));
      valor.dispatchEvent(new Event('blur'));
    }
  });
}

function oldProcessDeclaracao() {
  const els = document.getElementsByTagName('h5');
  const el = Array.prototype.slice.call(els).find(el => el.textContent && el.textContent.indexOf('Declaração') > -1);

  const newElements = document.createElement('div');
  newElements.innerHTML = `
  <button id='clear'>Clear</button>
  <button id='random'>Random</button>
  <button id='save'>Save</button>
  <button id='load'>Load</button>
  `;

  insertAfter(el, newElements);
  document.getElementById('clear').onclick = () => {
    const els = document.querySelectorAll('.valor');
    els.forEach(el => el.value = null);
    document.getElementsByTagName('form')[0].reset();
  };

  document.getElementById('random').onclick = () => {
    const els = document.querySelectorAll('.valor');
    console.log('els', els);
    const maxValue = 5000 / els.length;
    console.log('maxValue', maxValue);
    els.forEach(el => {
      const random = Math.floor(Math.random() * maxValue) + 1;
      el.value = String(random / 100).replace('.', ',');
    });
    return false;
  };

  document.getElementById('save').onclick = () => {
    save();
    return false;
  };

  document.getElementById('load').onclick = () => {
    load();
    return false;
  };

  document.getElementsByTagName('form')[0].onsubmit = () => {
    console.log('saving');
    save();
    return true;
  };

  load();
}

function processEstoque() {
  const dataStr = localStorage.getItem('$savedData') || '[]';
  const data = JSON.parse(dataStr);

  const els = Array.prototype.slice.call(document.querySelectorAll('[formarrayname="items"] > div .media-body'));
  els.forEach(el => {
    if (!el.id) {
      return;
    }
    const id = el.id.split('-')[2];

    // const refEl = document.getElementById(`item-referencia-${id}`);
    // const ref = refEl.innerHTML.split('REF: ')[1];
    const refEl = document.querySelectorAll(`#item-image-${id} > img`)[0];
    const ref = refEl.src;
    console.log('ref', ref);

    const saved = data.find(d => d.id === ref);

    console.log('id', id);
    console.log('saved', saved);

    const divEl = document.getElementById(`item-qtdeenviar-${id}`);

    console.log('ref', ref);

    const descId = `inserted-${id}`;
    console.log('x', document.getElementById(descId));
    const descEl = document.getElementById(descId) || document.createElement('div');
    descEl.id = descId;
    const desc = (saved && saved.desc) || '';
    const value = (saved && saved.value) || '';

    console.log('desc', desc);
    console.log('value', value);

    descEl.innerHTML = `
    <input class='desc form-control' value='${desc}'>
    <input class='value form-control' value='${value}'>
    `;
    const descInput = descEl.children[0];
    const valueInput = descEl.children[1];

    divEl.appendChild(descEl);

    descInput.onblur = (e) => {
      const desc = e.target.value;
      const value = valueInput.value;
      console.log('id', id);
      console.log('desc', desc);
      console.log('value', value);
      saveItem(ref, desc, value);
    };
    valueInput.onblur = (e) => {
      const value = e.target.value;
      const desc = descInput.value;
      saveItem(ref, desc, value);
    };
  });
}

function killNotifications() {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    .snotify-warning { display: none !important; }
  `;
  document.getElementsByTagName('head')[0].appendChild(style);
}

function checkCss() {
  const el = document.getElementById('swal2-checkbox');
  if (!el) {
    return;
  }
  console.log('element found!');
  el.checked = true;
  const confirm = document.getElementsByClassName('swal2-confirm')[0]
  confirm.dispatchEvent(new Event('click'));
}

function detectChanges() {
  checkCss();
  const url = window.location.href;
  console.log(' *** url', url);
  if (url.indexOf('estoque/endereco') > -1) {
    return processEndereco();
  } else if (url.indexOf('estoque/declaracao') > -1) {
    return processDeclaracao();
  } else if (url.endsWith('estoque')) {
    console.log('estoque');
    return processEstoque();
  }
}

let currentUrl;
window.onload = function() {
  currentUrl = location.href;
  detectChanges();
  const onChanged = () => {
    if (location.href === currentUrl) {
      setTimeout(() => onChanged(), 300);
      return;
    }
    currentUrl = location.href;
    setTimeout(() => {
      detectChanges();
      setTimeout(() => onChanged(), 300);
    }, 200);
  };
  onChanged();
};

killNotifications();
