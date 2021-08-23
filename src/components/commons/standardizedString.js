const standardizedString = (dataString) => {
  return dataString
    .trim()
    .toLowerCase()
    .split(" ")
    .map(function (Word) {
      return Word.replace(Word[0], Word[0].toUpperCase());
    })
    .join(" ");
};
export default standardizedString;
