
function addToCart(productId) {
	$.ajax({
		url: '/cart/add/' + productId,
		method: 'get',
		success: (response) => {
			if (response.status) {
				let count = $('#cartCount').html()
				count = parseInt(count) + 1
				$('#cartCount').html(count)
			}
		}
	})
}

function delCartItem(itemId) {
	$.ajax({
		url: '/cart/delete/' + itemId,
		method: 'get',
		success: (response) => {
			if (response.remove) {
				let count = $('#cartCount').html()
				count = parseInt(count) - 1
				$('#cartCount').html(count)
				location.reload()
			}
		}
	})
}

function addToWish(productId) {
	$.ajax({
		url: '/wishlist/add/' + productId,
		method: 'get',
		success: (response) => {
			if (response.status) {
				let count = $('#wishCount').html()
				count = parseInt(count) + 1
				$('#wishCount').html(count)
			} else {
				alert("already exists")
			}
		}
	})
}

function delWishItem(itemId) {
	$.ajax({
		url: '/wishlist/delete/' + itemId,
		method: 'get',
		success: (response) => {
			if (response.remove) {
				let count = $('#wishCount').html()
				count = parseInt(count) - 1
				$('#wishCount').html(count)
				location.reload()
			}
		}
	})
}

function changeItemQty(itemId, prodId, count) {
	$.ajax({
		url: '/cart/quantity',
		data: {
			item: itemId,
			product: prodId,
			change: parseInt(count),
			qty: $('#itemCount' + itemId).html()
		},
		method: 'post',
		success: (response) => {
			if (response.status) {
				let itemCount = $('#itemCount' + itemId).html()
				itemCount = parseInt(itemCount) + parseInt(count)
				$('#itemCount' + itemId).html(itemCount)

				let itemPrice = $('#itemPrice' + itemId).html()
				itemPrice = parseInt(itemPrice) + parseInt(response.price)
				$('#itemPrice' + itemId).html(itemPrice)

				$('#total').html(response.total)
			}
			if (response.remove) {
				location.reload()
			}
		}
	})
}

function moveToCart(itemId, productId) {
	delWishItem(itemId)
	addToCart(productId)
}

function moveToWish(itemId, productId) {
	delCartItem(itemId)
	addToWish(productId)
}

function applyCoupon(){
	$.ajax({
		url:'/apply-coupon',
		data: {
			coupon: $('#coupon').val()
		},
		method: 'post',
		success:(res)=>{
			if(res.err){
				$('#err_message').html(res.err);
			}else{
				$('#err_message').html('');
				$('#success_msg').html(res.message);
				$('#discount').html(res.discount);
				$('#grand_total').html(res.grand);
			}
		}
	})
}

//place order
$('#checkout-form').submit((e) => {
	e.preventDefault()
	$.ajax({
		url: '/place-order',
		data: $('#checkout-form').serialize(),
		method: 'post',
		success: (res) => {
			if (res.status) {
				location.href = '/order-success'
			} else {
				onlinePayment(res.items,res.orderId)
			}
		}
	})
})

//online payment
function onlinePayment(items,orderId){
	$.ajax({
		url:'/checkout-session/'+orderId,
		headers:{
			'Content-Type': 'application/json'
		},
		data:JSON.stringify(items),
		method:'POST',
		success:(res)=>{
			location.href = res.url
		}
	})
}

//cancel order
function cancelOrder(orderId) {
	$.ajax({
		url: '/order-cancel/' + orderId,
		method: 'get',
		success: (response) => {
			if (response.cancel) {
				$('#orderStatus' + orderId).html('Cancelled')
				// location.reload()
			}
		}
	})
}