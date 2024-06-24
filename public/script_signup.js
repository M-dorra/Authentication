
document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup");
    const signupFields = {
        firstName: signupForm.querySelector("input[name='firstName']"),
        lastName: signupForm.querySelector("input[name='lastName']"),
        email: signupForm.querySelector("input[name='email']"),
        password: signupForm.querySelector("input[name='password']"),
        confirmPassword: signupForm.querySelector("input[name='confirmPassword']")
    };

    signupForm.onsubmit = async (e) => {
        e.preventDefault();
        let isValid = true;
        Object.values(signupFields).forEach(field => {
            isValid = isValid && validateInput(field);
        });
        
        if (isValid) {
            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firstName: signupFields.firstName.value,
                        lastName: signupFields.lastName.value,
                        email: signupFields.email.value,
                        password: signupFields.password.value
                    })
                });
                
                if (response.ok) {
                    window.location.href = "thankyou.html";
                } else {
                    console.error('Signup request failed');
                }
            } catch (error) {
                console.error('Error submitting signup form:', error);
            }
        }
    };

    function validateInput(input) {
        const field = input.parentElement.parentElement;
        const errorTxt = field.querySelector(".error-txt");
        const inputValue = input.value.trim();
        const errorIcon = field.querySelector(".error-icon");

        if (input === signupFields.confirmPassword) {
            const password = signupFields.password.value.trim();
            if (inputValue === "") {
                field.classList.add("shake", "error");
                errorTxt.innerText = "Confirm password can't be blank";
                errorIcon.style.display = "block";
                return false;
            } else if (inputValue !== password) {
                field.classList.add("shake", "error");
                errorIcon.style.display = "block";
                errorTxt.innerText = "Passwords don't match";
                return false;
            }
        }
        if (inputValue === "") {
            field.classList.add("shake", "error");
            errorTxt.innerText = `${input.placeholder} can't be blank`;
            errorIcon.style.display = "block";
            return false;
        } else {
            field.classList.remove("shake", "error");
            errorIcon.style.display = "none";
            errorTxt.innerText = "";
        }

        if (input === signupFields.email) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(inputValue)) {
                field.classList.add("shake", "error");
                errorIcon.style.display = "block";
                errorTxt.innerText = "Enter a valid email address";
                return false;
            }
        }

        if (input === signupFields.password) {
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{10,}$/;
            if (!passwordPattern.test(inputValue)) {
                field.classList.add("shake", "error");
                errorIcon.style.display = "block";
                errorTxt.innerText = "Password must contain at least 10 characters including one uppercase letter, one lowercase letter, one number, and one special character.";
                return false;
            }
        }
        return true;
    }

    const passwordInput = signupFields.password;
    const confirmPasswordInput = signupFields.confirmPassword;
    const togglePassword1 = document.getElementById("togglePassword1");
    const togglePassword2 = document.getElementById("togglePassword2");

    togglePassword1.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword1.classList.remove("fa-eye-slash");
            togglePassword1.classList.add("fa-eye");
        } else {
            passwordInput.type = "password";
            togglePassword1.classList.remove("fa-eye");
            togglePassword1.classList.add("fa-eye-slash");
        }
    });

    togglePassword2.addEventListener("click", function () {
        if (confirmPasswordInput.type === "password") {
            confirmPasswordInput.type = "text";
            togglePassword2.classList.remove("fa-eye-slash");
            togglePassword2.classList.add("fa-eye");
        } else {
            confirmPasswordInput.type = "password";
            togglePassword2.classList.remove("fa-eye");
            togglePassword2.classList.add("fa-eye-slash");
        }
    });
});
