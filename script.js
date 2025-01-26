document.addEventListener("DOMContentLoaded", loadTasks);

const allTasks = getTasks();

// Elements selection
const formInput = document.querySelector(".form__input");
const saveBtn = document.querySelector(".btn--save");
const taskList = document.querySelector(".task__list");

saveBtn.addEventListener("click", (e) => {
	e.preventDefault();
	const taskTitle = formInput.value;

	if (!taskTitle) {
		return alert("Please fill out the task");
	}
	const taskId = Date.now();
	const taskItem = createTaskItem(taskTitle, taskId);
	taskList.appendChild(taskItem);
	addTaskToList(taskTitle, taskId);
	formInput.value = "";
});

function addTaskToList(taskTitle, taskId) {
	allTasks.push({
		id: taskId,
		title: taskTitle,
		checked: false,
	});
	saveTasks();
}

function createTaskItem(taskTitle, taskId, checked = false) {
	const taskHtmlForId = "task-" + taskId;
	const taskItem = document.createElement("li");
	taskItem.classList.add("task__item");
	taskItem.innerHTML = `
    <input type="checkbox"
      class="task__input--checkbox"
      id="${taskHtmlForId}">
    <label for="${taskHtmlForId}"
      class="task__label">
      <div class="task__checkbox">
        <img src="icons/check.svg"
          alt="check icon"
          class="check-icon">
      </div>
      <textarea class="task__title"
        rows="1"
        readonly>${taskTitle}</textarea>
    </label>
    <div class="action-btns">
      <button class="btn--edit">
        <img src="icons/edit.svg"
          alt="Edit icon" class="icon-edit">
      </button>
      <button class="btn--delete">
        <img src="icons/trash-bin.svg"
          alt="Delete icon" class="icon-trash">
      </button>
    </div>
  `;
	const taskCheckboxInput = taskItem.querySelector(".task__input--checkbox");
	taskCheckboxInput.checked = checked;

	const taskCheckbox = taskItem.querySelector(".task__checkbox");
	taskCheckbox.addEventListener("click", () =>
		toggleCheckStatus(taskId, taskCheckboxInput)
	);

	const taskTextarea = taskItem.querySelector(".task__title");
	taskTextarea.addEventListener("keyup", autoHeightTextarea);

	const btnEdit = taskItem.querySelector(".btn--edit");
	const editIcon = btnEdit.querySelector(".icon-edit");
	btnEdit.addEventListener("click", () =>
		updateTask(taskId, taskTextarea, editIcon)
	);

	const btnDelete = taskItem.querySelector(".btn--delete");
	btnDelete.addEventListener("click", () => deleteTask(taskId, taskItem));

	return taskItem;
}

function autoHeightTextarea(e) {
	e.currentTarget.style.height = "auto";
	const scHeight = e.currentTarget.scrollHeight;
	e.currentTarget.style.height = `${scHeight}px`;
}

function toggleCheckStatus(taskId, taskCheckboxInput) {
	const checkedStatus = taskCheckboxInput.checked;
	allTasks.forEach((task) => {
		if (task.id === Number(taskId)) {
			task.checked = !checkedStatus;
		}
	});
	saveTasks();
}

function deleteTask(taskId, taskItem) {
	const index = allTasks.findIndex((task) => task.id === taskId);
	allTasks.splice(index, 1);
	taskList.removeChild(taskItem);
	saveTasks();
}

function saveTasks() {
	console.log(allTasks);
	localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function updateTask(index, taskTextarea, editIcon) {
	if (taskTextarea.readOnly) {
		taskTextarea.readOnly = false;
		editIcon.src = "icons/update.svg";
	} else {
		if (!taskTextarea.value)
			return alert("Please fill task before saving!");
		taskTextarea.readOnly = true;
		editIcon.src = "icons/edit.svg";
		const task = allTasks.find((item) => item.id === Number(index));
		task.title = taskTextarea.value;
		saveTasks();
	}
}

function getTasks() {
	const tasks = localStorage.getItem("tasks") || "[]";
	return JSON.parse(tasks);
}

function loadTasks() {
	const tasks = getTasks();
	tasks.forEach((task) => {
		const taskItem = createTaskItem(task.title, task.id, task.checked);
		taskList.appendChild(taskItem);
	});
}
