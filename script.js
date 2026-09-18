const fallbackEvents = [
  { name: "octocat/Hello-World", starred: "2024-01-15" },
  { name: "github/docs", starred: "2024-02-02" },
  { name: "octo-org/octo-repo", starred: "2024-03-21" },
];

const list = document.querySelector("#starred");
const statusElement = document.querySelector("#status");

function setStatus(message, isError = false) {
  if (!statusElement) {
    return;
  }

  statusElement.textContent = message;
  statusElement.hidden = !message;
  statusElement.setAttribute("role", isError ? "alert" : "status");
}

function renderEvents(events) {
  if (!list) {
    setStatus("Unable to display starred repositories.", true);
    return;
  }

  list.innerHTML = "";

  if (!Array.isArray(events) || events.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No starred repositories recorded.";
    list.appendChild(emptyItem);
    return;
  }

  const validEvents = events.filter(
    (event) => event && typeof event.name === "string" && typeof event.starred === "string"
  );

  if (validEvents.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No valid starred repository entries were found.";
    list.appendChild(emptyItem);
    return;
  }

  validEvents.forEach((event) => {
    const item = document.createElement("li");
    item.textContent = `${event.name} — starred ${event.starred}`;
    list.appendChild(item);
  });
}

async function loadEvents() {
  setStatus("Loading starred repositories…");

  try {
    const response = await fetch("events.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const events = await response.json();

    if (!Array.isArray(events)) {
      throw new TypeError("The data source does not contain a valid list of events.");
    }

    renderEvents(events);
    setStatus(`Loaded ${events.length} starred repositories.`);
  } catch (error) {
    console.error("Failed to load starred repositories:", error);
    renderEvents(fallbackEvents);
    setStatus("Using the cached repository list because the data file could not be loaded.", true);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadEvents);
} else {
  loadEvents();
}
