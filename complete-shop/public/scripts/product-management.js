const deleteProductButtonElements = document.querySelectorAll('.product-item button'); //így az összes elementet kiválasztja

async function deleteProduct(event) { 
    const buttonElement = event.target; //ez a konkrét gomv ami meg lett nyomva
    const productId = buttonElement.dataset.productid; //így érjük el az ejs-ben megadott data-productid-t
    const csrfToken = buttonElement.dataset.csrf;

    const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, { //kiküldjük a szerver felé a requestet a js kódból, ha az adatbázis más szerveren van, kell elé a domain is! ?: query parameter
        method: 'DELETE' //delete request küldése a szerver felé (így jobb mint egy post request)
    }); 

    if (!response.ok) { //ha nem sikerült a törlés
        alert('Something went wrong!');
        return;
    }

    buttonElement.parentElement.parentElement.parentElement.parentElement.remove(); //DOM traversal - ez a li amibe van az egész product item, remove: az element eltávolítása


}

for (const deleteProductButtonElement of deleteProductButtonElements) {
    deleteProductButtonElement.addEventListener('click', deleteProduct);
}