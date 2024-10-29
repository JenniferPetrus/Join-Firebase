function setEditValuesOfTaskModal() {
    document.getElementById("input-title").value = currentTaskModal.title;
    document.getElementById("textArea-description").value = currentTaskModal.description;
    document.getElementById("input-due-date").value = currentTaskModal.dueDate;
    selectAssignedPersons();
    updateAssignedItemsUI();
    editAssignsArray();
    editSubtasksArray();
    document.getElementById("medium-button-id").classList.add("active");
}

async function saveEditTask() {
    let taskUpdated = false;
    let updatedTask = null;
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        if (task.id === currentTaskModal.id) {
            task.title = document.getElementById("input-title").value;
            task.description = document.getElementById("textArea-description").value;
            task.dueDate = document.getElementById("input-due-date").value;
            task.priority = document.querySelector(".prioButtons button.active").innerText.trim();
            task.subtasks = getUpdatedSubtasks();
            task.assignedTo = getSelectedAssigneds();
            taskUpdated = true;
            updatedTask = task;
            break;
        }
    }
    if (taskUpdated) {
        await setItem("tasks", JSON.stringify(tasks));
        updateTasks();
    }
    document.getElementById("cardModalID").innerHTML = getTaskTemplate(updatedTask);
}

function editAssignsArray() {
    let assigns = currentTaskModal["assignedTo"];
    let assignsContainer = document.getElementById("selectedUserCircle");
    assignsContainer.innerHTML = "";

    for (let a = 0; a < assigns.length; a++) {
        const assign = assigns[a];
        let editAssign = assign["name"];
        let editColor = assign["bg"];
        let initials = editAssign.split(" ").map((editAssign) => editAssign[0]).join("");
        assignsContainer.innerHTML += `<div class="editCircleStyle">
        <div class="editprofileBadge" style="background-color:${editColor}">${initials}</div>
        `;
    }
}

function editSubtasksArray() {
    let subtasks = currentTaskModal.subtasks;
    let subtaskContainer = document.getElementById("subtasks");
    subtaskContainer.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        let editSubtask = subtask.title;
        subtaskContainer.innerHTML += generateEditSubtasksHTML(subtask.id, editSubtask);
    }
}

function getUpdatedSubtasks() {
    let updatedSubtasks = [];
    let subtaskElements = document.querySelectorAll(".new-subtask-text");
    subtaskElements.forEach((element, index) => {
        updatedSubtasks.push({ id: index + 1, title: element.textContent, completed: false });
    });
    return updatedSubtasks;
}

function selectAssignedPersons() {
    if (currentTaskModal.assignedTo && currentTaskModal.assignedTo.length > 0) {
        currentTaskModal.assignedTo.forEach((assignedContact) => {
            let found = assigneds.find((assigned) => assigned.name.trim() === assignedContact.name.trim());
            if (found)
                found.selected = true;
        });
    }
}

function updateAssignedItemsUI() {
    assigneds.forEach((assigned) => {
        if (assigned.selected) {
            let element = document.querySelector(`.assigned-item[data-name="${assigned.name}"]`);
            if (element) {
                let checkbox = element.querySelector(".checkbox");
                checkbox.checked = true;
                element.classList.add("active");
            }
        }
    });
    updateActiveInitialCircles();
}