// select elements
let input = document.querySelector(".input");
let add = document.querySelector(".add");
let tasks = document.querySelector(".tasks");
let delAll = document.querySelector(".delAll");

// create array to add tasks in
let tasksArray = [];

// get tasks from local storage
checkAndGetDataFromLocalStorage();
toggleShowForDeleteAllButton();

function checkAndGetDataFromLocalStorage() {
  if (localStorage.getItem("tasks")) {
    tasksArray = JSON.parse(localStorage.getItem("tasks"));
    addTasksToPage(tasksArray);
  }
}

// when click add task button
add.onclick = function () {
  if (input.value !== "" && input.value.length <= 40) {
    addTaskToArray(input.value);
    input.value = "";
  }
  // character limitation for task
  if (input.value.length > 40) {
    let msg = document.querySelector(".msg");
    msg.style.display = "block";
    setTimeout(() => {
      msg.style.display = "none";
    }, 4000);
  }
  toggleShowForDeleteAllButton();
};

function addTaskToArray(inputValue) {
  // create task object
  let task = {
    id: Date.now(),
    content: inputValue,
    completed: false,
  };
  // add task to array
  tasksArray.push(task);
  addTasksToPage(tasksArray);
  addToLocalStorage(tasksArray);
}

function addTasksToPage(tasksArray) {
  tasks.innerHTML = "";
  tasksArray.forEach((task) => {
    // create task element:
    let div = document.createElement("div");
    div.className = "task edit";
    div.setAttribute("data-id", task.id);
    div.appendChild(document.createTextNode(task.content));

    // create delete button:
    let span = document.createElement("span");
    span.className = "del";
    span.appendChild(document.createTextNode("Delete"));
    div.appendChild(span);

    // create done button:
    let done = document.createElement("input");
    done.type = "checkbox";
    done.className = "doneButton";
    div.prepend(done);

    // add task div into tasks div:
    tasks.appendChild(div);

    // check if task completed
    if (task.completed) {
      done.checked = true;
    } else {
      done.checked = false;
    }
  });
}

// store tasks in local storage
function addToLocalStorage(tasksArray) {
  window.localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

// delete task when i click delete button
tasks.addEventListener("click", function (event) {
  // catch id for task
  let taskId = event.target.parentElement.getAttribute("data-id");
  // delete task from DOM
  if (event.target.className == "del") {
    // delete task from tasks array
    deleteTaskFromTasksArray(taskId);
    event.target.parentElement.remove();
  }
  toggleShowForDeleteAllButton();
});

// deleteTaskFromTasksArray
function deleteTaskFromTasksArray(taskId) {
  tasksArray = tasksArray.filter((task) => task.id != taskId);
  addToLocalStorage(tasksArray);
}

// toggle show for delete all button
function toggleShowForDeleteAllButton() {
  if (tasksArray.length == 0) {
    delAll.style.display = "none";
  } else if (tasksArray.length > 0) {
    delAll.style.display = "block";
  }
}

// delete all tasks
delAll.addEventListener("click", function () {
  tasksArray = [];
  window.localStorage.removeItem("tasks");
  tasks.innerHTML = "";
  toggleShowForDeleteAllButton();
});

// finish task or not:
tasks.addEventListener("click", function (event) {
  // catch task id
  let taskId = event.target.parentElement.getAttribute("data-id");
  // toggle status of task
  function changeCompletedStatus(taskId) {
    for (let i = 0; i < tasksArray.length; i++) {
      if (tasksArray[i].id == taskId) {
        if (tasksArray[i].completed == false) {
          tasksArray[i].completed = true;
        } else {
          tasksArray[i].completed = false;
        }
      }
    }
    addToLocalStorage(tasksArray);
  }
  if (event.target.classList.contains("doneButton")) {
    changeCompletedStatus(taskId);
  }
});