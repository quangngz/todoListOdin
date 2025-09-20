

const sideBar = document.getElementById("sideBar"); 



const addTask = document.getElementById("addTask");
addTask.addEventListener("click", showPopUp);

const addProject = document.getElementById("addProject");
addProject.addEventListener("click", addProjectFunc);


const popUp = document.getElementById("popup-addTask"); 
const closePopUp = document.getElementById("closePopUp"); 
closePopUp.addEventListener("click", closePopUpFunc)

const form = document.getElementById("editForm"); 
form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent page reload??
    appendTask(taskInput.value, taskDetails.value)
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
        this.TaskList.forEach((task) => {
            const newDiv = document.createElement("div");
            newDiv.className = "bg-blue-100 text-center p-2 mb-2";
            newDiv.textContent = task.title;
            mainArea.appendChild(newDiv);
        });
    }
}

class Task {
    constructor(title, details) {
        this.title = title; 
        this.details = details; 
        // this.priority = priority; 
        this.completed = false; 
    }
}



let projectList = [];
let currProject = 0; 
let homeProject = new Project("home"); 
projectList.push(homeProject); 
const home = document.getElementById("home"); 
home.addEventListener("click", () => homeProject.displayTask()); 


function showPopUp() {
    popUp.classList.remove("hidden"); 
}
function closePopUpFunc() {
    popUp.classList.add("hidden"); 
}
function appendTask(taskInput, taskDetails) {
    let task = new Task(taskInput, taskDetails); 
    projectList[currProject].TaskList.push(task); 
}

function addProjectFunc(title) {
    let projectIdx = projectList.length - 1; 

    let project = new Project("project " + projectIdx); 
    projectList.push(project); 
    console.log("Created project " + projectIdx); 

    // DOM for project
    let newProject = document.createElement("div"); 
    newProject.className = "bg-red-300 text-center"; 

    newProject.addEventListener("click", () => project.displayTask()); 
    newProject.textContent = "Project " + projectIdx;    
    sideBar.appendChild(newProject);
}

function changeProject(projectIdx) {
    currProject = projectIdx; 
    projectList[currProject].displayTask(); 
}