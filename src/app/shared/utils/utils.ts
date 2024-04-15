export function isHexColor (hex: string) {
  const re = new RegExp(/^#?[0-9a-fA-F]{6}$/);
  return re.test(hex);
}

export function randomColor(): string {
  let r = Math.floor(Math.random() * 255).toString(16);
  let g = Math.floor(Math.random() * 255).toString(16);
  let b = Math.floor(Math.random() * 255).toString(16);
  if (r.length === 1) r = '0' + r;
  if (g.length === 1) g = '0' + g;
  if (b.length === 1) b = '0' + b;
  return `#` + r + g + b;
}
