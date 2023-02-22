const form = document.getElementById('address_form');
const username = document.getElementById('username');
const company = document.getElementById('company');
const email = document.getElementById('emailAddress');
const mobile = document.getElementById('mobile');
const country = document.getElementById('country');
const state = document.getElementById('state');
const town = document.getElementById('town');
const zip = document.getElementById('zip');
const address = document.getElementById('address');


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

const isValidMobile = (mobile) =>{
    const regexMob = /^[5-9]{1}[0-9]{9}$/;
    return regexMob.test(mobile);
}

const isValidZip = (zip) =>{
    const regexZip = /^[0-9]{4,7}$/;
    return regexZip.test(zip);
}

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const companyValue = company.value.trim();
    const emailValue = email.value.trim();
    const mobileValue = mobile.value.trim();
    const countryValue = country.value.trim();
    const stateValue = state.value.trim();
    const townValue = town.value.trim();
    const zipValue = zip.value.trim();
    const addressValue = address.value.trim();


    if(usernameValue === '') {
        setError(username, 'Full name is required');
        return;
    } else {
        setSuccess(username);
    }

    if(companyValue === '') {
        setError(company, 'company/shop is required');
        return;
    } else {
        setSuccess(company);
    }

    if(emailValue === '') {
        setError(email, 'Email is required');
        return;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
        return;
    } else {
        setSuccess(email);
    }

    if(mobileValue === '') {
        setError(mobile, 'Mobile is required');
        return;
    } else if (!isValidMobile(mobileValue)) {
        setError(mobile, 'Provide a valid 10-digit mobile number');
        return;
    } else {
      setSuccess(mobile);
    }

    if(countryValue === '') {
        setError(country, 'country is required');
        return;
    } else {
        setSuccess(country);
    }

    if(stateValue === '') {
        setError(state, 'state is required');
        return;
    } else {
        setSuccess(state);
    }

    if(townValue === '') {
        setError(town, 'town is required');
        return;
    } else {
        setSuccess(town);
    }

    if(zipValue === '') {
        setError(zip, 'zip code is required');
        return;
    }else if(!isValidZip(zipValue)){
        setError(zip, 'Provide valid zip code');
        return;
    }else {
        setSuccess(zip);
    }

    if(addressValue === '') {
        setError(address, 'address is required');
        return;
    } else {
        setSuccess(address);
    }
    
    form.submit();
};