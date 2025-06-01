import { fileLoader } from '../utils/file-loader';
import * as nspell from 'nspell';

const KEYBOARD_LAYOUT_MAP: Record<string, string> = {
  q: 'й', w: 'ц', e: 'у', r: 'к', t: 'е', y: 'н', u: 'г', i: 'ш', o: 'щ', p: 'з',
  '[': 'х', ']': 'ъ', a: 'ф', s: 'ы', d: 'в', f: 'а', g: 'п', h: 'р', j: 'о',
  k: 'л', l: 'д', ';': 'ж', "'": 'э', z: 'я', x: 'ч', c: 'с', v: 'м', b: 'и',
  n: 'т', m: 'ь', ',': 'б', '.': 'ю', '/': '.', '`': 'ё', '&': '?', '@': '"',
  '#': '№', $: ';', '^': ':', '?': ',',
};

// 🔄 Перевод символов с английской на русскую раскладку
function switchLayout(text: string): string {
  return text
    .split('')
    .map((char) => KEYBOARD_LAYOUT_MAP[char.toLowerCase()] || char)
    .join('');
}

// 🧠 Основная функция
export function isRussianTextWithWrongLayout(text?: string): { data: string; corrected: boolean } | undefined {
  if (!text) return;
  console.debug(text)
  const aff = fileLoader('./src/core/assets/dictionary/index.aff');
  const dic = fileLoader('./src/core/assets/dictionary/index.dic');
  if (!aff.status || !dic.status) return;

  const spell = nspell(aff.data, dic.data);

  const tokens = text.split(/(\s+)/); 
  let wasCorrected = false;

  const result: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    const isWord = /^[a-zA-Z]+$/.test(token);
    const cleaned = token.replace(/[^a-zA-Z]/g, '');

    if (isWord && spell.correct(cleaned)) {
      result.push(token);
      continue;
    }

    const switched = switchLayout(token);
    const hasCyrillic = /[а-яА-ЯёЁ]/.test(switched);

    if (hasCyrillic) {
      result.push(switched);
      wasCorrected = true;

      const next = tokens[i + 1];
      if (next && /^[a-zA-Z.,;:!?'"`~]$/.test(next)) {
        const fixedNext = switchLayout(next);
        result.push(fixedNext);
        i++; 
      }

    } else {
      result.push(token);
    }
  }

  return {
    data: result.join(''),
    corrected: wasCorrected,
  };
}
