const addToCartButtonElement = document.querySelector('#product-details button');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge'); //mivel a mobil menu miatt 2 badgeunk van

async function addToCart() {
    const productId = addToCartButtonElement.dataset.productid;
    const csrfToken = addToCartButtonElement.dataset.csrf;

    let response;

    try {
        response = await fetch('/cart/items', {
            method: 'POST',
            body: JSON.stringify({
                productId: productId,//kell bele mert ez alapján keresi meg az adatbázisban a fájlt (ua. property mint ami a classban van)
                _csrf: csrfToken//minden nem get requestnél kell a csrf token
            }),
            headers: {
                'Content-Type': 'application/JSON' //custom requesteknél be kell állítani azt, hogy mit küldünk
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

    const responseData = await response.json();

    const newTotalQuantity = responseData.newTotalItems;

    for (const cartBadgeElement of cartBadgeElements) { //minden badget updatelunk
        cartBadgeElement.textContent = newTotalQuantity;
    }


}

addToCartButtonElement.addEventListener('click', addToCart);