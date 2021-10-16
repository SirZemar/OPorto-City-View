let sliderContainer = document.querySelector(".home__reservations__guests__slider-container");
let slider = document.querySelector(".home__reservations__guests__slider");
let numberBox = document.querySelector(".home__reservations__guests__quantity-nr");
let guestQt = parseInt(slider.value);

let sliderOpen = false;

numberBox.innerHTML = guestQt; // Display the default slider value

slider.oninput = function () {
    guestQt = parseInt(this.value);

    numberBox.innerHTML = guestQt;

}



let lessClick = document.querySelectorAll(".home__reservations__guests__quantity-less");
let plusClick = document.querySelectorAll(".home__reservations__guests__quantity-plus");


lessClick.forEach(button => {
    button.onclick = () => {
        if (guestQt > 1) {
            guestQt--;
            slider.value = guestQt;

            numberBox.innerHTML = guestQt;

        }
    }
});

plusClick.forEach(button => {
    button.onclick = () => {
        if (guestQt < 8) {
            guestQt++;
            slider.value = guestQt;

            numberBox.innerHTML = guestQt;

        }
    }
});

const openSlider = () => {


    $(sliderContainer).slideDown({
        duration: 100,
        start: function () {
            $(this).css({
                display: "flex"
            });
        }
    })

    sliderOpen = true;

}

const closeSlider = () => {

    $(sliderContainer).slideUp(100);

    sliderOpen = false;

}

const closeSliderOutClick = (event) => {

    if (sliderOpen) {
        if (!event.target.closest(".home__reservations__guests__slider-container, .home__reservations__guests__quantity-nr, .home__reservations__guests__quantity-change")) {

            closeSlider()

        }

    }
}

numberBox.addEventListener('click', () => {
    if (!sliderOpen) {
        openSlider();
    } else {
        closeSlider();
    }
});

// Close on clicking anywhere outside the feature
document.addEventListener("click", closeSliderOutClick);

export const getGuestValue = () => {
    return parseInt(slider.value);
}
