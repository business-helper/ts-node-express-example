const REGX_PUNCTUATION = new RegExp('[.,\/#!$%\^&\*;:{}=\-_`~()"]');

/**
 * @name reverseWord
 * @description reverse a word
 * @param { string } word
 * @return { string }
 */
function reverseWord(word: string): string {
  return word.split('').reverse().join('');
}

/**
 * @name reverseWords
 * @description reverse a sentence
 * @param { string } sentence
 * @return { string }
 */
export function reverseWords(sentence: string): string {
  // if there are more than one words, split and process each word.
  if (sentence.includes(' ')) return sentence.split(' ').map(token => reverseWords(token)).join(' ');
  // if the the word begins with an apostrophes, then process the following characters.
  if (sentence[0] === "'") return sentence[0] + reverseWords(sentence.substr(1));
  // process with punctuations
  const match: any = sentence.match(REGX_PUNCTUATION);
  if (!match) return reverseWord(sentence);
  return reverseWords(sentence.substr(0, match.index)) + sentence[match.index] + reverseWords(sentence.substr(match.index + 1));
}