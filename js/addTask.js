let assigneds = [];

let categories = [{ label: "Technical Task" }, { label: "User Story" }];

let subtaskId = 0;

let progress;

let createdFromBoard = false;

async function initTask(progress = "toDo") {
    this.progress = progress;
    createdFromBoard = false;
    if (progress !== "noProgress") {
        rotateIcon("nav-image-assigned");
        rotateIcon("nav-image-category");
    }
    let urgentButton = document.getElementById("medium-button-id");
    if (urgentButton) {
        urgentButton.classList.add("active");
    }
    assigneds = await getItem("oldContacts") || [];
    document.getElementById("checkBoxItemsAssigned").innerHTML = getCheckBoxAreaTemplateForAssigned();
}

document.addEventListener("DOMContentLoaded", function () {
    initTask();
});

document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (event) {
        if (event.target.closest(".prioButtons button")) {
            let button = event.target.closest(".prioButtons button");
            document.querySelectorAll(".prioButtons button").forEach((btn) => {
                btn.classList.remove("active");
            });
            button.classList.add("active");
        }
    });
});

document.addEventListener("click", function (event) {
    let withinAssignedCheckboxArea = event.target.closest(".combobox") !== null || event.target.closest("#checkBoxItemsAssigned") !== null || event.target.id === "assigned-text";
    let withinCategoryCheckboxArea = event.target.closest(".combobox") !== null || event.target.closest("#itemsCategory") !== null || event.target.id === "category-text";
    if (!withinAssignedCheckboxArea) {
        closeCheckBoxAreaForAssigned();
        document.body.style.overflow = "";
    }

    if (!withinCategoryCheckboxArea) closeCheckBoxAreaForCategory();
});

function openOrCloseCheckBoxAreaForAssigned() {
    let checkBoxItems = document.getElementById("checkBoxItemsAssigned");
    rotateIcon("nav-image-assigned");
    if (checkBoxItems.innerHTML.trim() !== "") {
        checkBoxItems.innerHTML = "";
        document.body.style.overflow = "";
    }
    else {
        document.body.style.overflow = "hidden";
        checkBoxItems.innerHTML = getCheckBoxAreaTemplateForAssigned();
    }
}

function openOrCloseCheckBoxAreaForCategory() {
    let checkBoxItems = document.getElementById("itemsCategory");
    rotateIcon("nav-image-category");
    if (checkBoxItems.innerHTML.trim() !== "") {
        document.getElementById("position-context").classList.add("d-none");
        checkBoxItems.innerHTML = "";
    } else {
        document.getElementById("position-context").classList.remove("d-none");
        checkBoxItems.innerHTML = getCeckBoxAreaTemplateForCategory();
    }
}

function getCheckBoxAreaTemplateForAssigned() {
    assigneds.sort((a, b) => a.name.localeCompare(b.name));
    return assigneds
        .map((assigned) => {
            let parts = assigned.name.split(" ");
            let firstName = parts[0];
            let lastName = parts.length > 1 ? parts[1] : "";
            return /*html*/ `
            <div class="item assigned-item ${assigned.selected ? "active" : ""}" onclick="toggleActiveAssignedItem(this)">
                <div class="initialCircle margin-top" style="background-color: ${assigned.bg};">${firstName.charAt(0)}${lastName.charAt(0)}</div>
                <label>${firstName} ${lastName}</label>
                <input class="checkbox" type="checkbox" ${assigned.selected ? "checked" : ""}>
            </div>
        `;
        })
        .join("");
}


function getCeckBoxAreaTemplateForCategory() {
    return categories
        .map((category) => {
            return /*html*/ `
            <div class="item category-item" onclick="selectedCategoryItem(this)">
                <label>${category.label}</label>
            </div>
        `;
        })
        .join("");
}

function toggleActiveAssignedItem(element) {
    let checkbox = element.querySelector(".checkbox");
    let label = element.querySelector("label").textContent.trim();
    let assignedUser = assigneds.find((assigned) => assigned.name.trim() === label);
    if (assignedUser) {
        assignedUser.selected = !assignedUser.selected;
        checkbox.checked = assignedUser.selected;
    }
    element.classList.toggle("active", assignedUser.selected);
    updateActiveInitialCircles();
}

function updateActiveInitialCircles() {
    let activeAssignedItems = document.querySelectorAll(".assigned-item.active");
    let targetContainer = document.getElementById("selectedUserCircle");
    targetContainer.innerHTML = "";
    activeAssignedItems.forEach((item) => {
        let initialCircleClone = item.querySelector(".initialCircle").cloneNode(true);
        targetContainer.appendChild(initialCircleClone);
    });
}

function selectedCategoryItem(element) {
    let selectedCategoryItem = element.querySelector("label");
    let comboboxTextField = document.getElementById("category-text");
    comboboxTextField.innerHTML = selectedCategoryItem.textContent;
    openOrCloseCheckBoxAreaForCategory();
}

function isCategoryValidated(category) {
    if (category === "Technical Task" || category === "User Story") return true;
    else {
        document.getElementById("failureCategory").innerHTML = "Bitte Category auswählen";
        return false;
    }
}

function rotateIcon(id) {
    let icon = document.getElementById(id);
    if (icon.style.transform === "rotate(180deg)") icon.style.transform = "";
    else icon.style.transform = "rotate(180deg)";
}

function clearTask() {
    let inputs = document.getElementsByClassName("inputs");
    let textAreas = document.getElementsByClassName("textarea");
    for (let i = 0; i < inputs.length; i++) inputs[i].value = "";
    for (let i = 0; i < textAreas.length; i++) textAreas[i].value = "";
    document.getElementById("category-text").innerHTML = "Select task category";
    document.getElementById("selectedUserCircle").innerHTML = "";
    assigneds.forEach((assigned) => (assigned.selected = false));
    document.querySelectorAll(".prioButtons button").forEach((btn) => {
        btn.classList.remove("active");
    });
    document.getElementById("medium-button-id").classList.add("active");
}

function closeCheckBoxAreaForAssigned() {
    let checkBoxItems = document.getElementById("checkBoxItemsAssigned");
    if (checkBoxItems && checkBoxItems.innerHTML.trim() !== "") {
        checkBoxItems.innerHTML = "";
        rotateIcon("nav-image-assigned");
    }
}

function closeCheckBoxAreaForCategory() {
    let checkBoxItems = document.getElementById("itemsCategory");
    if (checkBoxItems && checkBoxItems.innerHTML.trim() !== "") {
        checkBoxItems.innerHTML = "";
        rotateIcon("nav-image-category");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let comboboxCategory = document.getElementById("combobox-category");
    if (comboboxCategory) {
        comboboxCategory.addEventListener("click", function () {
            document.getElementById("failureCategory").innerHTML = "";
        });
    }
});

async function createTask() {
    let currentTask = getTaskData();
    let validate = isCategoryValidated(currentTask.category);
    let message = 'Task added to board';
    if (validate) {
        let tasks = JSON.parse((await getItem("tasks")) || "[]");
        tasks = tasks.concat(currentTask);
        await setItem("tasks", JSON.stringify(tasks));
        document.getElementById("popup-container").innerHTML = getPopUpTemplate(message);
        if (!createdFromBoard) {
            setTimeout(function () {
                window.location.href = "../html/board.html";
            }, 1000);
        } else if (createdFromBoard) {
            closeCardModal("addTaskModal");
            initBoard();
        }
    }
}

function getTaskData() {
    let title = document.getElementById("input-title").value;
    let description = document.getElementById("textArea-description").value;
    let dueDate = document.getElementById("input-due-date").value;
    let priority = document.querySelector(".prioButtons button.active").innerText.trim();
    let category = document.getElementById("category-text").textContent;
    let selectedAssigneds = assigneds
        .filter((assigned) => assigned.selected)
        .map((assigned) => ({
            name: assigned.name,
            bg: assigned.bg,
        }));
    let progress = this.progress;
    let id = new Date().getTime();
    let subtasksElements = Array.from(document.querySelectorAll(".new-subtask-text"));
    let subtasks = subtasksElements.map((subtaskElement) => ({
        title: subtaskElement.innerText || subtaskElement.textContent,
        completed: false,
        id: Math.random(),
    }));

    let currentTask = {
        id,
        title,
        description,
        dueDate,
        priority,
        category,
        assignedTo: selectedAssigneds,
        progress,
        subtasks,
    };

    return currentTask;
}

function addSubtask() {
    let newSubtask = document.getElementById("newSubtask");
    let displayedSubtasks = document.getElementById("subtasks");
    if (!displayedSubtasks) return;
    let uniqueId = `subtask-${subtaskId++}`;
    if (newSubtask.value.length > 0) {
        displayedSubtasks.innerHTML += generateEditSubtasksHTML(uniqueId, newSubtask.value);
        newSubtask.value = "";
    }
}

function editSubTaskClick(uniqueId, event) {
    event.stopPropagation();
    editSubTask(uniqueId);
}

function editSubTask(id) {
    let subtaskContainer = document.getElementById(id);
    if (!subtaskContainer)
        return;
    let subtaskTextElement = subtaskContainer.querySelector(".new-subtask-text");
    let currentText = subtaskTextElement.innerText;
    subtaskTextElement.innerHTML = `<input class="subtask-edit-field" type="text" value="${currentText}" onblur="saveEditedSubTask('${id}', this.value)">`;
    subtaskTextElement.querySelector("input").focus();
}

function saveEditedSubTask(id, newText) {
    let subtaskTextElement = document.getElementById(id).querySelector(".new-subtask-text");
    subtaskTextElement.innerHTML = newText;
}

function deleteSubTask(id) {
    let subtaskToRemove = document.getElementById(id);
    subtaskToRemove.remove();
}