import {esc} from './ui.js';

export function screenshot(url, caption, lesson = false) {
  return `<figure class="guide-photo${lesson ? ' lesson-photo' : ''}"><button type="button" class="photo-trigger" data-enlarge aria-haspopup="dialog" aria-label="Enlarge screenshot: ${esc(caption)}"><img loading="lazy" src="${esc(url)}" alt="${esc(caption)}"></button><figcaption>${esc(caption)} <button type="button" class="photo-link" data-enlarge aria-haspopup="dialog">View full size</button></figcaption></figure>`;
}
