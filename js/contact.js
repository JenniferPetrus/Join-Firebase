let oldContacts = [];

let letters = [];

let selectedName;

let openContact = false;

let selectedContactIndex;

async function initContacts() {
    try {
        const data = await getItem("oldContacts");
        oldContacts = data ? Object.values(data) : [];
    } catch (error) {
        console.error("Error fetching contacts:", error);
        const localData = localStorage.getItem("oldContacts");
        if (localData) {
            oldContacts = JSON.parse(localData);
        } else {
            oldContacts = [];
        }
    }
    renderOldContacts();
}



document.addEventListener("DOMContentLoaded", async function () {
    await initContacts();  // Daten von Firebase abrufen
    document.getElementById("contact-tel").addEventListener("input", function () {
        if (this.value.startsWith("+")) this.value = "+" + this.value.slice(1).replace(/[^0-9]/g, "");
        else this.value = this.value.replace(/[^0-9]/g, "");
    });
});


function renderOldContacts() {
    let renderContact = document.getElementById("contactName");
    let currentLetter = null;
    renderContact.innerHTML = "";
    oldContacts.sort((a, b) => a.name.localeCompare(b.name));
    getVariablesToRender(renderContact, currentLetter);
}

function getVariablesToRender(renderContact, currentLetter) {
    for (let i = 0; i < oldContacts.length; i++) {
        const oldContact = oldContacts[i];
        let name = oldContact["name"];
        let mail = oldContact["email"];
        let bg = oldContact["bg"];
        name = name.charAt(0).toUpperCase() + name.slice(1);
        let initials = name
            .split(" ")
            .map((n) => n[0])
            .join("");
        let sortedByLetter = name.charAt(0);

        if (sortedByLetter !== currentLetter) {
            currentLetter = sortedByLetter;
            renderContact.innerHTML += generateRegisterHTML(sortedByLetter);
        }
        renderContact.innerHTML += renderContactToRegister(i, bg, initials, name, mail);
    }
}

function showContact(i) {
    document.querySelectorAll(".contact-item").forEach((item) => {
        item.classList.remove("setUserproperty");
    });
    document.getElementById("contact" + i).classList.add("setUserproperty");
    document.getElementById("resize-contact").classList.remove("d-none");
    selectedName = oldContacts[i];
    let name = selectedName["name"];
    let mail = selectedName["email"];
    let number = selectedName["tel"];
    let bg = selectedName["bg"];
    let initials = name
        .split(" ")
        .map((n) => n[0])
        .join("");
    let letter = name.charAt(0);
    letters.push(letter);
    let contact = document.getElementById("open-contact");
    contact.classList.remove("d-none");
    contact.innerHTML = "";
    contact.innerHTML += generateHTMLshowContact(name, mail, number, bg, initials, i);
}

function toggleContact(i) {
    if (window.innerWidth >= 1350) {
        if (openContact && selectedContactIndex === i) {
            document.getElementById("open-contact").classList.add("d-none");
            openContact = false;
            document.querySelectorAll(".contact-item").forEach((item) => {
                item.classList.remove("setUserproperty");
            });
        } else {
            showContact(i);
            openContact = true;
            selectedContactIndex = i;
        }
    } else {
        showContact(i);
        document.querySelectorAll(".contact-item").forEach((item) => {
            item.classList.remove("setUserproperty");
        });
    }
}

async function createContact() {
    let name = document.getElementById("contact-name").value;
    let mail = document.getElementById("contact-email").value;
    let tel = document.getElementById("contact-tel").value;

    let newContact = {
        name: name,
        email: mail,
        tel: tel,
        bg: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
        selected: false,
    };

    oldContacts.push(newContact);
    await setItem("oldContacts", oldContacts);
    renderOldContacts();
    closePopUp();
}


async function saveContact(i) {
    document.getElementById("edit-pop-up").classList.add("d-none");
    document.getElementById("edit-pop-up").classList.remove("d-flex");

    let newName = document.getElementById("old-name").value;
    let newMail = document.getElementById("old-email").value;
    let newTel = document.getElementById("old-tel").value;

    if (oldContacts[i]) { 
        oldContacts[i].name = newName;
        oldContacts[i].email = newMail;
        oldContacts[i].tel = newTel;

        await setItem("oldContacts", oldContacts);

        renderOldContacts();
        showContact(i);
    } else {
        console.error("Contact not found at index:", i);
    }
}


function editContact(name, mail, number, bg, initials, i) {
    document.getElementById("edit-pop-up").classList.remove("d-none");
    document.getElementById("edit-pop-up").classList.add("d-flex");

    let edit = document.getElementById("edit-pop-up");
    edit.innerHTML = "";
    edit.innerHTML += generateEditContactHTML(bg, initials, name, mail, number, i);
}

async function deleteContact(i) {
    if (oldContacts[i]) {
        oldContacts.splice(i, 1);

        await setItem("oldContacts", oldContacts);

        renderOldContacts();
        document.getElementById("open-contact").classList.add("d-none");
    } else {
        console.error("Contact not found at index:", i);
    }
}

function openPopUp() {
    document.getElementById("pop-up").classList.remove("d-none");
    document.getElementById("pop-up").classList.add("d-flex");
}

function closePopUp() {
    document.getElementById("pop-up").classList.add("d-none");
    document.getElementById("pop-up").classList.remove("d-flex");
    document.getElementById("edit-pop-up").classList.add("d-none");
    document.getElementById("edit-pop-up").classList.remove("d-flex");
    document.getElementById("contact-name").value = "";
    document.getElementById("contact-email").value = "";
    document.getElementById("contact-tel").value = "";
}

function openMobileName() {
    document.getElementById("resize-contact").classList.remove("d-none-1300");
}

function closeContact() {
    document.getElementById("resize-contact").classList.add("d-none-1300");
}