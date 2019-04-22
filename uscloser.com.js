(function() {
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
    const dataStr = localStorage.getItem('$savedData');
    if (!dataStr) {
      return;
    }
    const data = JSON.parse(dataStr);

    const els = Array.prototype.slice.call(document.getElementsByClassName('produto'));
    els.forEach(el => {
      const idEl = el.children[3];
      const id = idEl.children[0].name.split('[')[1].split(']')[0];

      const saved = data.find(d => d.id === id);

      console.log('id', id);
      console.log('saved', saved);

      const descEl = el.children[4];
      const desc = (saved && saved.desc) || descEl.innerHTML;
      const value = saved && saved.value;

      descEl.innerHTML = `
      <input class='desc' value='${desc}'>
      <input class='value' value='${value}'>
      `;
      const descInput = descEl.children[0];
      const valueInput = descEl.children[1];

      descInput.onblur = (e) => {
        const desc = e.target.value;
        const value = valueInput.value;
        console.log('id', id);
        console.log('desc', desc);
        console.log('value', value);
        saveItem(id, desc, value);
      };
      valueInput.onblur = (e) => {
        const value = e.target.value;
        const desc = descInput.value;
        saveItem(id, desc, value);
      };
    });
  }

  const url = window.location.href;
  if (url.indexOf('estoque/envio') > -1) {
    return processEnvio();
  } else if (url.indexOf('estoque/declaracao') > -1) {
    return processDeclaracao();
  } else if (url.endsWith('estoque')) {
    return processEstoque();
  }
})();
