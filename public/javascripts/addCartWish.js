function addToCart(productId) {
    fetch('/addToCart', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
    }).then(res => res.json())
        .then((response) => {
            if (response.cartState) {
                swal("Item added to cart");
            } else {
                location.href = '/cart';
            }
        }).catch((error) => {
            location.href = '/login';
            console.log('Error: ', error.message);
        })
}

function addToWishlist(productId) {
    fetch('/addToWishlist', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
    }).then(res => res.json()).then((response) => {
        if(response.wishlistStatus){
            swal("Item added to wishlist");
        }else{
            swal("Item removed from wishlist");
        }
    }).catch((error) => {
        location.href = '/login';
        console.log('Error: ', error.message);
    })
}