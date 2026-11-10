import {esc} from './ui.js';

export function filePicker(label, accept, attribute) {
  return `<div class="file-picker"><span>${esc(label)}</span><div class="file-choice">
    <button type="button" class="secondary" aria-label="Choose file for ${esc(label)}">Choose file</button>
    <input type="file" hidden aria-label="${esc(label)}" accept="${esc(accept)}" ${attribute}>
    <span class="file-name" aria-live="polite">No file selected</span>
  </div></div>`;
}

export function mountFilePicker(input) {
  const row = input.parentElement;
  const name = row.querySelector('.file-name');
  row.querySelector('button').addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    name.textContent = input.files[0]?.name || 'No file selected';
  });
  return () => {
    input.value = '';
    name.textContent = 'No file selected';
  };
}
