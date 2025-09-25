import { formatDistanceToNowStrict } from 'date-fns';

export function displayProject(project, mainArea, editTask) {
	if (!mainArea) return;
	mainArea.innerHTML = ""; // Clearing previous stuff

	// Add project title as an H1 at the top
	const heading = document.createElement("h1");
	heading.className = "text-2xl font-bold mb-4";
	heading.textContent = project.title;
	mainArea.appendChild(heading);

	if (!project.TaskList) return; 
	// TaskList contains Task objects; iterate and render each
	project.TaskList.forEach((task, idx) => {
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
