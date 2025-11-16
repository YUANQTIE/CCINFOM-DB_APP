import { livestockTableColumns } from "../utils/table_utils.js";
import { initSearchBar } from "../utils/searchbar_utils.js";
import { getTableElements, setTableUIState } from "../utils/table_utils.js";
import { fetchLivestockData } from "../api/api.js";
import { populateLivestockTable } from "../utils/table_utils.js";

async function main() {
  const elements = getTableElements();
  const dataTitle = "livestock";
  if (!elements) {
    console.error("A required table element is missing!");
    return;
  }

  initSearchBar(document, livestockTableColumns);
  setTableUIState("loading", elements, dataTitle);

  try {
    const data = await fetchLivestockData();

    if (data.length === 0) {
      setTableUIState("empty", elements, dataTitle);
    } else {
      populateLivestockTable(elements.tableBody, data);
      setTableUIState("success", elements);
    }
  } catch (error) {
    console.error("Error fetching livestock data:", error);
    setTableUIState("error", elements);
  }
}

document.addEventListener("DOMContentLoaded", main);
