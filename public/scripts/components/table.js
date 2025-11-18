/*
Table accepts

- tableColumns
- skeletonId
- tableId
- dataZeroId
- apiName
- editBtnOnClicked
- trashBtnOnClicked
*/

const { format, parseISO, isValid } = dateFns;

const initTable = async (
  columns,
  tableId,
  skeletonId,
  dataEmptyId,
  apiName,
  actionButtons
) => {
  const skeleton = document.getElementById(skeletonId);
  const table = document.getElementById(tableId);
  const dataEmpty = document.getElementById(dataEmptyId);
  const body = table.tBodies[0];
  const header = table.tHead;

  // Check elements
  if (!skeleton || !table || !dataEmpty || !body) {
    console.error("A required table element is missing!");
    return;
  }

  // Add columns to table header
  // Initialize column data fragments
  const columnFragment = document.createDocumentFragment();
  const row = columnFragment.appendChild(document.createElement("tr"));
  columns.forEach((col) => {
    const cell = row.insertCell();
    cell.textContent = col;
    cell.classList.add("font-bold");
  });

  const actionsRow = row.insertCell();
  actionsRow.textContent = "Actions";
  actionsRow.className = "font-bold";
  header.appendChild(columnFragment);

  // Fetch data from API
  try {
    const response = await fetch(`/api/${apiName}`);
    const rowData = await response.json();

    // Hide skeleton and show table after data load
    skeleton.classList.add("hidden");
    table.classList.replace("hidden", "table");

    // Show message and hide table when data is empty
    if (rowData.length === 0) {
      table.classList.replace("table", "hidden");
      dataEmpty.classList.replace("hidden", "flex");
      return;
    }

    // Initialize row data fragments
    const dataFragment = document.createDocumentFragment();
    rowData.forEach((data) => {
      const row = dataFragment.appendChild(document.createElement("tr"));
      for (value of Object.values(data)) {
        const cell = row.insertCell();
        let content = value;
        if (typeof value === "string") {
          const dateObj = parseISO(value);
          if (isValid(dateObj)) {
            content = format(dateObj, "MMM dd, yyyy");
          }
        }
        cell.textContent = content;
      }

      // Create action cell
      const actionsCell = row.insertCell();
      const actionsGroup = document.createElement("div");
      actionsGroup.id = "actionsGroup";
      actionsCell.appendChild(actionsGroup);

      // Initialize buttons
      Object.entries(actionButtons).forEach(([key, props]) => {
        const btn = actionsGroup.appendChild(document.createElement("button"));
        btn.id = key;
        btn.className = "btn-outline";
        const iconElement = lucide.createElement(props.icon);
        btn.appendChild(iconElement);
        btn.addEventListener("click", props.action);
      });

      actionsGroup.className = "flex gap-2";
    });

    // Populate with built fragment
    body.appendChild(dataFragment);
  } catch (error) {
    console.error("Error fetching data:", error);
    table.classList.replace("table", "hidden");
    dataEmpty.classList.replace("hidden", "flex");
  }
};
