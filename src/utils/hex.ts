export function isHex(tokens: string[]) {
  return !tokens?.length ? false : true;
}

export function getHexTokensFromString(value: string) {
  let tokens = value.match(
    /^#*([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})$|^#*([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$|^#*([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})$|^#*([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i
  );
  tokens ??= [];
  tokens &&= tokens.slice(1).filter((v) => !!v); // remove complete match and null matches
  return tokens;
}

export function getRgbaFromHex(tokens: string[]) {
  let [r, g, b, alpha] = tokens!.map((v: string) =>
    v.length === 1 ? parseInt(v + v, 16) : parseInt(v, 16)
  );
  alpha = alpha === undefined ? 1 : alpha / 255;
  return [r, g, b, alpha];
}
