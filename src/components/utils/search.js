const search = (dataSearch, filterQuery) => {
  const filteredData = dataSearch.filter((data) => {
    let isValid = true;
    for (let key in filterQuery) {
      console.log(key, data[key], filterQuery[key]);
      isValid = isValid && data[key] === filterQuery[key];
    }
    return isValid;
  });
  return filteredData;
};
export default search;
