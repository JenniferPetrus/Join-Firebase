let tasks = [];

let currentDraggedElement;

let currentTaskModal = [];

async function initBoard() {
    tasks = JSON.parse((await getItem("tasks")) || "[]");
    updateTasks();
}

document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (event) {
        if (event.target.id === "cardModal" || event.target.closest("#cardModal")) {
            let isClickOnOpenTask = event.target.classList.contains("openTask") || event.target.closest(".openTask") !== null;
            if (!isClickOnOpenTask) {
                closeCardModal("cardModal-container");
            }
        }
        if (event.target.id === "addTaskModal" || event.target.closest("#addTaskModal")) {
            let isClickInsideAddTaskTemplateContent = event.target.id === "addTaskTemplateContent" || event.target.closest("#addTaskTemplateContent") !== null;
            if (!isClickInsideAddTaskTemplateContent) {
                closeCardModal("addTaskModal");
            }
        }
        if (event.target.id === "card-modal-id" || event.target.closest("#card-modal-id")) {
            let isClickInsideInEditTaskModal = event.target.id === "card-modal-content" || event.target.closest("#card-modal-content") !== null;
            if (!isClickInsideInEditTaskModal) {
                closeEditCardModal(currentTaskModal.id);
            }
        }
    });
});

async function updateTasks() {
    let sections = {
        toDo: document.getElementById("toDo"),
        inProgress: document.getElementById("inProgress"),
        feedback: document.getElementById("feedback"),
        done: document.getElementById("done"),
    };

    document.getElementById("toDo").innerHTML = "";
    document.getElementById("inProgress").innerHTML = "";
    document.getElementById("feedback").innerHTML = "";
    document.getElementById("done").innerHTML = "";

    tasks.forEach((taskData) => {
        sections[taskData.progress].innerHTML += getCardModal(taskData);
    });
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(event) {
    event.preventDefault();
}

async function moveTo(category) {
    let foundIndex = tasks.findIndex((task) => task.id === currentDraggedElement);
    if (foundIndex !== -1) tasks[foundIndex].progress = category;
    else {
        console.error("Element nicht gefunden in tasks");
        return;
    }
    updateTasks();
    await setItem("tasks", JSON.stringify(tasks));
}

function getCardModal(task) {
    let circleTemplate = getCircleTemplate(task);
    let prioSVG = getPrioSVG(task);
    let totalSubtasks = task.subtasks.length;
    let completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length;
    let progressValue = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
    let subTaskWrapperHTML = totalSubtasks > 0 ? generateTodoSubtask(progressValue, completedSubtasks, totalSubtasks) : "";
    return getTaskCardTemplate(task, subTaskWrapperHTML, circleTemplate, prioSVG);
}

function getCircleTemplate(task) {
    return task.assignedTo.map((person) => {
        let initials = person.name.split(" ").map((namePart) => namePart.charAt(0)).join("");
        let backgroundColor = person.bg ? ` style="background-color: ${person.bg};"` : "";
        return `<div class="profileBadge"${backgroundColor}>${initials}</div>`;
    }).join("");
}

function getPrioSVG(task) {
    switch (task.priority) {
        case "Low":
            return getPrioLowSVG();
        case "Medium":
            return getPrioMediumSVG();
        case "Urgent":
            return getPrioUrgentSVG();
        default:
            return "";
    }
}

function handleSearchChange(searchText) {
    if (searchText.trim() === "") {
        updateTasks();
    } else {
        let filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchText.toLowerCase()) || task.description.toLowerCase().includes(searchText.toLowerCase()));
        updateFilteredTasks(filteredTasks);
    }
}

function updateFilteredTasks(filteredTasks) {
    let sections = {
        toDo: document.getElementById("toDo"),
        inProgress: document.getElementById("inProgress"),
        feedback: document.getElementById("feedback"),
        done: document.getElementById("done"),
    };

    Object.keys(sections).forEach((section) => {
        sections[section].innerHTML = "";
    });

    filteredTasks.forEach((task) => {
        let taskTemplate = getCardModal(task);
        if (sections[task.progress]) {
            sections[task.progress].innerHTML += taskTemplate;
        }
    });
}

function highlight(id) {
    document.getElementById(id).classList.add("contentContainerHover");
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove("contentContainerHover");
}

function closeCardModal(id) {
    document.getElementById(id).classList.add("d-none");
    document.getElementById('hidden-overflow').classList.remove('height100');
    document.getElementById("hidden-overflow").style.overflow = "scroll";
}

function openCardModal(taskId) {
    let task = tasks.find((task) => task.id.toString() === taskId.toString());
    if (task) {
        document.getElementById("cardModalID").innerHTML = getTaskTemplate(task);
        document.getElementById('hidden-overflow').classList.add('height100');
    } 
}

function getAssignedToTemplate(assignedTo) {
    return assignedTo.map((person) => {
            let initials = person.name.split(" ").map((name) => name[0]).join("");
            return /*html*/ `
            <div class="assignedContact">
                <div class="nameCircleWrapper">
                    <div class="nameCircle" style="background-color: ${person.bg};">${initials}</div>
                    <p class="assignedName">${person.name}</p>
                </div>
            </div>`;}).join("");
}

function getSubtasksTemplate(subtasks, taskId) {
    return subtasks.map((subtask) => {
            const isChecked = subtask.completed ? "checked" : "";
            return /*html*/ `
            <div class="subtask">
                <input class="checkbox" type="checkbox" ${isChecked} onclick="toggleSubtaskCompleted(${taskId}, ${subtask.id})"/>
                <div class="checkboxDescription">${subtask.title}</div>
            </div>`;}).join("");
}

async function toggleSubtaskCompleted(taskId, subtaskId) {
    let taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
        let subtaskIndex = tasks[taskIndex].subtasks.findIndex((subtask) => subtask.id === subtaskId);
        if (subtaskIndex !== -1) {
            tasks[taskIndex].subtasks[subtaskIndex].completed = !tasks[taskIndex].subtasks[subtaskIndex].completed;
            await setItem("tasks", JSON.stringify(tasks));
            updateTasks();
        }
    }
}

function getTaskTemplate(task) {
    let assignedToHtml = getAssignedToTemplate(task.assignedTo);
    let subtasksHtml = getSubtasksTemplate(task.subtasks, task.id);
    let prioSVG = getPrioSVG(task);
    currentTaskModal = task;
    return generateTaskTemplateHTML(task, assignedToHtml, subtasksHtml, prioSVG);
}

async function deleteTask(taskId) {
    closeCardModal("cardModal-container");
    tasks = tasks.filter((task) => task.id !== taskId);
    await setItem("tasks", JSON.stringify(tasks));
    updateTasks();
}

async function loadAddTaskTemplate(progress) {
    document.body.style.overflow = "hidden";
    document.getElementById("addTaskModalID").innerHTML = addTaskTemplate();
    await initTask(progress);
    createdFromBoard = true;
    document.getElementById("medium-button-id").classList.add("active");
    document.getElementById('hidden-overflow').classList.add('height100');
}

function closeEditCardModal(id) {
    openCardModal(id);
    document.getElementById('cardModal-container').classList.add("d-none");
    document.getElementById("hidden-overflow").style.overflow = "scroll";
}

async function editTask() {
    await initTask("noProgress");
    document.getElementById("cardModal-container").innerHTML = editTaskTemplate();
    setEditValuesOfTaskModal();
    rotateIcon("nav-image-assigned");
}

function getSelectedAssigneds() {
    return assigneds.filter((assigned) => assigned.selected).map((assigned) => {
            return { name: assigned.name, bg: assigned.bg,
            };
        });
}