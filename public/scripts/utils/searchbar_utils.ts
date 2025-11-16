export const initSearchBar = (doc: Document, columns: string[]) => {
  const searchBarEl = doc.getElementById("searchbar");
  if (!searchBarEl) {
    console.error("Search bar element with id 'searchbar' not found!");
    return;
  }

  if (!(searchBarEl instanceof HTMLSelectElement)) {
    console.error("Element 'searchbar' is not a <select> element!");
    return;
  }

  searchBarEl.options.length = 0;
  const allOptionNames = ["All", ...columns];

  allOptionNames.forEach((name) => {
    const option = doc.createElement("option");
    option.value = name;
    option.textContent = name;
    searchBarEl.add(option);
  });
};
