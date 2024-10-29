async function init(sideBarId) {
    await includeHTML();
    await setUserInitialsInHeaderTemplateButton();
    await setBackgroundToActiveSideBar(sideBarId);
}

async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = "Page not found";
        }
    }
}

async function setUserInitialsInHeaderTemplateButton() {
    let button = document.getElementById("user-button-initials");
    let user = JSON.parse(await getItem("user"));
    if (button && user.name) {
        button.innerHTML = user.name
            .split(" ")
            .map((part) => part[0].toUpperCase())
            .join("");
    }
}

async function setBackgroundToActiveSideBar(sideBarId) {
    if (sideBarId.trim() !== "") {
        switch (sideBarId) {
            case "summary":
                document.getElementById(sideBarId).classList.add("navButtonBackGroundActive");
                break;
            case "Contacts":
                document.getElementById(sideBarId).classList.add("navButtonBackGroundActive");
                break;
            case "addTask":
                document.getElementById(sideBarId).classList.add("navButtonBackGroundActive");
                break;
            case "Board":
                document.getElementById(sideBarId).classList.add("navButtonBackGroundActive");
            default:
                break;
        }
    }
}