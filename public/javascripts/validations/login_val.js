const form = document.getElementById('login_form');
const email = document.getElementById('emailAddress');
const password = document.getElementById('pswd');

form.addEventListener('submit', event => {
    event.preventDefault();
    validateInputs();
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.valid_error');

    errorDisplay.innerText = message;
    inputControl.classList.add('valid_error');
    inputControl.classList.remove('success');
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.valid_error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('valid_error');
}

const isValidEmail = email => {
    const regexMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,10}))$/;
    return regexMail.test(String(email).toLowerCase());
}

const isBlank = (str)=>{
    const regexBlank = /^\s*$/;
    return regexBlank.test(str);
}

const validateInputs = () => {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if(emailValue === ''||isBlank(emailValue)) {
        setError(email, 'Email is required');
        return;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
        return;
    } else {
        setSuccess(email);
    }

    if(passwordValue === ''||isBlank(passwordValue)) {
        setError(password, 'Password is required');
        return;
    }else {
        setSuccess(password);
    }

    form.submit();
}
