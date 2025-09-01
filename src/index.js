import { initCalendar } from './calendar.js';


import { Modal } from './appearance.js'


let currentHTML = "index.html"; 
// The reason for () => function name, is because your function doesn't return anything, but the addEventListener expects a return
document.getElementById("today").addEventListener("click", () => changeHTML("index.html"));
document.getElementById("upcoming").addEventListener("click", () => changeHTML("upcoming.html"));
document.getElementById("completed").addEventListener("click", () => changeHTML("completed.html"));

function changeHTML(html) {
    if (html == currentHTML) return;
    currentHTML = html; 
    window.location.href = html; 
}


initCalendar('addDateBtn', 'calendarContainer');

const addTaskModal = new Modal("addTask", "addTaskModal"); 




