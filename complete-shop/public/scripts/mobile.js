const mobileMenuButtonElement = document.getElementById('mobile-menu-btn');  
const mobileMenuElement = document.getElementById('mobile-menu');  

function toggleMobileMenu() {
    mobileMenuElement.classList.toggle('open'); //toggles the given css class (remove if present, add if missing)
}

mobileMenuButtonElement.addEventListener('click', toggleMobileMenu); //not executed immediatly, only when click occurs