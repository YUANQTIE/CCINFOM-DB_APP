const initAddLivestockDialog = async (selectId) => {
  const supplierSelect = document.getElementById(selectId);
  // Fetch suppliers
  try {
    const response = await fetch("/api/livestock/supplier");

    if (response.ok) {
      const data = await response.json();
      const fragment = document.createDocumentFragment();
      for (supplier of data) {
        const option = fragment.appendChild(document.createElement("option"));
        option.value = supplier.supplier_id;
        option.textContent = supplier.supplier_id;
      }
      supplierSelect.appendChild(fragment);
    } else {
      console.error(
        "Error supplying suppliers data in add livestock dialog supplier id select"
      );
    }
  } catch (error) {
    console.error(error);
  }
};
