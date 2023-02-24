const form = document.getElementById('reset_form');
const email = document.getElementById('emailAddress');
const otp = document.getElementById('otp');
const password = document.getElementById('pswd');
const password2 = document.getElementById('pswd2');

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

const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.valid_error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('valid_error');
};

const isValidEmail = (email) => {
    const regexMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,10}))$/;
    return regexMail.test(String(email).toLowerCase());
}

const isValidPassword = (password) =>{
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/;
    return regexPass.test(password);
}

const isValidOtp = (otp) =>{
  const regexPass = /^[0-9]{6}$/;
  return regexPass.test(otp);
}

const isBlank = (str)=>{
    const regexBlank = /^\s*$/;
    return regexBlank.test(str);
}

const validateInputs = () => {
    const emailValue = email.value.trim();
    const otpValue = otp.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if(emailValue === ''||isBlank(emailValue)) {
        setError(email, 'Email is required');
        return;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
        return;
    } else {
        setSuccess(email);
    }

    if(otpValue === ''||isBlank(otpValue)) {
      setError(otp, 'OTP is required');
      return;
  } else if (!isValidOtp(otpValue)) {
      setError(otp, 'Provide a valid 6-digit OTP');
      return;
  } else {
    setSuccess(otp);
}

    if(passwordValue === ''||isBlank(passwordValue)) {
        setError(password, 'Password is required');
        return;
    } else if (passwordValue.length < 8 ) {
        setError(password, 'Password must be at least 8 character.');
        return;
    }else if(passwordValue.length > 20){
        setError(password, 'Password must not exeed 20 character.');
        return;
    }else if(!isValidPassword(passwordValue)){
        setError(password, 'Password must contain uppercase,lowercase,number,special character.');
        return;
    }
     else {
        setSuccess(password);
    }

    if(password2Value === ''||isBlank(password2Value)) {
        setError(password2, 'Please confirm your password');
        return;
    } else if (password2Value !== passwordValue) {
        setError(password2, "Passwords doesn't match");
        return;
    } else {
        setSuccess(password2);
    }
    form.submit();
};

const togglePassword = document.querySelector("#togglePassword");

togglePassword.addEventListener("click", function () {
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    
    // toggle the icon
    this.classList.toggle("bi-eye");
});
  