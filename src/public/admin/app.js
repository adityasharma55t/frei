(function () {
  const API_BASE = '/admin/api';
  const TOKEN_KEY = 'freiAdminToken';

  const state = {
    token: localStorage.getItem(TOKEN_KEY) || null,
    models: [],
    currentModel: null,
    records: [],
  };

  const el = (id) => document.getElementById(id);
  const loginPanel = el('loginPanel');
  const appPanel = el('appPanel');
  const tokenStatus = el('tokenStatus');
  const logoutBtn = el('logoutBtn');
  const modelSelect = el('modelSelect');
  const addBtn = el('addBtn');
  const errorBanner = el('errorBanner');
  const tableHead = el('tableHead');
  const tableBody = el('tableBody');
  const formOverlay = el('formOverlay');
  const recordForm = el('recordForm');
  const formTitle = el('formTitle');
  const formFields = el('formFields');
  const formError = el('formError');
  const cancelBtn = el('cancelBtn');

  function showError(banner, message) {
    banner.textContent = message;
    banner.hidden = !message;
  }

  async function apiFetch(path, options = {}) {
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (state.token) headers['X-Admin-Token'] = state.token;

    const res = await fetch(API_BASE + path, Object.assign({}, options, { headers }));
    if (res.status === 401) {
      state.token = null;
      localStorage.removeItem(TOKEN_KEY);
      renderAuthState();
      throw new Error('Admin token missing or invalid. Please log in again.');
    }
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error((body && body.message) || `Request failed (${res.status})`);
    }
    return body;
  }

  function renderAuthState() {
    const loggedIn = Boolean(state.token);
    loginPanel.hidden = loggedIn;
    appPanel.hidden = !loggedIn;
    logoutBtn.hidden = !loggedIn;
    tokenStatus.textContent = loggedIn ? 'Logged in' : '';
    if (loggedIn) loadModels();
  }

  el('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const value = el('tokenInput').value.trim();
    if (!value) return;
    state.token = value;
    localStorage.setItem(TOKEN_KEY, value);
    el('tokenInput').value = '';
    renderAuthState();
  });

  logoutBtn.addEventListener('click', () => {
    state.token = null;
    localStorage.removeItem(TOKEN_KEY);
    renderAuthState();
  });

  async function loadModels() {
    try {
      state.models = await apiFetch('/models');
      modelSelect.innerHTML = '';
      for (const m of state.models) {
        const opt = document.createElement('option');
        opt.value = m.key;
        opt.textContent = m.label;
        modelSelect.appendChild(opt);
      }
      if (state.models.length) {
        state.currentModel = state.models[0].key;
        modelSelect.value = state.currentModel;
        await loadRecords();
      }
      showError(errorBanner, '');
    } catch (err) {
      showError(errorBanner, err.message);
    }
  }

  modelSelect.addEventListener('change', () => {
    state.currentModel = modelSelect.value;
    loadRecords();
  });

  function currentModelMeta() {
    return state.models.find((m) => m.key === state.currentModel);
  }

  function schemaProps(schema) {
    const s = (schema && schema.oneOf) ? schema.oneOf[0] : schema;
    return (s && s.properties) || {};
  }

  async function loadRecords() {
    try {
      const meta = currentModelMeta();
      const data = await apiFetch(`/models/${state.currentModel}?limit=200`);
      state.records = data.items;
      renderTable(meta);
      showError(errorBanner, '');
    } catch (err) {
      showError(errorBanner, err.message);
    }
  }

  function renderTable(meta) {
    const props = Object.keys(schemaProps(meta.schema));
    tableHead.innerHTML = '';
    for (const p of props) {
      const th = document.createElement('th');
      th.textContent = p;
      tableHead.appendChild(th);
    }
    const actionsTh = document.createElement('th');
    actionsTh.textContent = 'Actions';
    tableHead.appendChild(actionsTh);

    tableBody.innerHTML = '';
    for (const record of state.records) {
      const tr = document.createElement('tr');
      for (const p of props) {
        const td = document.createElement('td');
        const value = record[p];
        td.textContent = Array.isArray(value) ? value.join(', ') : String(value ?? '');
        tr.appendChild(td);
      }
      const actionsTd = document.createElement('td');
      actionsTd.className = 'rowActions';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => openForm(meta, record));
      actionsTd.appendChild(editBtn);

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'danger';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => onDelete(meta, record));
      actionsTd.appendChild(delBtn);

      tr.appendChild(actionsTd);
      tableBody.appendChild(tr);
    }
  }

  addBtn.addEventListener('click', () => {
    const meta = currentModelMeta();
    if (meta) openForm(meta, null);
  });

  let editingId = null;

  function inputForProperty(name, propSchema, value) {
    const type = Array.isArray(propSchema.type) ? propSchema.type.find((t) => t !== 'null') : propSchema.type;

    if (propSchema.enum) {
      const select = document.createElement('select');
      select.name = name;
      for (const opt of propSchema.enum) {
        const optionEl = document.createElement('option');
        optionEl.value = opt;
        optionEl.textContent = opt;
        if (value === opt) optionEl.selected = true;
        select.appendChild(optionEl);
      }
      return select;
    }

    if (type === 'array') {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = name;
      input.placeholder = 'Comma-separated values';
      input.value = Array.isArray(value) ? value.join(', ') : '';
      input.dataset.array = 'true';
      return input;
    }

    if (type === 'boolean') {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = name;
      input.checked = Boolean(value);
      return input;
    }

    const input = document.createElement('input');
    input.type = type === 'number' || type === 'integer' ? 'number' : 'text';
    input.name = name;
    input.value = value === undefined || value === null ? '' : value;
    return input;
  }

  function openForm(meta, record) {
    editingId = record ? record[meta.idField] : null;
    formTitle.textContent = record ? `Edit ${meta.label} record` : `Add ${meta.label} record`;
    formFields.innerHTML = '';
    showError(formError, '');

    const props = schemaProps(meta.schema);
    const required = new Set(((meta.schema.oneOf ? meta.schema.oneOf[0] : meta.schema).required) || []);

    for (const [name, propSchema] of Object.entries(props)) {
      const label = document.createElement('label');
      label.textContent = name + (required.has(name) ? ' *' : '');
      label.setAttribute('for', 'field_' + name);

      const value = record ? record[name] : undefined;
      const input = inputForProperty(name, propSchema, value);
      input.id = 'field_' + name;
      if (required.has(name) && input.tagName !== 'SELECT' && input.type !== 'checkbox') {
        input.required = true;
      }
      if (name === meta.idField && record) {
        input.readOnly = true;
      }

      formFields.appendChild(label);
      formFields.appendChild(input);
    }

    recordForm.dataset.modelKey = meta.key;
    formOverlay.hidden = false;
  }

  cancelBtn.addEventListener('click', () => {
    formOverlay.hidden = true;
  });

  recordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const modelKey = recordForm.dataset.modelKey;
    const meta = state.models.find((m) => m.key === modelKey);
    const props = schemaProps(meta.schema);

    const body = {};
    for (const [name, propSchema] of Object.entries(props)) {
      const inputEl = document.getElementById('field_' + name);
      if (!inputEl) continue;
      const type = Array.isArray(propSchema.type) ? propSchema.type.find((t) => t !== 'null') : propSchema.type;

      if (inputEl.dataset.array === 'true') {
        body[name] = inputEl.value ? inputEl.value.split(',').map((v) => v.trim()).filter(Boolean) : [];
      } else if (type === 'boolean') {
        body[name] = inputEl.checked;
      } else if (type === 'number' || type === 'integer') {
        body[name] = inputEl.value === '' ? undefined : Number(inputEl.value);
      } else {
        body[name] = inputEl.value === '' ? undefined : inputEl.value;
      }
    }

    try {
      if (editingId) {
        await apiFetch(`/models/${modelKey}/${encodeURIComponent(editingId)}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
      } else {
        await apiFetch(`/models/${modelKey}`, {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
      formOverlay.hidden = true;
      await loadRecords();
    } catch (err) {
      showError(formError, err.message);
    }
  });

  async function onDelete(meta, record) {
    const id = record[meta.idField];
    if (!confirm(`Delete ${meta.label} record '${id}'?`)) return;
    try {
      await apiFetch(`/models/${meta.key}/${encodeURIComponent(id)}`, { method: 'DELETE' });
      await loadRecords();
    } catch (err) {
      showError(errorBanner, err.message);
    }
  }

  renderAuthState();
})();
