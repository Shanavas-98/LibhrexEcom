const form = document.getElementById('product_form');
const product = document.getElementById('product_name');
const description = document.getElementById('descript');
const price = document.getElementById('price');
const sell = document.getElementById('sell_price');
const quantity = document.getElementById('quantity');
const category = document.getElementById('categ');
const subcategory = document.getElementById('subcateg');


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

const isBlank = (str)=>{
    const regexBlank = /^\s*$/;
    return regexBlank.test(str);
}

const validateInputs = () => {
    const productValue = product.value.trim();
    const descriptValue = description.value.trim();
    const priceValue = price.value.trim();
    const sellValue = sell.value.trim();
    const qtyValue = quantity.value.trim();
    const categValue = category.value.trim();
    const subcategValue = subcategory.value.trim();

    if(productValue === ''||isBlank(productValue)) {
        setError(product, 'product title required');
        return;
    }else {
        setSuccess(product);
    }

    if(descriptValue === ''||isBlank(descriptValue)) {
        setError(description, 'description required');
        return;
    }else {
        setSuccess(description);
    }

    if(priceValue === ''||isBlank(priceValue)) {
        setError(price, 'price required');
        return;
    }else {
        setSuccess(price);
    }

    if(sellValue === ''||isBlank(sellValue)) {
        setError(price, 'sell price required');
        return;
    }else {
        setSuccess(price);
    }

    if(qtyValue === ''||isBlank(qtyValue)) {
        setError(quantity, 'quantity required');
        return;
    }else {
        setSuccess(quantity);
    }

    if(categValue === ''||isBlank(categValue)) {
        setError(category, 'select a category');
        return;
    }else {
        setSuccess(category);
    }

    if(subcategValue === ''||isBlank(subcategValue)) {
        setError(subcategory, 'select a subcategory');
        return;
    }else {
        setSuccess(subcategory);
    }

    form.submit();
}