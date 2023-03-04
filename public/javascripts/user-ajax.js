

$('#signup_form').submit((e) => {
	e.preventDefault();
	$.ajax({
		url: '/register',
		data: $('#signup_form').serialize(),
		method: 'post',
		success: (res) => {
			if (res.err) {
				Swal.fire({
					title: "Signup Failed",
					text: res.err,
					icon: 'error',
					showConfirmButton: true
				})
			}
		}
	})
})

const searchCard = document.querySelector('[search-card]')
const searchTemplate = document.querySelector('[search-template]')

//search among all products
$('#search_bar').on('input', (e) => {
	const value = e.target.value;
	$('#categ_bar').val('');
	$('#subcateg_bar').val('');
	$.ajax({
		url:`/search?q=${value}`,
		method: 'get',
		success: (products) => {
			searchCard.textContent = ""
			products.forEach((product) => {
				const temp = searchTemplate.content.cloneNode(true).children[0];
				const name = temp.querySelector('[data-name]');
				const image = temp.querySelector('[data-image]');
				const link = temp.querySelector('[data-link]');
				const mrp = temp.querySelector('[data-mrp]');
				const srp = temp.querySelector('[data-srp]');

				name.href = `/product/${product._id}`;
				name.textContent = product.productName;
				image.src = `/images/products/${product.image[0]}`;
				link.href = `/product/${product._id}`;
				mrp.textContent = product.mrp;
				srp.textContent = product.srp;
				searchCard.append(temp);
			})
		}
	})
})

//choose subcatogory under a specific category
$('#categ_bar').on('change', function() {
    var categoryId = $('#categ_bar').val();
    $('#subcateg_bar').val('');
    if (categoryId) {
        $.ajax({
            url: '/subcategory/' + categoryId,
            type: 'GET',
            success: function(data) {
                $('#subcateg_bar').html('<option value="" selected>Choose Subcategory</option>');
                data.forEach(function(subcateg) {
                    $('#subcateg_bar').append('<option value="' + subcateg._id + '">' + subcateg.subcategory + '</option>');
                });
            }
        });
    } else {
		//location.reload();
        $('#subcateg_bar').html('<option value="" selected>Choose Subcategory</option>');
    }
});

//filter products according to category & subcategory
$('#categ_bar, #subcateg_bar').on('change',(e)=>{
	const categ = $('#categ_bar').val();
	const subcateg = $('#subcateg_bar').val();

	$.ajax({
		url:'/filter',
		data:{categ,subcateg},
		method:'post',
		success:(products)=>{
			searchCard.textContent = ""
			products.forEach((product) => {
				const temp = searchTemplate.content.cloneNode(true).children[0];
				const name = temp.querySelector('[data-name]');
				const image = temp.querySelector('[data-image]');
				const link = temp.querySelector('[data-link]');
				const mrp = temp.querySelector('[data-mrp]');
				const srp = temp.querySelector('[data-srp]');

				name.href = `/product/${product._id}`;
				name.textContent = product.productName;
				image.src = `/images/products/${product.image[0]}`;
				link.href = `/product/${product._id}`;
				mrp.textContent = product.mrp;
				srp.textContent = product.srp;
				searchCard.append(temp);
			})
		}
	})
})

let toastMixin = Swal.mixin({
	toast: true,
	icon: 'success',
	title: 'General Title',
	animation: false,
	position: 'center',
	showConfirmButton: false,
	timer: 3000,
	timerProgressBar: true,
	didOpen: (toast) => {
		toast.addEventListener('mouseenter', Swal.stopTimer)
		toast.addEventListener('mouseleave', Swal.resumeTimer)
	}
})

function sendOtp() {
	const email = $('#emailAddress').val();
	const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,10}))$/;
	if (!email) {
		$('#email_error').html("Email is required")
		return;
	}
	if (!emailRegex.test(email)) {
		$('#email_error').html("Provide a valid email address")
		return;
	}
	$('#email_error').html('')
	$.ajax({
		url: '/send-otp',
		data: {
			email: $('#emailAddress').val()
		},
		method: 'post',
		success: (res) => {
			if (res.msg) {
				toastMixin.fire({
					animation: true,
					title: res.msg,
					icon: 'success'
				})
			}
			if (res.err) {
				toastMixin.fire({
					animation: true,
					title: res.err,
					icon: 'error'
				})
			}
		}
	})

}

function addToCart(productId) {
	$.ajax({
		url: '/cart-add/' + productId,
		method: 'get',
		success: (res) => {
			if (res.status) {
				let count = $('#cartCount').html();
				count = parseInt(count) + 1;
				$('#cartCount').html(count);

				toastMixin.fire({
					animation: true,
					title: 'Added to cart',
					icon: 'success'
				});
			} else {
				toastMixin.fire({
					animation: true,
					title: 'Already in cart',
					icon: 'error'
				});
			}
		}
	})
}

function delCartItem(itemId) {
	Swal.fire({
		title: "Remove item from Cart",
		type: "warning",
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Remove",
		confirmButtonColor: "#ff0055",
		cancelButtonColor: "#999999",
		reverseButtons: true,
		focusConfirm: false,
		focusCancel: true
	}).then((result) => {
		if (result.isConfirmed) {
			$.ajax({
				url: '/cart-delete/' + itemId,
				method: 'get',
				success: (res) => {
					if (res.remove) {
						let count = $('#cartCount').html();
						count = parseInt(count) - 1;
						$('#cartCount').html(count);
						location.reload();
					}
				}
			})
		}
	})

}

function addToWish(productId) {
	$.ajax({
		url: '/wishlist-add/' + productId,
		method: 'get',
		success: (res) => {
			if (res.status) {
				let count = $('#wishCount').html()
				count = parseInt(count) + 1
				$('#wishCount').html(count)

				toastMixin.fire({
					animation: true,
					title: 'Added to wishlist',
					icon: 'success'
				});
			} else {
				toastMixin.fire({
					animation: true,
					title: 'Already in wishlist',
					icon: 'error'
				});
			}
		}
	})
}

function delWishItem(itemId) {
	Swal.fire({
		title: "Remove item from Wishlist",
		type: "warning",
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Remove",
		confirmButtonColor: "#ff0055",
		cancelButtonColor: "#999999",
		reverseButtons: true,
		focusConfirm: false,
		focusCancel: true
	}).then((result) => {
		if (result.isConfirmed) {
			$.ajax({
				url: '/wishlist-delete/' + itemId,
				method: 'get',
				success: (res) => {
					if (res.remove) {
						let count = $('#wishCount').html()
						count = parseInt(count) - 1
						$('#wishCount').html(count)
						location.reload()
					}
				}
			})
		}
	})
}

function changeItemQty(itemId, prodId, count) {
	$.ajax({
		url: '/cart-qty',
		data: {
			item: itemId,
			product: prodId,
			change: parseInt(count),
			qty: $('#itemCount' + itemId).html()
		},
		method: 'post',
		success: (res) => {
			if (res.status) {
				let itemCount = $('#itemCount' + itemId).html()
				itemCount = parseInt(itemCount) + parseInt(count)
				$('#itemCount' + itemId).html(itemCount)

				let itemPrice = $('#itemPrice' + itemId).html()
				itemPrice = parseInt(itemPrice) + parseInt(res.price)
				$('#itemPrice' + itemId).html(itemPrice)

				$('#total').html(res.total)
			}
			if (res.remove) {
				delCartItem(res.id)
			}
		}
	})
}

function moveToCart(itemId, productId){
	$.ajax({
		url: '/cart-add/' + productId,
		method: 'get',
		success: (res) => {
			if (res.status) {
				let count = $('#cartCount').html();
				count = parseInt(count) + 1;
				$('#cartCount').html(count);

				$.ajax({
					url: '/wishlist-delete/' + itemId,
					method: 'get',
					success: (res) => {
						if (res.remove) {
							let count = $('#wishCount').html()
							count = parseInt(count) - 1
							$('#wishCount').html(count)
						}
					}
				})
				toastMixin.fire({
					animation: true,
					title: 'Moved to cart',
					icon: 'success'
				}).then(()=>{
					location.reload()
				})
				
			} else {
				toastMixin.fire({
					animation: true,
					title: 'Already in cart',
					icon: 'error'
				});
			}
		}
	})
}

function moveToWish(itemId, productId){
	Swal.fire({
		title: "Move item to Wishlist",
		type: "info",
		icon: "info",
		showCancelButton: true,
		confirmButtonText: "Move",
		confirmButtonColor: "#ff0055",
		cancelButtonColor: "#999999",
		reverseButtons: true,
		focusConfirm: false,
		focusCancel: true
	}).then((result) => {
		if (result.isConfirmed) {
			$.ajax({
				url: '/wishlist-add/' + productId,
				method: 'get',
				success: (res) => {
					if (res.status) {
						let count = $('#wishCount').html()
						count = parseInt(count) + 1
						$('#wishCount').html(count)

						$.ajax({
							url: '/cart-delete/' + itemId,
							method: 'get',
							success: (res) => {
								if (res.remove) {
									let count = $('#cartCount').html();
									count = parseInt(count) - 1;
									$('#cartCount').html(count);
								}
							}
						})
						toastMixin.fire({
							animation: true,
							title: 'Moved to wishlist',
							icon: 'success'
						}).then(()=>{
							location.reload()
						})
					} else {
						toastMixin.fire({
							animation: true,
							title: 'Already in wishlist',
							icon: 'error'
						});
					}
				}
			})
		}
	})
}

function Copy(containerid) {
	if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(document.getElementById(containerid));
		window.getSelection().addRange(range);
		try {
			const textToCopy = window.getSelection().toString();
			navigator.clipboard.writeText(textToCopy)
				.then(() => {
					toastMixin.fire({
						animation: true,
						title: 'Coupon code copied',
						icon: 'success'
					});
				})
				.catch((error) => {
					console.error('Failed to copy coupon code to clipboard: ', error);
				});
		} catch (error) {
			console.error('Failed to copy coupon code to clipboard: ', error);
		}
	}
}

function applyCoupon() {
	const couponCode = $('#coupon').val();
	if (!couponCode) {
		$('#err_message').html("enter a couponcode");
		return;
	}
	$.ajax({
		url: '/apply-coupon',
		data: {
			coupon: couponCode
		},
		method: 'post',
		success: (res) => {
			if (res.err) {
				$('#err_message').html(res.err);
			} else {
				$('#err_message').html('');
				$('#success_msg').html(res.message);
				$('#discount').html(res.discount);
				$('#grand_total').html(res.grand);
			}
		}
	})
}

function removeCoupon() {
	$('#coupon').val('')
	toastMixin.fire({
		animation: true,
		title: 'Removed coupon',
		icon: 'warning'
	}).then(() => {
		location.reload()
	})
}

//place order
$('#checkout_form').submit((e) => {
	e.preventDefault()
	$.ajax({
		url: '/place-order',
		data: $('#checkout_form').serialize(),
		method: 'post',
		success: (res) => {
			if (res.err) {
				Swal.fire("Order failed!", res.err);
			}
			if (res.cod) {
				location.href = '/order-success';
			}
			if (res.online) {
				const orderData = {
					id: res.orderId,
					total: res.total,
					discount: res.discount,
					grandtotal: res.grandtotal
				}
				onlinePayment(orderData)
			}
		}
	})
})

//online payment
function onlinePayment(order) {
	$.ajax({
		url: '/checkout-session',
		data: order,
		method: 'POST',
		success: (res) => {
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