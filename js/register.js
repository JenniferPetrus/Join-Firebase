let users = [];

async function initRegister() {
    await loadUsers();
}

async function register() {
    if (isPasswordConfirmed()) {
        let message = 'You Signed Up successfully';
        let newUser = {
            name: inputName.value,
            email: inputEmail.value,
            password: inputPassword.value,
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

function backToLogIn() {
    window.location.href = "log-in.html";
}

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
