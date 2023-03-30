// select elements
let input = document.querySelector(".input");
let add = document.querySelector(".add");
let tasks = document.querySelector(".tasks");
let remAll = document.querySelector(".remAll");
let remComp = document.querySelector(".remComp");
let remove = document.querySelector(".remove");

// create array to add tasks in
let tasksArray = [];

// get tasks from local storage
checkAndGetDataFromLocalStorage();
toggleShowForDeleteButtons();

function checkAndGetDataFromLocalStorage() {
  if (localStorage.getItem("tasks")) {
    tasksArray = JSON.parse(localStorage.getItem("tasks"));
    addTasksToPage(tasksArray);
  }
}

// when click add task button
add.addEventListener("click", function () {
  if (input.value !== "") {
    addTaskToArray(input.value);
    input.value = "";
  } else {
    msg = document.querySelector(".msg1");
    msg.style.display = "block";
    setTimeout(() => {
      msg.style.display = "none";
    }, 4000);
  }
  toggleShowForDeleteButtons();
});

function addTaskToArray(inputValue) {
  // create task object
  let task = {
    id: Date.now(),
    content: inputValue,
    completed: false,
  };
  // add task to array
  tasksArray.unshift(task);
  addTasksToPage(tasksArray);
  addToLocalStorage(tasksArray);
}

function addTasksToPage(tasksArray) {
  tasks.innerHTML = "";
  tasksArray.forEach((task) => {
    // create task element:
    let div = document.createElement("div");
    div.className = "task";
    div.setAttribute("data-id", task.id);

    // create done button:
    let done = document.createElement("input");
    done.type = "checkbox";
    done.className = "doneButton";
    div.appendChild(done);

    // create paragraph element:
    let text = document.createElement("p");
    text.className = "taskText";
    text.appendChild(document.createTextNode(task.content));
    div.appendChild(text);

    // create delete button:
    let span = document.createElement("span");
    span.className = "del";
    span.appendChild(document.createTextNode("Delete"));
    div.appendChild(span);

    // add task div into tasks div:
    tasks.appendChild(div);

    // check if task completed
    if (task.completed) {
      done.checked = true;
      div.style.opacity = ".5";
    } else {
      done.checked = false;
      div.style.opacity = "1";
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
  toggleShowForDeleteButtons();
});

// deleteTaskFromTasksArray
function deleteTaskFromTasksArray(taskId) {
  tasksArray = tasksArray.filter((task) => task.id != taskId);
  addToLocalStorage(tasksArray);
}

// toggle show for delete all button
function toggleShowForDeleteButtons() {
  if (tasksArray.length == 0) {
    remove.style.display = "none";
  } else if (tasksArray.length > 0) {
    remove.style.display = "flex";
  }
}

// delete all tasks
remAll.addEventListener("click", function () {
  tasksArray = [];
  window.localStorage.removeItem("tasks");
  tasks.innerHTML = "";
  toggleShowForDeleteButtons();
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
    addTasksToPage(tasksArray);
  }
  if (event.target.classList.contains("doneButton")) {
    changeCompletedStatus(taskId);
  }
});
// update task content:
tasks.addEventListener("click", function (event) {
  if (event.target.classList.contains("taskText")) {
    // catch task id
    let taskId = event.target.parentElement.getAttribute("data-id");
    for (let i = 0; i < tasksArray.length; i++) {
      // catch task content
      if (tasksArray[i].id == taskId) {
        let taskContent = tasksArray[i].content;
        // create popUP win
        function createPopUp() {
          let input = document.createElement("textArea");
          input.type = "text";
          input.setAttribute("autofocus", "true");
          input.className = "contentUpdate";
          tasks.appendChild(input);
          // push task content into input
          input.value = taskContent;
          // update task content when blur from input then store new data in localStorage
          input.addEventListener("blur", function () {
            if (input.value !== "") {
              tasksArray[i].content = input.value;
              addToLocalStorage(tasksArray);
              addTasksToPage(tasksArray);
              input.remove();
            } else {
              let msg = document.querySelector(".msg2");
              msg.style.display = "block";
              setTimeout(() => {
                msg.style.display = "none";
              }, 3000);
            }
          });
        }
        // check if input element created or not:
        let childElement = tasks.querySelector(".contentUpdate");
        if (tasks.contains(childElement)) {
          childElement.focus();
        } else {
          createPopUp();
        }
      }
    }
  }
});
// delete completed tasks:
remComp.addEventListener("click", function () {
  tasksArray = tasksArray.filter((task) => task.completed == false);
  addToLocalStorage(tasksArray);
  addTasksToPage(tasksArray);
  toggleShowForDeleteButtons();
});
