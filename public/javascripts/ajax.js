
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

//place order
$('#checkout-form').submit((e) => {
	e.preventDefault()
	$.ajax({
		url: '/place-order',
		data: $('#checkout-form').serialize(),
		method: 'post',
		success: (response) => {
			if(response.status){
				location.href='/order-success'
			}
		}
	})
})