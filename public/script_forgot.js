const form = document.querySelector("form");
const eField = form.querySelector(".email");
const eInput = eField.querySelector("input");
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const emailErrorIcon = document.querySelector(".email .error-icon");

form.onsubmit = async (e) => {
    e.preventDefault();

    if (eInput.value.trim() === "") {
        displayError("Email can't be blank");
        emailErrorIcon.style.display = "block";
        return;
    }

    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!eInput.value.match(pattern)) {
        displayError("Enter a valid email address");
        emailErrorIcon.style.display = "block";
        return;
    }

    eField.classList.remove("shake", "error");

    try {

        const response = await fetch("/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: eInput.value })
        });

        const data = await response.json();

        if (response.ok) {
            successMessage.textContent = "Password reset email sent successfully!";
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
            emailErrorIcon.style.display = "none";
            setTimeout(() => {
                window.location.href = './index.html';
            }, 1000);
        } else {
            errorMessage.textContent = "user not found";
            errorMessage.style.display = 'block';
            emailErrorIcon.style.display = "block";
        }
    } catch (error) {
        console.error('Error sending request:', error);
        errorMessage.textContent = "Error sending request";
        errorMessage.style.display = 'block';
    }
};

function displayError(message) {
    eField.classList.add("shake", "error");
    
    let errorTxt = eField.querySelector(".error-txt");
    errorTxt.innerText = message;
}
  eInput.onkeyup = () => {
                if (eInput.value.trim() !== "") {
                    eField.classList.add("valid");
                    emailErrorIcon.style.display = "none";
                } else {
                    eField.classList.remove("valid");
                    emailErrorIcon.style.display = "block";
                }
            };

