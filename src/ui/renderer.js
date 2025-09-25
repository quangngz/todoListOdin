import { formatDistanceToNowStrict } from 'date-fns';

export function displayProject(project, mainArea, handlers = {}) {
	if (!mainArea) return;
	mainArea.innerHTML = ""; 

	const heading = document.createElement("h1");
	heading.className = "text-2xl font-bold mb-4";
	heading.textContent = project.title;
	mainArea.appendChild(heading);

	if (!project.TaskList) return; 
	// rendering each task
	project.TaskList.forEach((task, idx) => {
		// wrapper is a flex row: task card on the left, controls on the right
		const wrapper = document.createElement("div"); 
		// base classes for layout
		const baseWrapper = "rounded-lg shadow p-4 mb-3 flex items-start justify-between gap-5";
		// darker background when completed, keep text readable
		const stateClasses = task.completed ? "bg-green-800 text-white" : "bg-white text-black";
		wrapper.className = `${baseWrapper} ${stateClasses}`;

		const card = document.createElement("div");
		card.className = "flex-1 bg-transparent text-left cursor-pointer";
		// use handler passed in instead of global editTask
		card.addEventListener("click", () => { if (typeof handlers.editTask === 'function') handlers.editTask(idx); });

		const titleEl = document.createElement("div");
		titleEl.className = "text-lg font-semibold";
		// ensure title color contrasts when completed
		titleEl.className += task.completed ? " text-white" : " text-gray-800";
		titleEl.textContent = task.title;

		const detailsEl = document.createElement("div");
		detailsEl.className = "text-sm mt-1";
		detailsEl.className += task.completed ? " text-gray-200" : " text-gray-600";
		detailsEl.textContent = task.details || "No details";

		// Priority pill styled to match modal pills
		const prioritySpan = document.createElement("span");
		prioritySpan.className = "px-3 py-1 rounded-full text-sm inline-block mt-2";
		if (task.priority) {
			const p = task.priority.toLowerCase();
			if (p === 'critical') prioritySpan.className += ' bg-red-600';
			else if (p === 'important') prioritySpan.className += ' bg-yellow-600';
			else if (p === 'desirable') prioritySpan.className += ' bg-blue-600';
			else prioritySpan.className += ' bg-gray-600';
			// set text color to contrast with wrapper text color
			prioritySpan.className += task.completed ? ' text-black' : ' text-white';
			// display readable label
			prioritySpan.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
		} else {
			prioritySpan.textContent = '';
		}

		// Deadline display + time-left (friendly)
		const deadlineWrap = document.createElement('div');
		deadlineWrap.className = 'mt-2 text-sm flex flex-col';
		if (task.time) {
			const deadlineEl = document.createElement('div');
			deadlineEl.className = task.completed ? 'text-gray-200' : 'text-sm text-gray-700';
			deadlineEl.textContent = task.getDate();

			const timeLeftEl = document.createElement('div');
			timeLeftEl.className = task.completed ? 'text-xs text-gray-300' : 'text-xs text-gray-500';
			try {
				timeLeftEl.textContent = formatDistanceToNowStrict(new Date(task.time), { addSuffix: true });
			} catch (err) {
				timeLeftEl.textContent = '';
			}

			deadlineWrap.appendChild(deadlineEl);
			deadlineWrap.appendChild(timeLeftEl);
		}

		// button column aligned to the right
		let buttonWrapper = document.createElement("div"); 
		buttonWrapper.className = "flex flex-col items-end space-y-2";

		let deleteButton = document.createElement("button"); 
		deleteButton.textContent = "Delete";
		deleteButton.onclick = () => { if (typeof handlers.deleteTask === 'function') handlers.deleteTask(idx); };
		deleteButton.className = "px-3 py-1 rounded-md hover:opacity-90";
		// contrast-aware delete button color
		deleteButton.className += task.completed ? " bg-red-600 text-white" : " bg-red-500 text-white";

		let completeButton = document.createElement("button"); 
		completeButton.textContent = task.completed ? "Unfinish" : "Finished"; 
		completeButton.onclick = () => { if (typeof handlers.completeTask === 'function') handlers.completeTask(idx); };
		completeButton.className = "px-3 py-1 rounded-md hover:opacity-90";
		// different color when toggling completion
		completeButton.className += task.completed ? " bg-yellow-400 text-black" : " bg-green-500 text-white";

		buttonWrapper.appendChild(deleteButton); 
		buttonWrapper.appendChild(completeButton); 

		card.appendChild(titleEl);
		card.appendChild(detailsEl);
		if (prioritySpan.textContent) card.appendChild(prioritySpan);
		if (deadlineWrap.children.length) card.appendChild(deadlineWrap);
		wrapper.appendChild(card); 
		wrapper.appendChild(buttonWrapper);
		mainArea.appendChild(wrapper);
	});
}
