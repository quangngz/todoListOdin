import { formatDistanceToNowStrict } from 'date-fns';
import Project from './models/Project.js';
import Task from './models/Task.js';
import { displayProject } from './ui/renderer.js';

// DOM
const sideBar = document.getElementById("sideBar");
const mainArea = document.getElementById("mainArea");

// ADD TASK UI
const addTask = document.getElementById("addTask");
const popUp = document.getElementById("popup-addTask");
const closePopUp = document.getElementById("closePopUp");
const editForm = document.getElementById("editForm");
const taskInput = document.getElementById("taskInput");
const taskDetails = document.getElementById("taskDetails");
const priorities = document.querySelectorAll('input[name="priority"]');
const timeInput = document.getElementById("time");

// PROJECT UI
const addProject = document.getElementById("addProject");
const projectPopUp = document.getElementById("popup-addProject");
const closeProjectPopup = document.getElementById("closeProjectPopup");
const projectForm = document.getElementById("projectForm");
const projectInput = document.getElementById("projectInput");
const home = document.getElementById("home");

// App state
let projectList = [];
let currProject = 0;

// Form state
let chosenPriority = null;
let isEditing = false;
let editingIndex = null;

let isProjectEditing = false;
let projectEditingIndex = null;

// Wire simple UI actions
addTask && addTask.addEventListener("click", showPopUp);
closePopUp && closePopUp.addEventListener("click", closePopUpFunc);
addProject && addProject.addEventListener("click", showProjectPopUp);
closeProjectPopup && closeProjectPopup.addEventListener("click", closeProjectPopUpFunc);

// priority radios
priorities.forEach(priority => {
    priority.addEventListener("change", (e) => {
        chosenPriority = e.target.value;
    });
});

// Edit task form
editForm && editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    const details = taskDetails.value.trim();
    const taskPriority = chosenPriority;

    if (!title) {
        taskInput.focus();
        return;
    }

    if (isEditing && editingIndex !== null) {
        const task = projectList[currProject].TaskList[editingIndex];
        if (task) {
            task.title = title;
            task.details = details;
            task.priority = taskPriority || task.priority;
            if (timeInput && timeInput.value) task.time = new Date(timeInput.value);
        }
        isEditing = false;
        editingIndex = null;
        displayProject(projectList[currProject], mainArea, editTask);
    } else {
        appendTask(title, details, taskPriority, timeInput && timeInput.value);
    }

    // clear form
    taskInput.value = "";
    taskDetails.value = "";
    chosenPriority = null;
    priorities.forEach(p => p.checked = false);
    if (timeInput) timeInput.value = "";
    closePopUpFunc();
});

// Edit project form
projectForm && projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = projectInput.value.trim();
    if (!title) {
        projectInput.focus();
        return;
    }

    if (isProjectEditing && projectEditingIndex !== null) {
        const project = projectList[projectEditingIndex];
        if (project) project.title = title;
        isProjectEditing = false;
        projectEditingIndex = null;
        displayProject(projectList[currProject], mainArea, editTask);
    } else {
        addProjectFunc(title);
    }

    projectInput.value = "";
    closeProjectPopUpFunc();
});

// Task helpers
function showPopUp() { popUp && popUp.classList.remove("hidden"); }
function closePopUpFunc() { popUp && popUp.classList.add("hidden"); }

function editTask(taskIndex) {
    const task = projectList[currProject].TaskList[taskIndex];
    if (!task) return;
    taskInput.value = task.title;
    taskDetails.value = task.details || "";
    if (task.priority) {
        chosenPriority = task.priority;
        const radio = document.querySelector(`input[name="priority"][value="${task.priority}"]`);
        if (radio) radio.checked = true;
    } else {
        chosenPriority = null;
        priorities.forEach(p => p.checked = false);
    }
    if (task.time) {
        const t = new Date(task.time);
        const iso = t.toISOString();
        timeInput.value = iso.substring(0,16);
    } else if (timeInput) {
        timeInput.value = "";
    }
    isEditing = true;
    editingIndex = taskIndex;
    closeProjectPopUpFunc();
    showPopUp();
}

function appendTask(title, details, priority, timeVal) {
    const task = new Task(title, details, priority, timeVal);
    projectList[currProject].addTask(task);
    displayProject(projectList[currProject], mainArea, editTask);
}

// Project helpers
function showProjectPopUp() { projectPopUp && projectPopUp.classList.remove("hidden"); }
function closeProjectPopUpFunc() { projectPopUp && projectPopUp.classList.add("hidden"); }

function addProjectFunc(title) {
    const projectIdx = projectList.length;
    const project = new Project("project " + title);
    projectList.push(project);

    const newProjectEl = document.createElement("div");
    newProjectEl.className = "px-3 py-2 bg-white text-black rounded-md shadow cursor-pointer text-center my-1";
    newProjectEl.setAttribute('tabindex', '0');

    const header = document.createElement("span");
    header.textContent = "Project " + title;
    header.addEventListener("dblclick", () => editProject(projectIdx));
    newProjectEl.appendChild(header);

    newProjectEl.addEventListener("click", () => changeProject(projectIdx));
    newProjectEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') changeProject(projectIdx); });

    sideBar && sideBar.appendChild(newProjectEl);
}

function changeProject(projectIdx) {
    currProject = projectIdx;
    displayProject(projectList[currProject], mainArea, editTask);
}

function editProject(projectIdx) {
    const project = projectList[projectIdx];
    if (!project) return;
    projectInput.value = project.title;
    isProjectEditing = true;
    projectEditingIndex = projectIdx;
    closePopUpFunc();
    showProjectPopUp();
}

// Initialize app with a home project and render
(function init() {
    const homeProject = new Project("home");
    projectList.push(homeProject);

    // style and wire existing home element if present
    if (home) {
        home.className = "px-4 py-2 bg-white text-black rounded-md shadow cursor-pointer text-center";
        home.setAttribute('tabindex', '0');
        home.addEventListener("click", () => changeProject(0));
        home.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') changeProject(0); });
    } else {
        // if no dedicated home element, create a simple entry in sidebar
        const h = document.createElement('div');
        h.className = "px-4 py-2 bg-white text-black rounded-md shadow cursor-pointer text-center";
        h.setAttribute('tabindex', '0');
        h.textContent = "Home";
        h.addEventListener("click", () => changeProject(0));
        sideBar && sideBar.appendChild(h);
    }

    displayProject(projectList[currProject], mainArea, editTask);
})();