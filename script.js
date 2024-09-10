let selectedElement = null;
let history = [];
let redoStack = [];

document.getElementById('addText').addEventListener('click', () => {
  const editor = document.getElementById('editor');
  const fontFamily = document.getElementById('fontFamily').value;
  const fontSize = document.getElementById('fontSize').value;
  const fontColor = document.getElementById('fontColor').value;

  const span = document.createElement('span');
  span.textContent = 'New Text';
  span.style.fontFamily = fontFamily;
  span.style.fontSize = fontSize + 'px';
  span.style.color = fontColor;
  span.className = 'draggable';
  span.setAttribute('draggable', true);
  span.setAttribute('contenteditable', true);
  span.style.cursor = 'text'; // Set cursor to text for editable elements

  editor.appendChild(span);

  span.addEventListener('dragstart', dragStart);
  editor.addEventListener('dragover', dragOver);
  editor.addEventListener('drop', drop);
  span.addEventListener('click', () => selectElement(span));
  span.addEventListener('input', debounce(saveState, 300)); // Save state on text input with debounce

  saveState();  // Save state after adding text
});

document.getElementById('undo').addEventListener('click', undo);
document.getElementById('redo').addEventListener('click', redo);

document.getElementById('fontFamily').addEventListener('change', () => {
  updateStyle();
  saveState();  // Save state after changing font
});
document.getElementById('fontSize').addEventListener('input', () => {
  updateStyle();
  saveState();  // Save state after changing size
});
document.getElementById('fontColor').addEventListener('input', () => {
  updateStyle();
  saveState();  // Save state after changing color
});

let draggedElement = null;

function dragStart(e) {
  draggedElement = e.target;
  draggedElement.style.cursor = 'move'; // Set cursor to move during dragging
  e.dataTransfer.setData('text/plain', null); 
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const editor = document.getElementById('editor');
  const rect = editor.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  draggedElement.style.left = x + 'px';
  draggedElement.style.top = y + 'px';

  draggedElement.style.cursor = 'text'; // Reset cursor to text after dropping
  saveState();  // Save state after dropping element
}

function selectElement(element) {
  selectedElement = element;
  document.getElementById('fontFamily').value = getComputedStyle(element).fontFamily;
  document.getElementById('fontSize').value = parseInt(getComputedStyle(element).fontSize);
  document.getElementById('fontColor').value = rgbToHex(getComputedStyle(element).color);
}

function updateStyle() {
  if (selectedElement) {
    selectedElement.style.fontFamily = document.getElementById('fontFamily').value;
    selectedElement.style.fontSize = document.getElementById('fontSize').value + 'px';
    selectedElement.style.color = document.getElementById('fontColor').value;
  }
}

function saveState() {
  const editor = document.getElementById('editor');
  history.push(editor.innerHTML);
  redoStack = [];  // Clear redo stack on new action
}

function undo() {
  if (history.length > 1) {
    redoStack.push(history.pop());
    document.getElementById('editor').innerHTML = history[history.length - 1];
    reassignListeners();
  }
}

function redo() {
  if (redoStack.length > 0) {
    const redoState = redoStack.pop();
    history.push(redoState);
    document.getElementById('editor').innerHTML = redoState;
    reassignListeners();
  }
}

function reassignListeners() {
  document.querySelectorAll('.draggable').forEach(span => {
    span.addEventListener('dragstart', dragStart);
    span.addEventListener('click', () => selectElement(span));
    span.addEventListener('input', debounce(saveState, 300)); // Save state on text input with debounce
  
  });
}

function rgbToHex(rgb) {
  const rgbArr = rgb.match(/\d+/g);
  const hex = rgbArr.map(value => {
    const hexValue = parseInt(value).toString(16);
    return hexValue.length === 1 ? '0' + hexValue : hexValue;
  }).join('');
  return `#${hex}`;
}

// Debounce function to limit how often saveState is called
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
