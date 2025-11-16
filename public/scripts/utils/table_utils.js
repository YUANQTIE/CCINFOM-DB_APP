export const livestockTableColumns = [
  "Livestock ID",
  "Breed",
  "Weight",
  "Age",
  "Country of Origin",
  "Medical Condition",
  "Vaccination Status",
  "Date Arrived",
  "Storage Location",
  "Supplier ID",
  "Status",
  "Processing Date",
];

export function getTableElements() {
  const elements = {
    tableSkeleton: document.getElementById("table-skeleton"),
    table: document.getElementById("livestock-table"),
    tableDataZeroLabel: document.getElementById("table-data-zero"),
    tableBody: document.getElementById("livestock-table-body"),
  };

  // If any element is not found, log it and return null
  if (Object.values(elements).some((el) => !el)) {
    console.error("A required table element is missing!");
    return null;
  }
  return elements;
}

export function setTableUIState(state, elements, dataTitle) {
  const { table, tableSkeleton, tableDataZeroLabel } = elements;

  // Hide all dynamic elements by default
  table.classList.add("hidden");
  tableSkeleton.classList.add("hidden");
  tableDataZeroLabel.classList.add("hidden");

  // Show the correct element for the state
  switch (state) {
    case "loading":
      tableSkeleton.classList.remove("hidden");
      break;
    case "success":
      table.classList.replace("hidden", "table");
      break;
    case "empty":
      tableDataZeroLabel.textContent = `No ${dataTitle} data found.`;
      tableDataZeroLabel.classList.replace("hidden", "flex");
      break;
    case "error":
      tableDataZeroLabel.textContent = `Failed to load ${dataTitle} data.`;
      tableDataZeroLabel.classList.replace("hidden", "flex");
      break;
  }
}
