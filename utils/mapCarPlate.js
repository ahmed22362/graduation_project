letters_map = {
  A: "ا",
  B: "ب",
  G: "ج",
  D: "د",
  R: "ر",
  S: "س",
  C: "ص",
  T: "ط",
  E: "ع",
  F: "ف",
  K: "ك",
  L: "ل",
  M: "م",
  N: "ن",
  H: "ه",
  W: "و",
  Y: "ي",
  0: "٠",
  1: "١",
  2: "٢",
  3: "٣",
  4: "٤",
  5: "٥",
  6: "٦",
  7: "٧",
  8: "٨",
  9: "٩",
}
exports.convert = (englishLetters) => {
  for (let i in englishLetters) {
    const t = englishLetters[i].toUpperCase()
    console.log(t, letters_map[t])
  }
}
