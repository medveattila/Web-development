const cartItemUpdateFormElements = document.querySelectorAll('.cart-item-management');
const cartTotalPriceElement = document.getElementById('cart-total-price');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

async function updateCartItem(event) {
    event.preventDefault(); //megakadályozzuk hogy a böngésző csinálja a request küldést

    const form = event.target;
    
    const productId = form.dataset.productid;
    const csrfToken = form.dataset.csrf;
    const quantity = form.firstElementChild.value; //firstElementChild itt az input

    let response;

    try {
        response = await fetch('/cart/items', {
            method: 'PATCH',
            body: JSON.stringify({
                productId: productId, //ezek ugyan azok mint a controllerbe
                quantity: quantity,
                _csrf: csrfToken
    
            }), 
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        alert('Something went wrong!');
        return;
    }

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    const responseData = await response.json(); //kiszedjük a válaszban kapott adatokat egy objektumba

    if (responseData.updatedCartData.updatedItemPrice === 0) {
        form.parentElement.parentElement.remove(); //kitöröljük az egész cart-itemet (li)
    } else { //csak akkor updatelünk ha a cart item megmarad
        const cartItemTotalPriceElement = form.parentElement.querySelector('.cart-item-price'); //queryselectort bármelyik elementen lehet használni
        cartItemTotalPriceElement.textContent = responseData.updatedCartData.updatedItemPrice.toFixed(2); //egy termék összes ára
    }


     //összes termék ára
    cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice.toFixed(2);

    //a cart melletti termékszám jelző
    for (const cartBadgeElement of cartBadgeElements) {
        cartBadgeElement.textContent = responseData.updatedCartData.newTotalQuantity;
    }

}

for (const formElement of cartItemUpdateFormElements) {
    formElement.addEventListener('submit', updateCartItem); //nem a buttonhoz adunk egy click event listenert, hanem a form submitot figyeljük itt
}