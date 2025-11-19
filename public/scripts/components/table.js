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
  actionButtons = {}
) => {
  const skeleton = document.getElementById(skeletonId);
  const table = document.getElementById(tableId);
  const dataEmpty = document.getElementById(dataEmptyId);

  // Check elements
  if (!skeleton || !table || !dataEmpty) {
    console.error("A required table element is missing!");
    return;
  }

  const body = table.tBodies[0];
  const header = table.tHead;

  // 1. Initialize Headers
  // We call the function here, so it must be defined OUTSIDE initTable or BEFORE this line.
  initHeaderDataFragments(columns, header, actionButtons);

  // 2. Define the Fetch Logic
  table.__fetchData = async (queryParams = {}) => {
    try {
      // Construct URL with parameters (e.g., ?start=...&end=...)
      const url = new URL(`/api/${apiName}`, window.location.origin);
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key]) {
          url.searchParams.append(key, queryParams[key]);
        }
      });

      const response = await fetch(url);
      const rowData = await response.json();

      // CRITICAL: Clear existing rows before adding new ones
      body.innerHTML = "";

      if (response.ok) {
        skeleton.classList.add("hidden");
        table.classList.replace("hidden", "table");

        // Handle empty data
        if (rowData.length === 0) {
          table.classList.replace("table", "hidden");
          dataEmpty.classList.replace("hidden", "flex");
          return;
        }

        // Ensure empty message is hidden if we have data
        dataEmpty.classList.replace("flex", "hidden");

        initRowDataFragments(rowData, body, actionButtons);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      table.classList.replace("table", "hidden");
      dataEmpty.classList.replace("hidden", "flex");
    }
  };

  // 3. Trigger initial load immediately
  table.__fetchData({});
};
// --- CLOSING BRACE FOR initTable IS HERE ---

// --- HELPER FUNCTIONS MOVED OUTSIDE ---

const initHeaderDataFragments = (columns, header, actionButtons) => {
  const columnFragment = document.createDocumentFragment();
  const row = columnFragment.appendChild(document.createElement("tr"));
  columns.forEach((col) => {
    const cell = row.insertCell();
    cell.textContent = col;
    cell.classList.add("font-bold");
  });

  if (Object.keys(actionButtons).length !== 0) {
    const actionsRow = row.insertCell();
    actionsRow.textContent = "Actions";
    actionsRow.className = "font-bold";
  }

  header.appendChild(columnFragment);
};

const initRowDataFragments = (rowData, tableBody, actionButtons) => {
  // Initialize row data fragments
  const dataFragment = document.createDocumentFragment();
  rowData.forEach((data, index) => {
    const row = dataFragment.appendChild(document.createElement("tr"));
    for (value of Object.values(data)) {
      const cell = row.insertCell();
      let content = value;
      if (typeof value === "string") {
        // Check for ISO date format roughly before parsing
        if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
          const dateObj = parseISO(value);
          if (isValid(dateObj)) {
            content = format(dateObj, "MMM dd, yyyy");
          }
        }
      }
      cell.textContent = content ? content : "--";
    }

    // Create action cell
    if (Object.keys(actionButtons).length !== 0) {
      const actionsCell = row.insertCell();
      const actionsGroup = document.createElement("div");
      actionsGroup.id = "actionsGroup";
      actionsCell.appendChild(actionsGroup);

      // Initialize buttons
      Object.entries(actionButtons).forEach(([key, props]) => {
        if (props.condition && !props.condition(data)) {
          return;
        }
        const btn = actionsGroup.appendChild(document.createElement("button"));
        btn.id = key;
        btn.className = `btn-outline ${props.className}`;

        // Check if lucide exists before using it
        if (typeof lucide !== 'undefined' && props.icon) {
          const iconElement = lucide.createElement(props.icon);
          btn.append(iconElement);
        }

        if (props.content) btn.append(props.content);

        btn.addEventListener("click", (event) => {
          props.action(event, data, index);
        });
      });

      actionsGroup.className = "flex gap-2";
    }
  });

  // Populate with built fragment
  tableBody.appendChild(dataFragment);
};