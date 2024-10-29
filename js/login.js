let users = [];

let user = [];

async function initLogIn() {
    await loadUsers();
}

function navToSignIn() {
    window.location.href = "../../html/user-login/sign-in.html";
}

async function guestLogIn() {
    user = [];
    await setItem("user", JSON.stringify(user));
    window.location.href = "../../html/summary.html";
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

async function logIn() {
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;

    user = users.find((user) => user.email === email && user.password === password);

    if (user) {
        await setItem("user", JSON.stringify(user));
        window.location.href = "../../html/summary.html";
    } else {
        let failureText = document.getElementById("failureTextInLogin");
        failureText.innerHTML = "Email or password are incorrect";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let inputs = document.getElementsByClassName("input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("click", function () {
            document.getElementById("failureTextInLogin").innerHTML = "";
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let passwordInput = document.getElementById("passwordInput");
    let toggleIcon = document.getElementById("togglePasswordVisibility");
    toggleIcon.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggleIcon.src = "../../img/visibility.png"; 
        } else {
            passwordInput.type = "password";
            toggleIcon.src = "../../img/visibility-off.png"; 
        }
    });
    passwordInput.addEventListener("input", function () {
        if (passwordInput.value === "") {
            toggleIcon.src = "../../img/lock.svg"; 
            passwordInput.type = "password";
        }
    });
});