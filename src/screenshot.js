import {esc} from './ui.js';

export function screenshot(url, caption, lesson = false) {
  return `<figure class="guide-photo${lesson ? ' lesson-photo' : ''}"><button type="button" class="photo-trigger" data-enlarge aria-haspopup="dialog" aria-label="Enlarge screenshot: ${esc(caption)}"><img loading="lazy" src="${esc(url)}" alt="${esc(caption)}"></button><figcaption>${esc(caption)} <button type="button" class="photo-link" data-enlarge aria-haspopup="dialog">View full size</button></figcaption></figure>`;
}

export function stepHelp(help){
  if(!help)return '';
  return `<details class="trouble"><summary>${esc(help.title)}</summary><ol>${help.directions.map(line=>`<li>${esc(line)}</li>`).join('')}</ol>${screenshot('./assets/'+help.image+'.webp',help.caption,true)}</details>`;
}
