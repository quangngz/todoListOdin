// Import from the installed package; bundlers like webpack will resolve this from node_modules.
import { formatDistanceToNowStrict } from 'date-fns';

const sideBar = document.getElementById("sideBar"); 

const addTask = document.getElementById("addTask");
addTask.addEventListener("click", showPopUp);

const addProject = document.getElementById("addProject");
addProject.addEventListener("click", addProjectFunc);


const popUp = document.getElementById("popup-addTask"); 
const closePopUp = document.getElementById("closePopUp"); 
closePopUp.addEventListener("click", closePopUpFunc)

const form = document.getElementById("editForm"); 
// inputs used by the form
const taskInput = document.getElementById("taskInput");
const taskDetails = document.getElementById("taskDetails");
const priorities = document.querySelectorAll('input[name="priority"]'); // Very niubi shit
let chosenPriority = null; 
priorities.forEach(priority => {
    priority.addEventListener("change", (e) => {
        chosenPriority = e.target.value; 
    })
})
const timeInput = document.getElementById("time");
// editing state: when true the form will save edits to an existing task
let isEditing = false;
let editingIndex = null; // index within current project's TaskList

form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent page reload
    const title = taskInput.value.trim();
    const details = taskDetails.value.trim();
    const taskPriority = chosenPriority; 
    if (!title) {
        // simple validation: require a title
        taskInput.focus();
        return;
    }
    if (isEditing && editingIndex !== null) {
        // save edits to the existing task
        const task = projectList[currProject].TaskList[editingIndex];
        if (task) {
            task.title = title;
            task.details = details;
            task.priority =  taskPriority || task.priority;
            // timeInput.value is an ISO string; only update if provided
            if (timeInput && timeInput.value) {task.time = new Date(timeInput.value);}
        }
        // reset editing state
        isEditing = false;
        editingIndex = null;
        projectList[currProject].displayTask();
    } else {
        // create new task
        appendTask(title, details, taskPriority, timeInput && timeInput.value);
    }

    // clear and close
    taskInput.value = "";
    taskDetails.value = "";
    chosenPriority = null;
    // clear radio selections
    priorities.forEach(p => p.checked = false);
    if (timeInput) timeInput.value = "";
    closePopUpFunc(); 
})

const mainArea = document.getElementById("mainArea");


class Project {
    constructor(title) {
        this.title = title; 
        this.TaskList = []; 
    }
    
    addTask(task) {
        this.TaskList.push(task); 
        this.displayTask(); 
    }

    displayTask() {
        mainArea.innerHTML = ""; // Clearing previous stuff

        // Add project title as an H1 at the top
        const heading = document.createElement("h1");
        heading.className = "text-2xl font-bold mb-4";
        heading.textContent = this.title;
        mainArea.appendChild(heading);

        if (!this.TaskList) return; 
        // TaskList contains Task objects; iterate and render each
        this.TaskList.forEach((task, idx) => {
            const card = document.createElement("div");
            card.className = "bg-white rounded shadow p-4 mb-3 text-left";
            card.addEventListener("click", () => editTask(idx));

            const titleEl = document.createElement("div");
            titleEl.className = "text-lg font-semibold text-gray-800";
            titleEl.textContent = task.title;

            const detailsEl = document.createElement("div");
            detailsEl.className = "text-sm text-gray-600 mt-1";
            detailsEl.textContent = task.details || "No details";

            // Priority pill styled to match modal pills
            const prioritySpan = document.createElement("span");
            prioritySpan.className = "px-3 py-1 rounded-full text-sm inline-block mt-2";
            if (task.priority) {
                const p = task.priority.toLowerCase();
                if (p === 'critical') prioritySpan.className += ' bg-red-600 text-white';
                else if (p === 'important') prioritySpan.className += ' bg-yellow-600 text-white';
                else if (p === 'desirable') prioritySpan.className += ' bg-blue-600 text-white';
                else prioritySpan.className += ' bg-gray-600 text-white';
                // display readable label
                prioritySpan.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
            } else {
                prioritySpan.textContent = '';
            }

            // Deadline display + time-left (friendly)
            const deadlineWrap = document.createElement('div');
            deadlineWrap.className = 'mt-2 text-sm text-gray-600 flex flex-col';

            if (task.time) {
                const deadlineEl = document.createElement('div');
                deadlineEl.className = 'text-sm text-gray-700';
                deadlineEl.textContent = task.getDate();

                const timeLeftEl = document.createElement('div');
                timeLeftEl.className = 'text-xs text-gray-500';
                try {
                    // formatDistanceToNowStrict returns a human readable distance
                    timeLeftEl.textContent = formatDistanceToNowStrict(new Date(task.time), { addSuffix: true });
                } catch (err) {
                    timeLeftEl.textContent = '';
                }

                deadlineWrap.appendChild(deadlineEl);
                deadlineWrap.appendChild(timeLeftEl);
            }

            card.appendChild(titleEl);
            card.appendChild(detailsEl);
            if (prioritySpan.textContent) card.appendChild(prioritySpan);
            if (deadlineWrap.children.length) card.appendChild(deadlineWrap);
            mainArea.appendChild(card);
        });
    }
}

class Task {
    constructor(title, details, priority, timeInput) {
        this.title = title; 
        this.details = details; 
        this.priority = priority; 
        this.time = new Date(timeInput); 

        this.completed = false; 
    }

    getDate() {
        const day = this.time.getDate(); 
        const month = this.time.getMonth(); 
        const year = this.time.getFullYear(); 
        const hours = String(this.time.getHours()).padStart(2, "0"); 
        const minutes = String(this.time.getMinutes()).padStart(2, "0"); 

        return `${day} ${month} ${year}, ${hours}:${minutes}`
    }
}

function editTask(taskIndex) {
    // populate form with existing task data and open modal for editing
    const task = projectList[currProject].TaskList[taskIndex];
    if (!task) return;
    taskInput.value = task.title;
    taskDetails.value = task.details || "";
    // populate priority radio if present
    if (task.priority) {
        chosenPriority = task.priority;
        const radio = document.querySelector(`input[name="priority"][value="${task.priority}"]`);
        if (radio) radio.checked = true;
    }
    // populate time if present and is a Date
    if (task.time) {
        // Format as yyyy-MM-ddThh:mm for datetime-local
        const t = new Date(task.time);
        const iso = t.toISOString();
        // take YYYY-MM-DDTHH:MM
        timeInput.value = iso.substring(0,16);
    }
    isEditing = true;
    editingIndex = taskIndex;
    showPopUp(); 
}


let projectList = [];
let currProject = 0; 
let homeProject = new Project("home"); 
projectList.push(homeProject); 
const home = document.getElementById("home"); 
// style the home project in the sidebar and make it focusable
home.className = "px-4 py-2 bg-white text-black rounded-md shadow cursor-pointer text-center";
home.setAttribute('tabindex', '0');
home.addEventListener("click", () => changeProject(0)); 
home.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') changeProject(0); });


function showPopUp() {
    popUp.classList.remove("hidden"); 
}
function closePopUpFunc() {
    popUp.classList.add("hidden"); 
}
function appendTask(taskInput, taskDetails, taskPriority, timeInput) {
    let task = new Task(taskInput, taskDetails, taskPriority, timeInput); 
    projectList[currProject].addTask(task); 
}

function addProjectFunc(title) {
    let projectIdx = projectList.length; 

    let project = new Project("project " + projectIdx); 
    projectList.push(project); 
    console.log("Created project " + projectIdx); 

    // DOM for project - styled like sidebar buttons
    let newProject = document.createElement("div"); 
    newProject.className = "px-3 py-2 bg-white text-black rounded-md shadow cursor-pointer text-center my-1"; 

    newProject.textContent = "Project " + projectIdx;    
    newProject.setAttribute('tabindex', '0');
    newProject.addEventListener("click", () => changeProject(projectIdx));
    newProject.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') changeProject(projectIdx); });
    sideBar.appendChild(newProject);
}

function changeProject(projectIdx) {
    currProject = projectIdx; 
    projectList[currProject].displayTask(); 
}