const form = document.getElementById('subcateg_form');
const categ = document.getElementById('categ');
const subcateg = document.getElementById('subcateg');

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

const validateInputs = () => {
    const categValue = categ.value.trim();
    const subcategValue = subcateg.value.trim();

    if(categValue === '') {
        setError(categ, 'Select a category');
        return;
    }else {
        setSuccess(categ);
    }

    if(subcategValue === '') {
        setError(subcateg, 'Subcategory is required');
        return;
    }else {
        setSuccess(subcateg);
    }

    form.submit();
}