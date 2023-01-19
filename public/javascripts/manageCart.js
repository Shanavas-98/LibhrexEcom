        // let addToCartBtn = document.getElementById('add-to-cart');
		// let goToCartBtn = document.getElementById('go-to-cart');
		function addToCart(productId) {
			$.ajax({
				url: '/cart/add/' + productId,
				method: 'get',
				success: (response) => {
					if (response.status) {
						let count = $('#cartCount').html()
						count = parseInt(count)+1
						$('#cartCount').html(count)
						// addToCartBtn.style.display = 'none';
						// goToCartBtn.style.display = 'flex';
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
						count = parseInt(count)-1
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
						count = parseInt(count)+1
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
						count = parseInt(count)-1
						$('#wishCount').html(count)
						location.reload()
					}
				}
			})
		}

        function changeItemQty(itemId,prodId,count) {
			$.ajax({
				url: '/cart/quantity',
                data:{
                    item: itemId,
                    product: prodId,
                    change: parseInt(count)
                },
				method: 'post',
				success: (response) => {
					if (response.status) {
						let itemCount = $('#itemCount').html()
						itemCount = parseInt(itemCount)+count
						$('#itemCount').html(itemCount)
					}
                    if(response.remove){
                        location.reload()
                    }
				}
			})
		}

		function moveToCart(itemId,productId) {
				$.ajax({
					url: '/wishlist/delete/' + itemId,
					method: 'get',
					success: (response) => {
						if (response.remove) {
							let count = $('#wishCount').html()
							count = parseInt(count)-1
							$('#wishCount').html(count)
							location.reload()
						}
					}
				})
				$.ajax({
					url: '/cart/add/' + productId,
					method: 'get',
					success: (response) => {
						if (response.status) {
							let count = $('#cartCount').html()
							count = parseInt(count)+1
							$('#cartCount').html(count)
						}
					}
				})
		}

		function moveToWish(itemId,productId) {
			$.ajax({
				url: '/cart/delete/' + itemId,
				method: 'get',
				success: (response) => {
					if (response.remove) {
						let count = $('#cartCount').html()
						count = parseInt(count)-1
						$('#cartCount').html(count)
                        location.reload()
					}
				}
			})
			$.ajax({
				url: '/wishlist/add/' + productId,
				method: 'get',
				success: (response) => {
					if (response.status) {
						let count = $('#wishCount').html()
						count = parseInt(count)+1
						$('#wishCount').html(count)
					} else {
						alert("already exists")
					}
				}
			})
	}