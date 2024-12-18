/**
 * Array to store user data.
 * @type {Array<{name: string, email: string, password: string}>}
 */
let users = [];

/**
 * Initializes the registration process by loading users from storage.
 * @async
 */
async function initRegister() {
    await loadUsers();
}

/**
 * Registers a new user if the password is confirmed. Checks if the user already exists based on email and name.
 * If the user does not exist, adds the new user to the users array and updates the storage.
 * If the user exists, displays an error message. Redirects to the login page upon successful registration.
 * @async
 */
async function register() {
    let nameInput = document.getElementById("inputName");
    let emailInput = document.getElementById("inputEmail");
    let passwordInput = document.getElementById("inputPassword");
    let confirmPasswordInput = document.getElementById("inputConfirmPassword");
    
    let nameError = document.getElementById("nameError");
    let emailError = document.getElementById("emailError");
    let passwordError = document.getElementById("passwordError");
    let confirmPasswordError = document.getElementById("confirmPasswordError");
    
    nameError.innerHTML = "";
    emailError.innerHTML = "";
    passwordError.innerHTML = "";
    confirmPasswordError.innerHTML = "";

    let hasError = false;

    if (nameInput.value.trim() === "") {
        nameError.innerHTML = "Please enter your name";
        hasError = true;
    }
    if (emailInput.value.trim() === "") {
        emailError.innerHTML = "Please enter your email";
        hasError = true;
    }
    if (passwordInput.value.trim() === "") {
        passwordError.innerHTML = "Please enter your password";
        hasError = true;
    }
    if (confirmPasswordInput.value.trim() === "") {
        confirmPasswordError.innerHTML = "Please confirm your password";
        hasError = true;
    }
    let checkbox = document.querySelector(".checkbox-input");
    let checkboxError = document.getElementById("checkboxError");
    if (!checkbox.checked) {
        checkboxError.innerHTML = "Please accept the privacy policy";
        hasError = true;
    } else {
        checkboxError.innerHTML = ""; 
    }
    if (hasError) {
        return;
    }
    if (isPasswordConfirmed()) {
        let message = 'You Signed Up successfully';
        let newUser = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
        };
        let userExists = users.find((user) => user.email === newUser.email && user.name === newUser.name);
        if (userExists) {
            let failureText = document.getElementById("failureText");
            failureText.innerHTML = "User already exists";
        } else {
            users.push(newUser);
            await setItem("users", JSON.stringify(users));
            document.getElementById("popup-container").innerHTML = getPopUpTemplate(message);
            setTimeout(function () {
                window.location.href = "../../html/user-login/log-in.html";
            }, 1000);
        }
        await loadUsers();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("input", function () {
            document.getElementById("nameError").innerHTML = ""; 
            document.getElementById("emailError").innerHTML = ""; 
            document.getElementById("passwordError").innerHTML = "";
            document.getElementById("confirmPasswordError").innerHTML = "";
            document.getElementById("failureText").innerHTML = "";
        });
    }
    let checkbox = document.querySelector(".checkbox-input");
    checkbox.addEventListener("change", function () {
        let checkboxError = document.getElementById("checkboxError");
        checkboxError.innerHTML = ""; 
    });
});

/**
 * Navigates the user back to the login page.
 */
function backToLogIn() {
    window.location.href = "log-in.html";
}

/**
 * FOR TESTING: Loads the list of users from storage. Initializes the users array if no users are found or an error occurs.
 * @async
 */
async function loadUsers() {
    try {
        let loadedUsers = JSON.parse(await getItem("users"));
        if (Array.isArray(loadedUsers)) {
            users = loadedUsers;
        } else {
            users = [];
        }
    } catch (error) {
        console.error("Fehler beim Laden der Benutzer: ", error);
        users = [];
    }
}

/**
 * Checks if the password entered matches the confirmation password.
 * Updates the UI to reflect the validation result.
 * @returns {boolean} True if the passwords match, false otherwise.
 */
function isPasswordConfirmed() {
    let password = document.getElementById("inputPassword");
    let confirmPassword = document.getElementById("inputConfirmPassword");
    let confirmPasswordContainer = document.getElementById("confirm-password-container");
    if (password.value === confirmPassword.value) {
        confirmPasswordContainer.style.border = "";
        return true;
    } else {
        let failureText = document.getElementById("failureText");
        failureText.innerHTML = "Ups! your password dont match";
        confirmPasswordContainer.style.border = "2px solid #FF4057";
        return false;
    }
}

/**
 * Sets up event listeners to clear validation messages and styles upon user interaction with the confirmation password field.
 */
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("confirm-password-container")) {
        document.getElementById("confirm-password-container").addEventListener("click", function () {
            this.style.border = "";
            document.getElementById("failureText").innerHTML = "";
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".togglePasswordVisibility").forEach(toggleIcon => {
        toggleIcon.addEventListener("click", function () {
            let passwordInput = document.getElementById("inputPassword");
            let confirmPasswordInput = document.getElementById("inputConfirmPassword");
            let newType = passwordInput.type === "password" ? "text" : "password";
            let newImagePath = newType === "text" ? "../../img/visibility.png" : "../../img/visibility-off.png";
            passwordInput.type = newType;
            confirmPasswordInput.type = newType;
            document.querySelectorAll(".togglePasswordVisibility").forEach(icon => {
                icon.src = newImagePath;
            });
        });
    });

    let passwordFields = [document.getElementById("inputPassword"), document.getElementById("inputConfirmPassword")];
    passwordFields.forEach(field => {
        field.addEventListener("input", function () {
            if (field.value === "") {
                document.querySelectorAll(".togglePasswordVisibility").forEach(icon => {
                    icon.src = "../../img/lock.svg";
                });
                field.type = "password";
            }
        });
    });
});
