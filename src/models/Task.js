export default class Task {
	constructor(title, details, priority, timeInput) {
		this.title = title; 
		this.details = details; 
		this.priority = priority; 
		this.time = timeInput ? new Date(timeInput) : null; 
		this.completed = false; 
	}

	getDate() {
		if (!this.time) return "";
		const day = this.time.getDate(); 
		const month = this.time.getMonth(); 
		const year = this.time.getFullYear(); 
		const hours = String(this.time.getHours()).padStart(2, "0"); 
		const minutes = String(this.time.getMinutes()).padStart(2, "0"); 

		return `${day} ${month} ${year}, ${hours}:${minutes}`
	}
}
