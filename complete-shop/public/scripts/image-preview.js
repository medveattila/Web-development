const imagePickerElement = document.querySelector('#image-upload-control input'); //az i-u-c id-vel rendelkező részben található első input element
const imagePreviewElement = document.querySelector('#image-upload-control img');

function updateImagePreview() {
    const files = imagePickerElement.files; //ez egy array, lehetne mondjuk több képet is feltölteni (itt csak 1 lesz)

    if (!files || files.length === 0) { //ha nincs kép
        imagePreviewElement.style.display = 'none';
        return;
    }

    const pickedFile = files[0];

    imagePreviewElement.src = URL.createObjectURL(pickedFile); //egy olyan url-t generál a képhez, ami nem mutat a szerverre
    imagePreviewElement.style.display = 'block';
}

imagePickerElement.addEventListener('change', updateImagePreview); //akkor aktiválódik az event listener, ha az user megváltoztatja a képet (ill. bármit az adott elemen)