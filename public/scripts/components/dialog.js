/*
Accepts
- buttonId
- dialogId
- formId
- formAction
- formMethod
*/
const initDialog = (buttonId, dialogId, formId, formAction, formMethod) => {
  const btn = document.getElementById(buttonId);
  const dialog = document.getElementById(dialogId);

  // Opens dialog
  btn.addEventListener("click", () => {
    dialog.showModal();
  });

  // Forms
  const form = document.getElementById(formId);

  if (!form) {
    console.error(`Error: Form with ID '${formId}' not found.`);
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      const response = await fetch(formAction, {
        method: formMethod,
        body: new URLSearchParams(formData),
      });

      console.log(response);

      if (response.ok) {
        console.log("Success: Data added.");

        dialog.close();
        form.reset();
        location.reload();
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("A network error occurred. Please try again.");
    }
  });
};
