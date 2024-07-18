let selectedElement = null;

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
  
  editor.appendChild(span);

  span.addEventListener('dragstart', dragStart);
  editor.addEventListener('dragover', dragOver);
  editor.addEventListener('drop', drop);
  span.addEventListener('click', () => selectElement(span));
});

document.getElementById('undo').addEventListener('click', () => {
  document.execCommand('undo');
});

document.getElementById('redo').addEventListener('click', () => {
  document.execCommand('redo');
});

document.getElementById('fontFamily').addEventListener('change', updateStyle);
document.getElementById('fontSize').addEventListener('input', updateStyle);
document.getElementById('fontColor').addEventListener('input', updateStyle);

let draggedElement = null;

function dragStart(e) {
  draggedElement = e.target;
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

function rgbToHex(rgb) {
  const rgbArr = rgb.match(/\d+/g);
  const hex = rgbArr.map(value => {
    const hexValue = parseInt(value).toString(16);
    return hexValue.length === 1 ? '0' + hexValue : hexValue;
  }).join('');
  return `#${hex}`;
}
