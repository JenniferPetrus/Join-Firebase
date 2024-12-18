/**
 * Array to store old contact information.
 * @type {Array<{name: string, email: string, tel: string, bg: string, selected: boolean}>}
 */
let oldContacts = [];

/**
 * Stores letters for contact sorting or other operations.
 * @type {Array<string>}
 */
let letters = [];

/**
 * Holds the selected name from the contact list.
 * @type {string}
 */
let selectedName;

/**
 * Indicates whether a contact detail view is open.
 * @type {boolean}
 */
let openContact = false;

/**
 * Index of the currently selected contact in the oldContacts array.
 * @type {number}
 */
let selectedContactIndex;

/**
 * Initializes contacts by loading them from storage and rendering.
 * @async
 */
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

/**
 * Adds input formatting for the telephone input field upon DOM content loaded.
 */
document.addEventListener("DOMContentLoaded", async function () {
    await initContacts();  // Daten von Firebase abrufen
    document.getElementById("contact-tel").addEventListener("input", function () {
        if (this.value.startsWith("+")) this.value = "+" + this.value.slice(1).replace(/[^0-9]/g, "");
        else this.value = this.value.replace(/[^0-9]/g, "");
    });
});

/**
 * Renders the old contacts in the contact list.
 */
function renderOldContacts() {
    let renderContact = document.getElementById("contactName");
    let currentLetter = null;
    renderContact.innerHTML = "";
    oldContacts.sort((a, b) => a.name.localeCompare(b.name));
    getVariablesToRender(renderContact, currentLetter);
}

/**
 * Iterates through oldContacts to render each contact.
 * @param {HTMLElement} renderContact - The container element to render contacts into.
 * @param {string|null} currentLetter - The current letter grouping for sorting contacts.
 */
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

/**
 * Displays contact details in a detailed view.
 * @param {number} i - The index of the contact in the oldContacts array.
 */
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

/**
 * Toggles the display of a contact's detailed view.
 * @param {number} i - The index of the contact in the oldContacts array to toggle.
 */
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

/**
 * Creates a new contact and adds it to the contact list.
 * @async
 */
async function createContact() {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const telInput = document.getElementById('contact-tel');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const telError = document.getElementById('tel-error');

    let valid = true;

    if (nameInput.value.trim() === '') {
        nameError.textContent = 'Please enter a name';
        nameError.style.display = 'block';
        valid = false;
    } else {
        nameError.style.display = 'none';
    }

    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Please enter an email';
        emailError.style.display = 'block';
        valid = false;
    } else {
        emailError.style.display = 'none';
    }

    if (telInput.value.trim() === '') {
        telError.textContent = 'Please enter a phone number';
        telError.style.display = 'block';
        valid = false;
    } else {
        telError.style.display = 'none';
    }

    if (valid) {
        const name = nameInput.value.trim();
        const mail = emailInput.value.trim();
        const tel = telInput.value.trim();

        let newContact = {
            name: name,
            email: mail,
            tel: tel,
            bg: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
            selected: false
        };

        oldContacts.push(newContact);
        
        await setItem("oldContacts", oldContacts);
        
        renderOldContacts();
        closePopUp();
    }
}

function hideErrorMessage(inputField, errorField) {
    inputField.addEventListener('input', function () {
        if (inputField.value.trim() !== '') {
            errorField.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    hideErrorMessage(document.getElementById('contact-name'), document.getElementById('name-error'));
    hideErrorMessage(document.getElementById('contact-email'), document.getElementById('email-error'));
    hideErrorMessage(document.getElementById('contact-tel'), document.getElementById('tel-error'));
});

/**
 * Saves changes to an existing contact.
 * @param {number} i - The index of the contact in the oldContacts array to save.
 */
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

/**
 * Opens a modal to edit a contact's details.
 * @param {string} name - The contact's name.
 * @param {string} mail - The contact's email.
 * @param {string} number - The contact's telephone number.
 * @param {string} bg - The background color for the contact's display.
 * @param {string} initials - The initials of the contact.
 * @param {number} i - The index of the contact in the oldContacts array.
 */
function editContact(name, mail, number, bg, initials, i) {
    document.getElementById("edit-pop-up").classList.remove("d-none");
    document.getElementById("edit-pop-up").classList.add("d-flex");

    let edit = document.getElementById("edit-pop-up");
    edit.innerHTML = "";
    edit.innerHTML += generateEditContactHTML(bg, initials, name, mail, number, i);
}

/**
 * Deletes a contact from the contact list.
 * @param {number} i - The index of the contact in the oldContacts array to delete.
 */
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

/**
 * Opens a popup modal for creating a new contact.
 */
function openPopUp() {
    document.getElementById("pop-up").classList.remove("d-none");
    document.getElementById("pop-up").classList.add("d-flex");
}

/**
 * Closes the popup modal for adding or editing a contact.
 */
function closePopUp() {
    document.getElementById("pop-up").classList.add("d-none");
    document.getElementById("pop-up").classList.remove("d-flex");
    document.getElementById("edit-pop-up").classList.add("d-none");
    document.getElementById("edit-pop-up").classList.remove("d-flex");
    document.getElementById("contact-name").value = "";
    document.getElementById("contact-email").value = "";
    document.getElementById("contact-tel").value = "";
}

/**
 * Opens mobile view for contact name input.
 */
function openMobileName() {
    document.getElementById("resize-contact").classList.remove("d-none-1300");
}

/**
 * Closes the contact view in mobile.
 */
function closeContact() {
    document.getElementById("resize-contact").classList.add("d-none-1300");
}