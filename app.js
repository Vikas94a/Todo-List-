const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#user-input");
const listContainer = document.querySelector("#list-container");

let tasks = [];
loadTasksFromLocalStorage();
taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // hindre refresh
  const formData = new FormData(taskForm); // lager form data
  tasks.push({
    timeStamp: new Date().toLocaleString("en-UK"),
    description: formData.get("user-input"),
    complete: false,
  }); // lager nytt task object of push til tasks array
  saveTaskToLocalStorage();
  renderList(tasks);
});

function renderList(taskArr) {
  while (listContainer.firstChild) {
    listContainer.removeChild(listContainer.firstChild);
  }
  taskArr.forEach((e) => {
    // for
    // A container for each task
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("timestamp");

    // time and date
    const timeStampElem = document.createElement("p");
    timeStampElem.textContent = e.timeStamp;
    // task
    const taskTodo = document.createElement("input");
    taskTodo.value = e.description;
    taskTodo.readOnly = true;
    // Add checkbox
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = e.complete;

    checkBox.addEventListener("click", () => {
      if (checkBox.checked) {
        const C = tasks.findIndex((task) => task.timeStamp === e.timeStamp);
        if (C !== -1) {
          tasks[C].complete.style.display = checkBox.checked; // Update the complete state of the task
          checkBox.checked = true;
          taskContainer.style.display = "none";
          saveTaskToLocalStorage(); // Save the updated tasks array
        }
      }
    });

    // Add button
    const addButton = document.createElement("button");
    addButton.textContent = "Add";

    // EventListner to Add button
    addButton.addEventListener("click", () => {
      if (taskTodo.readOnly) {
        taskTodo.readOnly = false;
        taskTodo.focus();
        addButton.textContent = "Save";
      } else if (!taskTodo.readOnly) {
        taskTodo.readOnly = true;
        addButton.textContent = "Add";

        const taskIndex = tasks.findIndex(
          (task) => task.timeStamp === e.timeStamp
        );
        if (taskIndex !== -1) {
          tasks[taskIndex].description = taskTodo.value;
        }
      }
      saveTaskToLocalStorage();
    });

    //remove button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    // append tin task Container
    taskContainer.append(
      timeStampElem,
      taskTodo,
      checkBox,
      addButton,
      deleteBtn
    );
    // append in main container
    listContainer.append(taskContainer);
  });
}

function saveTaskToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    renderList(tasks);
  }
}
