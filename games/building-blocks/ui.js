let currentColor = 0x2196F3;
let currentBlockType = 'cube';

function initUI() {
    createBlockTypeButtons();
    createColorPaletteButtons();
    setupModalHandlers();
    updateUIState();
}

function createBlockTypeButtons() {
    const container = document.getElementById('blockTypeSelector');
    container.innerHTML = '';
    
    Object.entries(BLOCK_TYPES).forEach(([type, def]) => {
        const btn = document.createElement('button');
        btn.className = 'block-type-btn' + (type === 'cube' ? ' active' : '');
        btn.dataset.type = type;
        btn.innerHTML = `
            <div class="block-icon">${def.icon}</div>
            <span class="block-label">${def.name}</span>
        `;
        
        btn.addEventListener('click', () => {
            selectBlockType(type);
            spawnBlock();
        });
        container.appendChild(btn);
    });
}

function createColorPaletteButtons() {
    const colors = [
        0xF44336,
        0xFF9800,
        0xFFEB3B,
        0x4CAF50,
        0x2196F3,
        0x9C27B0,
        0xE91E63,
        0x795548
    ];
    
    const container = document.getElementById('colorPalette');
    container.innerHTML = '';
    
    colors.forEach((color, index) => {
        const btn = document.createElement('button');
        btn.className = 'color-btn' + (index === 4 ? ' active' : '');
        btn.style.backgroundColor = '#' + color.toString(16).padStart(6, '0');
        btn.dataset.color = color;
        
        btn.addEventListener('click', () => selectColor(color));
        container.appendChild(btn);
    });
}

function selectBlockType(type) {
    currentBlockType = type;
    
    document.querySelectorAll('.block-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
}

function selectColor(color) {
    currentColor = color;
    
    document.querySelectorAll('.color-btn').forEach(btn => {
        const btnColor = parseInt(btn.dataset.color);
        btn.classList.toggle('active', btnColor === color);
    });
}

function updateUIState() {
    const snapBtn = document.getElementById('snapModeBtn');
    if (window.getSnapMode && window.getSnapMode()) {
        snapBtn.textContent = '🧲 Snap Mode';
        snapBtn.classList.add('active');
    } else {
        snapBtn.textContent = '🔓 Free Mode';
        snapBtn.classList.remove('active');
    }
    
    const orbitBtn = document.getElementById('orbitModeBtn');
    if (window.getOrbitMode && window.getOrbitMode()) {
        orbitBtn.textContent = '🔄 Orbit Mode';
        orbitBtn.classList.add('active');
    } else {
        orbitBtn.textContent = '🔨 Build Mode';
        orbitBtn.classList.remove('active');
    }
    
    const deleteBtn = document.getElementById('deleteModeBtn');
    if (window.getDeleteMode && window.getDeleteMode()) {
        deleteBtn.textContent = '🗑️ Delete: ON';
        deleteBtn.classList.add('active');
        deleteBtn.classList.add('danger');
    } else {
        deleteBtn.textContent = '🗑️ Delete: OFF';
        deleteBtn.classList.remove('active');
        deleteBtn.classList.remove('danger');
    }
}

function setupModalHandlers() {
    const overlayEl = document.getElementById('modalOverlay');
    overlayEl.addEventListener('click', (e) => {
        if (e.target === overlayEl) {
            hideAllModals();
        }
    });
}

function showConfirmModal(message, onConfirm) {
    const confirmEl = document.getElementById('confirmModal');
    const overlayEl = document.getElementById('modalOverlay');
    
    confirmEl.querySelector('.modal-message').textContent = message;
    confirmEl.querySelector('.btn-confirm').onclick = () => {
        onConfirm();
        hideAllModals();
    };
    confirmEl.querySelector('.btn-cancel').onclick = hideAllModals;
    
    overlayEl.style.display = 'flex';
    confirmEl.style.display = 'block';
    setTimeout(() => {
        overlayEl.classList.add('show');
        confirmEl.classList.add('show');
    }, 10);
}

function showSaveModal() {
    const saveEl = document.getElementById('saveModal');
    const overlayEl = document.getElementById('modalOverlay');
    
    updateSaveSlotsUI();
    
    const nameInput = saveEl.querySelector('.save-name-input');
    nameInput.value = `Building #${getNextSaveSlot() + 1}`;
    nameInput.focus();
    
    overlayEl.style.display = 'flex';
    saveEl.style.display = 'block';
    setTimeout(() => {
        overlayEl.classList.add('show');
        saveEl.classList.add('show');
    }, 10);
}

function showLoadModal() {
    const loadEl = document.getElementById('loadModal');
    const overlayEl = document.getElementById('modalOverlay');
    
    updateLoadSlotsUI();
    
    overlayEl.style.display = 'flex';
    loadEl.style.display = 'block';
    setTimeout(() => {
        overlayEl.classList.add('show');
        loadEl.classList.add('show');
    }, 10);
}

function hideAllModals() {
    const confirmEl = document.getElementById('confirmModal');
    const saveEl = document.getElementById('saveModal');
    const loadEl = document.getElementById('loadModal');
    const overlayEl = document.getElementById('modalOverlay');
    
    overlayEl.classList.remove('show');
    if (confirmEl) confirmEl.classList.remove('show');
    if (saveEl) saveEl.classList.remove('show');
    if (loadEl) loadEl.classList.remove('show');
    
    setTimeout(() => {
        overlayEl.style.display = 'none';
        if (confirmEl) confirmEl.style.display = 'none';
        if (saveEl) saveEl.style.display = 'none';
        if (loadEl) loadEl.style.display = 'none';
    }, 200);
}

function updateSaveSlotsUI() {
    const saveEl = document.getElementById('saveModal');
    const container = saveEl.querySelector('.save-slots');
    const saves = getSaves();
    
    container.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const save = saves[i];
        const slot = document.createElement('div');
        slot.className = 'save-slot';
        slot.dataset.slot = i;
        
        if (save) {
            slot.innerHTML = `
                <img src="${save.thumbnail}" class="save-thumbnail" alt="Thumbnail">
                <div class="save-info">
                    <div class="save-name">${save.name}</div>
                    <div class="save-meta">${save.blockCount} blocks • ${formatDate(save.timestamp)}</div>
                </div>
                <button class="btn btn-sm btn-danger" onclick="overwriteSave(${i})">Overwrite</button>
            `;
        } else {
            slot.innerHTML = `
                <div class="save-empty">
                    <span class="save-empty-icon">📦</span>
                    <span class="save-empty-text">Empty Slot ${i + 1}</span>
                </div>
                <button class="btn btn-sm btn-primary" onclick="saveToSlot(${i})">Save Here</button>
            `;
        }
        
        container.appendChild(slot);
    }
}

function updateLoadSlotsUI() {
    const loadEl = document.getElementById('loadModal');
    const container = loadEl.querySelector('.load-slots');
    const saves = getSaves();
    
    container.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const save = saves[i];
        const slot = document.createElement('div');
        slot.className = 'load-slot';
        slot.dataset.slot = i;
        
        if (save) {
            slot.innerHTML = `
                <img src="${save.thumbnail}" class="save-thumbnail" alt="Thumbnail">
                <div class="save-info">
                    <div class="save-name">${save.name}</div>
                    <div class="save-meta">${save.blockCount} blocks • ${formatDate(save.timestamp)}</div>
                </div>
                <button class="btn btn-sm btn-primary" onclick="loadFromSlot(${i})">Load</button>
            `;
        } else {
            slot.innerHTML = `
                <div class="save-empty">
                    <span class="save-empty-icon">📦</span>
                    <span class="save-empty-text">Empty Slot ${i + 1}</span>
                </div>
                <button class="btn btn-sm btn-secondary" disabled>No Save</button>
            `;
        }
        
        container.appendChild(slot);
    }
}

function saveToSlot(slotId) {
    const saveEl = document.getElementById('saveModal');
    const name = saveEl.querySelector('.save-name-input').value || `Building #${slotId + 1}`;
    
    if (saveCreation(slotId, name)) {
        console.log('Saved successfully!');
        hideAllModals();
    }
}

function overwriteSave(slotId) {
    const saveEl = document.getElementById('saveModal');
    showConfirmModal('Overwrite existing save?', () => {
        const name = saveEl.querySelector('.save-name-input').value || `Building #${slotId + 1}`;
        
        if (saveCreation(slotId, name)) {
            console.log('Saved successfully!');
            hideAllModals();
        }
    });
}

function loadFromSlot(slotId) {
    if (loadCreation(slotId)) {
        console.log('Loaded successfully!');
        hideAllModals();
    } else {
        console.error('Load failed!');
    }
}

function getNextSaveSlot() {
    const saves = getSaves();
    for (let i = 0; i < 5; i++) {
        if (!saves[i]) return i;
    }
    return 0;
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

window.initUI = initUI;
window.showConfirmModal = showConfirmModal;
window.showSaveModal = showSaveModal;
window.showLoadModal = showLoadModal;
window.hideAllModals = hideAllModals;
window.saveToSlot = saveToSlot;
window.overwriteSave = overwriteSave;
window.loadFromSlot = loadFromSlot;
window.getCurrentBlockType = () => currentBlockType;
window.getCurrentColor = () => currentColor;
window.updateUIState = updateUIState;