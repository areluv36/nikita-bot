const KEYBOARD_LAYOUT_MAP: Record<string, string> = {
  q: 'й',
  w: 'ц',
  e: 'у',
  r: 'к',
  t: 'е',
  y: 'н',
  u: 'г',
  i: 'ш',
  o: 'щ',
  p: 'з',
  '[': 'х',
  ']': 'ъ',
  a: 'ф',
  s: 'ы',
  d: 'в',
  f: 'а',
  g: 'п',
  h: 'р',
  j: 'о',
  k: 'л',
  l: 'д',
  ';': 'ж',
  "'": 'э',
  z: 'я',
  x: 'ч',
  c: 'с',
  v: 'м',
  b: 'и',
  n: 'т',
  m: 'ь',
  ',': 'б',
  '.': 'ю',
  '/': '.',
  '`': 'ё',
  '&': '?',
  '@': '"',
  '#': '№',
  $: ';',
  '^': ':',
  '?': ',',
};

// Функция проверки "перевёрнутой" раскладки
export function isRussianTextWithWrongLayout(text?: string): boolean {
  if (!text) return false;
  const isPotentialWrongLayout = Object.keys(KEYBOARD_LAYOUT_MAP).some(
    (enChar) => text.toLowerCase().includes(enChar),
  );

  if (!isPotentialWrongLayout) return false;

  const convertedText = text
    .split('')
    .map((char) => {
      const lowerChar = char.toLowerCase();
      return KEYBOARD_LAYOUT_MAP[lowerChar] || char;
    })
    .join('');

  const russianLettersRatio =
    (convertedText.match(/[а-яё]/gi) || []).length / convertedText.length;
  return russianLettersRatio > 0.7;
}
