// Solution to parcel not distributing images from js code
const images = require('../img/galeria/*.jpg');
const galleryData = [];

let visibleGallery = [];
let visibleGalleryLength = document.querySelectorAll('.gallery__display__item').length - 1;

// Solution to non-iterable objects
for (let image in images) {
    galleryData.push(images[image]);
}

// Generate visibleGallery Array with no repetition
for (let i = 0; i <= visibleGalleryLength; i++) {

    const randomGalleryIndex = Math.ceil(Math.random() * galleryData.length - 1);

    if (visibleGallery.includes(galleryData[randomGalleryIndex])) {
        i--;
    } else {
        visibleGallery.push(galleryData[randomGalleryIndex]);
    }
}

// Image DOM
document.querySelectorAll('.gallery__display__item-image').forEach((element, index) => {

    element.setAttribute("src", visibleGallery[index]);

});

// Image Link DOM
document.querySelectorAll('.gallery__display__item-link').forEach((element, index) => {

    element.setAttribute("href", visibleGallery[index]);

});

let selectedPicture;
let randomGalleryIndex;
let randomIDNumber;
let swapProtected = [];



function getRandomPicture() {

    randomIDNumber = Math.ceil(Math.random() * visibleGalleryLength);

    // deals with responsiveness (martelado à última hora)
    while (getComputedStyle(document.querySelector(`.gallery__display__item:nth-child(${randomIDNumber})`)).display == "none") {
        randomIDNumber = Math.ceil(Math.random() * visibleGalleryLength);
    };

    // Guarantees each picture stays 3 swap swapImages
    while (swapProtected.includes(randomIDNumber)) {

        randomIDNumber = Math.ceil(Math.random() * visibleGalleryLength);

    }

    swapProtected.unshift(randomIDNumber);


    if (swapProtected.length === 4) {
        swapProtected.pop();
    }

    // randomIDNumber = Math.ceil(Math.random() * visibleGalleryLength);
    selectedPicture = `#gallery-picture-${randomIDNumber}`;

}

function getGalleryIndex() {

    randomGalleryIndex = Math.ceil(Math.random() * (galleryData.length - 1));

    // Only non-repeatable images proceed
    while (visibleGallery.includes(galleryData[randomGalleryIndex])) {

        randomGalleryIndex = Math.ceil(Math.random() * (galleryData.length - 1));

    }

}

function swapImage() {

    // Gives new href and src attributes and Updates visibleGallery with current DOM 
    const previousGalleryImage = document.querySelector(`${selectedPicture} .gallery__display__item-link`).getAttribute("href");


    $(`${selectedPicture} .gallery__display__item-link`).attr("href", galleryData[randomGalleryIndex])


    const newGalleryImage = document.querySelector(`${selectedPicture} .gallery__display__item-link`).getAttribute("href");


    visibleGallery.splice(visibleGallery.indexOf(previousGalleryImage), 1);
    visibleGallery.push(newGalleryImage);


    $(`${selectedPicture} .gallery__display__item-image`).attr("src", galleryData[randomGalleryIndex]);

    $('.gallery__display__item').removeAttr('animation');

    $(selectedPicture).attr('animation', 'on');

}

// full cicle
function galleryCicle() {

    setInterval(() => {

        getRandomPicture();
        getGalleryIndex();
        swapImage();


    }, 2000);

}

galleryCicle();

// gallery temporary options
$('[data-fancybox]').fancybox({
  buttons : false,
  loop: true,
  infobar: false,
  touch:{
      vertical: false
  }
});