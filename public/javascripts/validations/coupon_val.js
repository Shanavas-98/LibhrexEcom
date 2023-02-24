const form = document.getElementById('coupon_form');
const coupon = document.getElementById('coupon');
const percent = document.getElementById('percent');
const bill = document.getElementById('bill');
const discount = document.getElementById('discount');
const date = document.getElementById('date');

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
    const couponValue = coupon.value.trim();
    const percentValue = percent.value.trim();
    const billValue = bill.value.trim();
    const discountValue = discount.value.trim();
    const dateValue = date.value.trim();

    if(couponValue === ''||isBlank(couponValue)) {
        setError(coupon, 'coupon code required');
        return;
    }else {
        setSuccess(coupon);
    }

    if(percentValue === ''||isBlank(percentValue)) {
        setError(percent, 'discount requied');
        return;
    }else {
        setSuccess(percent);
    }

    if(billValue === ''||isBlank(billValue)) {
        setError(bill, 'min bill required');
        return;
    }else {
        setSuccess(bill);
    }

    if(discountValue === ''||isBlank(discountValue)) {
        setError(discount, 'max discount required');
        return;
    }else {
        setSuccess(discount);
    }

    if(dateValue === ''||isBlank(dateValue)) {
        setError(date, 'validity date required');
        return;
    }else {
        setSuccess(date);
    }

    form.submit();
}