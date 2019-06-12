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

function processEnvio() {
  document.getElementById('paypal').checked = true;
  document.getElementById('endereco_28960').checked = true;
  document.getElementById('extra_7_S').checked = true;
  document.getElementById('extra_8_S').checked = true;
  document.getElementById('extra_9_S').checked = true;
}

function processDeclaracao() {
  console.log('processDeclaracao');
  const els = Array.prototype.slice.call(document.querySelectorAll('[formarrayname="cartitems"] img'));
  console.log('els', els);
  els.forEach((el, idx) => {
    const data = localStorage.getItem('$savedData');
    if (!data) {
      return;
    }
    const rows = JSON.parse(data);
    const row = rows.find(row => row.id === el.src);

    const descr = document.getElementById(`descricao-declarado-${idx}`);
    const valor = document.getElementById(`valor-declarado-${idx}`);
    console.log(idx, descr);
    console.log(idx, valor);
    descr.value = row && row.desc;
    // valor.value = row && `U$ ${row.value}`;

    const ev1 = new KeyboardEvent('keypress', {which: 49, keyCode: 49, key: '1'});
    valor.dispatchEvent(ev1);
    // const ev2 = new Event('change');
    // valor.dispatchEvent(ev2);

    descr.onblur = () => {
      const ev1 = new Event('keydown', {which: 49});
      valor.dispatchEvent(ev1);
    //   valor.value = row && `U$ ${row.value}`;
    //   valor.dispatchEvent(ev1);
    //   valor.dispatchEvent(ev2);
    };
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

function detectChanges() {
  const url = window.location.href;
  console.log(' *** url', url);
  if (url.indexOf('estoque/envio') > -1) {
    return processEnvio();
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
