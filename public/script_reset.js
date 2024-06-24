
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        const tokenInput = document.getElementById('token');
        if (tokenInput) {
            tokenInput.value = token;
        } else {
            console.error('Token input field not found');
        }
    } else {
        console.error('Token not found in URL');
    }


    const form = document.getElementById('resetForm');
    const passwordField = form.querySelector('.password');
    const confirmPasswordField = form.querySelector('.confirmPassword');
    const pInput = passwordField.querySelector("input");
    const cpInput = confirmPasswordField.querySelector("input");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const cpasswordInput = document.getElementById("confirmPassword");
    const toggleCPassword = document.getElementById("toggleCPassword");
   
    const passwordErrorIcon = document.querySelector(".password .error-icon");
    const cpasswordErrorIcon = document.querySelector(".confirmPassword .error-icon");
 
    togglePassword.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");
        } else {
            passwordInput.type = "password";
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
        }
    });
    toggleCPassword.addEventListener("click", function () {
        if (cpasswordInput.type === "password") {
            cpasswordInput.type = "text";
            toggleCPassword.classList.remove("fa-eye-slash");
            toggleCPassword.classList.add("fa-eye");
        } else {
            cpasswordInput.type = "password";
            toggleCPassword.classList.remove("fa-eye");
            toggleCPassword.classList.add("fa-eye-slash");
        }
    });
    form.onsubmit = async (e) => {
        e.preventDefault();
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{10,}$/;
        if (pInput.value.trim() === "" || !passwordPattern.test(pInput.value)) {
            passwordField.classList.add("shake", "error");
            passwordErrorIcon.style.display = "block";
        } else {
            passwordField.classList.remove("shake", "error");
            passwordErrorIcon.style.display = "none";
        }

        if (cpInput.value.trim() === "" || cpInput.value !== pInput.value) {
            confirmPasswordField.classList.add("shake", "error");
            cpasswordErrorIcon.style.display = "block";
        } else {
            confirmPasswordField.classList.remove("shake", "error");
            cpasswordErrorIcon.style.display= "none";
        }

        setTimeout(() => {
            passwordField.classList.remove("shake");
            confirmPasswordField.classList.remove("shake");
        }, 500);

        if (pInput.value.trim() !== "" && pInput.value === cpInput.value && passwordPattern.test(pInput.value)) {
            try {
                const response = await fetch('/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: document.getElementById('token').value,
                        password: pInput.value
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    form.submit();
                    window.location.href = '/reset-success.html';

                } else {
                    console.error("Error resetting password:");
                }
            } catch (error) {
                console.error("Error resetting password:", error);
            }
        }
    };

    pInput.onkeyup = () => {
        if (pInput.value.trim() !== "") {
            passwordField.classList.add("valid");
            passwordErrorIcon.style.display = "none";
        } else {
            passwordField.classList.remove("valid");
            passwordErrorIcon.style.display = "block";
        }
    };

    cpInput.onkeyup = () => {
        if (cpInput.value.trim() !== "") {
            confirmPasswordField.classList.add("valid");
            cpasswordErrorIcon.style.display = "none";
        } else {
            confirmPasswordField.classList.remove("valid");
            cpasswordErrorIcon.style.display = "block";
        }
    };
});
