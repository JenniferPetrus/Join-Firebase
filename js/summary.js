let tasks = [];

let user = [];

async function initSummary() {
    tasks = JSON.parse((await getItem("tasks")) || "[]");
    user = JSON.parse((await getItem("user")) || "[]");
    showAmounts();
}

function getGreetingTime() {
    let actualTime = new Date();
    let time = actualTime.getHours();

    if (time >= 5 && time < 11) {
        return "Good morning";
    } else if (time >= 11 && time < 17) {
        return "Good afternoon";
    } else if (time >= 17 && time < 23) {
        return "Good evening";
    } else {
        return "Good night";
    }
}

function showAmounts() {
    let toDos = [];
    let feedbacks = [];
    let dones = [];
    let inProgresses = [];
    let prioUrgent = [];
    let earliestDueDate = null;
    let newDate = null;

    for (let t = 0; t < tasks.length; t++) {
        const task = tasks[t];
        if (task.priority === "Urgent") prioUrgent.push(task.priority);

        if (!earliestDueDate || task.dueDate < earliestDueDate) earliestDueDate = task.dueDate;

        newDate = getFormattedDate(earliestDueDate);
        pushProgress(task, toDos, feedbacks, dones, inProgresses);
    }
    renderAllData(toDos, dones, feedbacks, inProgresses, prioUrgent, newDate);
}

function getFormattedDate(earliestDueDate) {
    let date = new Date(earliestDueDate);
    let formattedMonth = date.toLocaleString("default", { month: "long" });
    let year = date.getFullYear();
    let day = date.getDate();
    let newDate = formattedMonth + " " + day + ", " + year;
    return newDate;
}

function pushProgress(task, toDos, feedbacks, dones, inProgresses) {
    switch (task.progress) {
        case "toDo":
            toDos.push(task.progress);
            break;
        case "feedback":
            feedbacks.push(task.progress);
            break;
        case "done":
            dones.push(task.progress);
            break;
        case "inProgress":
            inProgresses.push(task.progress);
            break;
        default:
            break;
    }
}

function renderAllData(toDos, dones, feedbacks, inProgresses, prioUrgent, earliestDueDate) {
    document.getElementById("to-do-amount").innerHTML = toDos.length;
    document.getElementById("done-amount").innerHTML = dones.length;
    document.getElementById("feedback-amount").innerHTML = feedbacks.length;
    document.getElementById("progress-amount").innerHTML = inProgresses.length;
    document.getElementById("tasks-amount").innerHTML = tasks.length;
    document.getElementById("font-urgent-number").innerHTML = prioUrgent.length;
    document.getElementById("earliest-due-date").innerHTML = earliestDueDate;
    document.getElementById("greet-time").innerHTML = getGreetingTime();
    if (user.name) {
        document.getElementById("greet-user").innerHTML = user.name;
    } else {
        document.getElementById("greet-user").innerHTML = "Dear Guest";
    }
}