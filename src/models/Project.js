export default class Project {
	constructor(title) {
		this.title = title; 
		this.TaskList = []; 
	}

	addTask(task) {
		this.TaskList.push(task); 
	}
}
