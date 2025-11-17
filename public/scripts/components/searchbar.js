const initSearchBar = (selectId, inputId, tableId, columns) => {
  const searchbarSelect = document.getElementById(selectId);
  const searchbarInput = document.getElementById(inputId);
  const table = document.getElementById(tableId);

  if (!searchbarSelect || !searchbarInput) {
    console.error("Search bar does not exist...");
    return;
  }

  // Append table columns to searchbar filter select
  const fragment = document.createDocumentFragment();
  const optionElement = fragment.appendChild(document.createElement("option"));

  optionElement.textContent = "All";

  for (let column of columns) {
    const element = fragment.appendChild(document.createElement("option"));
    element.textContent = column;
  }
  searchbarSelect.children[0].appendChild(fragment);

  // Initialize search debounce and API MySQL Data fetching to searchbar input
  let timeout;
  const delay = 600;
  searchbarInput.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const searchValue = searchbarInput.value;
      const searchFilterBy = searchbarSelect.value;

      const url = new URL(`/api/${route_api}/filter`, window.location.origin);
      url.searchParams.append("column", searchFilterBy);
      url.searchParams.append("search", searchValue);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const results = await response.json();

        // # Mutate the table #
        // Clear all rows of data in table
        for (body of table.tBodies) {
          body.innerHTML = "";
        }

        // Populate the table with data fragment
        const tableDataFragment = document.createDocumentFragment();
        const result = results.data;
        for (data of result) {
          const values = Object.values(data);
          const row = tableDataFragment.appendChild(
            document.createElement("tr")
          );
          for (dataValue of values) {
            row.insertCell().textContent = dataValue;
          }
        }
        table.tBodies[0].appendChild(tableDataFragment);
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    }, delay);
  });
};
