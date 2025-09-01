// calendar.js
export function initCalendar(buttonId, containerId) {
  const addDateBtn = document.getElementById(buttonId);
  const calendarContainer = document.getElementById(containerId);
  const calendar = calendarContainer.querySelector("table");
  const monthYear = calendarContainer.querySelector("#monthYear");

  if (!addDateBtn || !calendarContainer || !calendar || !monthYear) {
    console.error("Calendar: One or more elements not found.");
    return;
  }

  // Toggle calendar visibility
  addDateBtn.addEventListener("click", () => {
    if (calendarContainer.style.maxHeight && calendarContainer.style.maxHeight !== "0px") {
      calendarContainer.style.maxHeight = "0";
    } else {
      calendarContainer.style.maxHeight = "400px"; // adjust as needed
    }
  });

  // Generate calendar
  function generateCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const dayToday = today.getDate();

    // Month/year display
    const monthNames = ["January","February","March","April","May","June",
                        "July","August","September","October","November","December"];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Clear previous calendar
    calendar.innerHTML = "";

    // Header row
    const headerRow = document.createElement("tr");
    ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(day => {
      const th = document.createElement("th");
      th.textContent = day;
      headerRow.appendChild(th);
    });
    calendar.appendChild(headerRow);

    // Generate day cells
    let row = document.createElement("tr");
    for (let i = 0; i < firstDay; i++) {
      row.appendChild(document.createElement("td"));
    }

    for (let date = 1; date <= daysInMonth; date++) {
      const td = document.createElement("td");
      td.textContent = date;
      if (date === dayToday) td.classList.add("today");
      row.appendChild(td);

      if ((date + firstDay) % 7 === 0) {
        calendar.appendChild(row);
        row = document.createElement("tr");
      }
    }
    if (row.children.length) calendar.appendChild(row);
  }

  // Generate calendar initially
  generateCalendar();
}
