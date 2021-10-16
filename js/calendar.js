import { getGuestValue } from "./home-range-slider";

// ---------------------------------------//
//
//      
//
// ---------------------------------------//

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let dt;
let actualDate;
let day;
let month;
let year;

let monthCounting = 0;

let checkInDateSelected = '';
let checkOutDateSelected = '';
let selectedDays = [];


load();

function load() {

    dt = new Date();

    year = dt.getFullYear();
    month = dt.getMonth();
    day = dt.getDate();

    actualDate = new Date(year, month, day)

    const calendarAll = document.querySelectorAll(".home__reservations__calendar-container");

    calendarAll.forEach((calendar, index) => {


        // -------------- MONTTH DOM CALENDAR ---------------- 
        const yearOutput = new Date(year, month + monthCounting + index).getFullYear();
        const monthShort = new Date(year, month + monthCounting + index).toString().split(" ")[1];
        const monthLong = allMonths.find(element => element.includes(monthShort));

        calendar.querySelector('.home__reservations__calendar__header-month').innerHTML = `${monthLong} ${yearOutput}`;


        // ---------------- DOM CALENDAR DAYS --------------------
        const firstMonthDay = new Date(year, month + monthCounting + index, 1).toString().split(" ")[0];

        const paddingDays = weekDays.indexOf(firstMonthDay);

        const monthDays = new Date(year, month + monthCounting + index + 1, 0).getDate();

        const daysParent = calendar.querySelector('.home__reservations__calendar__days-container');

        //calendar padding days(blank)
        for (let i = 0; i < paddingDays; i++) {

            const paddingDayElement = document.createElement("li");
            paddingDayElement.classList.add("home__reservations__calendar__padding-days");

            daysParent.appendChild(paddingDayElement);
        }

        //calendar days
        for (let i = 1; i <= monthDays; i++) {


            const dayElement = document.createElement("li");
            dayElement.classList.add("home__reservations__calendar__days");

            dayElement.innerHTML = i;

            daysParent.appendChild(dayElement);

        }

        const allDays = calendar.querySelectorAll('.home__reservations__calendar__days');

        // ------- CALENDAR CLICK ON DAYS ACTIVE AND WATERMARKED ATTRIBUTE ---------

        // click only on non watermarked days
        allDays.forEach(oneDay => {

            if (new Date(year, month + monthCounting + index, oneDay.innerHTML).valueOf() < new Date(year, month, day)) {
                oneDay.setAttribute('status', 'watermarked');

            };

            const getStatusAttr = oneDay.getAttribute('status');

            oneDay.onclick = () => {

                const inputDay = parseInt(oneDay.innerHTML);

                if (getStatusAttr !== 'watermarked') {
                    changeDate(calendarAll, allDays, oneDay, index, inputDay);
                }

            };

        });

        // ---------------- calendar selected day highlight ----------------------
        allDays.forEach((oneDay) => {

            if (new Date(year, month + monthCounting + index, oneDay.innerHTML).valueOf() === checkInDateSelected.valueOf()) {
                oneDay.setAttribute('inSelected', 'on');
            };

            if (new Date(year, month + monthCounting + index, oneDay.innerHTML).valueOf() === checkOutDateSelected.valueOf()) {
                oneDay.setAttribute('outSelected', 'on');
            };

            if (selectedDays.length != 0 && selectedDays.includes(new Date(year, month + monthCounting + index, oneDay.innerHTML).valueOf())) {
                oneDay.setAttribute('selected', 'on');
            };

        });

        highlightSelectedDays(allDays, index)

    });



}


function removeDays() {

    const oldDayList = document.querySelectorAll(".home__reservations__calendar__days-container");

    oldDayList.forEach(calendar => {

        while (calendar.hasChildNodes()) {
            calendar.removeChild(calendar.firstChild);
        }

    })

}

function nextMonth() {
    removeDays();

    monthCounting++;
    load();
}

function previousMonth() {
    removeDays();

    monthCounting--;
    load();
}


// -------------------------------- Month scroll --------------------------------
document.querySelectorAll(".month-scroll-left").forEach(event => {
    event.onclick = function () { previousMonth() };
});


document.querySelectorAll(".month-scroll-right").forEach(event => {
    event.onclick = function () { nextMonth() };
})

// ---------------------------------------//
//
//      
//
// ---------------------------------------//

let checkIn = false;
let checkOut = false;
let calendarOpen = false;
let outSelect;
let inSelect;

let checkInStr;
let checkOutStr;


function highlightSelectedDays(allDays, index) {


    selectedDays = [];

    // -------------- CALENDAR IN BETWEEN SELECTED DAYS HIGHLIGHT ---------------

    allDays.forEach(oneDay => {

        oneDay.removeAttribute('selected');

        if (new Date(year, month + monthCounting + index, oneDay.innerHTML) > checkInDateSelected && new Date(year, month + monthCounting + index, oneDay.innerHTML) < checkOutDateSelected) {
            oneDay.setAttribute('selected', 'on')

            selectedDays.push(new Date(year, month + monthCounting + index, oneDay.innerHTML).valueOf());

        }


    });

}



const outAnimaSelect = () => {
    document.querySelector("#check-out").classList.add("select");
    document.querySelector(".home__reservations__calendar").setAttribute("status", "slideArrow");

    outSelect = true;
};
const outAnimaDeselect = () => {
    document.querySelector("#check-out").classList.remove("select");
    document.querySelector(".home__reservations__calendar").removeAttribute("status", "slideArrow");

    outSelect = false;
};
const inAnimaSelect = () => {
    document.querySelector("#check-in").classList.add("select");

    inSelect = true;
};
const inAnimaDeselect = () => {
    document.querySelector("#check-in").classList.remove("select");

    inSelect = false;
};

const openCalendar = () => {
    $('.home__reservations__calendar').slideDown({
        duration: 400,
        start: function () {
            $(this).css({ display: "flex" });
        }
    });

    $('.home__logo').attr('slide', 'on');

    calendarOpen = true;
};

const closeCalendar = () => {
    $('.home__reservations__calendar').slideUp(400);


    if (inSelect) {
        inAnimaDeselect();
    }

    if (outSelect) {
        outAnimaDeselect();
    }

    // resets calendar if no entries
    if (!checkIn && !checkOut) {
        monthCounting = 0;

        setTimeout(() => {
            removeDays();
            load();
        }, 400);
    }

    $('.home__logo').removeAttr('slide', 'on');

    calendarOpen = false;
};

const closeCalendarOutClick = (event) => {

    if (calendarOpen) {
        if (!event.target.closest(".home__reservations__date-button, .home__reservations__calendar")) {

            closeCalendar();

        }
    }
};


function inInput() { }
function outInput() { }




// ---------------------------------- Date Output -----------------------------------


function changeDate(calendarAll, allDays, oneDay, index, inputDay) {

    const inputFullDate = new Date(year, month + monthCounting + index, inputDay);
    const inputFullDateDayAfter = new Date(year, month + monthCounting + index, inputDay + 1);
    const inputFullDateDayBefore = new Date(year, month + monthCounting + index, inputDay - 1);

    const monthShort = new Date(year, month + monthCounting + index).toString().split(" ")[1];

    const allDays1st = document.querySelectorAll('.home__reservations__calendar-container:nth-child(1) .home__reservations__calendar__days');
    const allDays2nd = document.querySelectorAll('.home__reservations__calendar-container:nth-child(2) .home__reservations__calendar__days');

    const inputWeekDay = inputFullDate.toString().split(" ")[0];


    inInput = () => {
        document.querySelector("#check-in-day").innerHTML = inputDay;
        document.querySelector("#check-in-month").innerHTML = monthShort;
        document.querySelector("#check-in-week-day").innerHTML = inputWeekDay;

        document.querySelector("#check-in-select-date").className += " hidden";

        // If media (min-width: 769px) creates a comma
        const tempSpan = document.createElement("span");
        tempSpan.classList.add("home__reservations__date__week-day-comma");
        tempSpan.innerHTML = ", ";

        document.querySelector("#check-in-week-day").insertAdjacentElement("beforeend", tempSpan);


        checkIn = true;

        // Check-in Search String
        const inputYear = inputFullDate.getFullYear();
        const inputMonth = inputFullDate.getMonth() + 1;

        checkInStr = `${inputYear}-${inputMonth}-${inputDay}`;

        // Creates check-in date selection highlight
        allDays1st.forEach(oneDay => { oneDay.removeAttribute('inSelected') });

        allDays2nd.forEach(oneDay => { oneDay.removeAttribute('inSelected') });

        checkInDateSelected = inputFullDate;

        oneDay.setAttribute('inSelected', 'on');

        // ---------- LOGIC TO KEEP CHECK-IN ALWAYS BEFORE CHECK-OUT ---------

        // Create new check-out date selection highlight
        if (checkInDateSelected.valueOf() >= checkOutDateSelected.valueOf() && checkIn && checkOut) {
            allDays1st.forEach(oneDay => { oneDay.removeAttribute('outSelected') });
            allDays2nd.forEach(oneDay => { oneDay.removeAttribute('outSelected') });

            checkOutDateSelected = new Date(year, month + monthCounting + index, inputDay + 1);

            if (oneDay.nextSibling) {
                oneDay.nextSibling.setAttribute('outSelected', 'on');
            } else {
                allDays2nd[0].setAttribute('outSelected', 'on');
            }

            //Display new check-out date
            const newInputWeekDay = inputFullDateDayAfter.toString().split(" ")[0];

            const newInputYear = inputFullDateDayAfter.getFullYear();
            const newInputMonth = inputFullDateDayAfter.getMonth() + 1;
            const newInputDay = inputFullDateDayAfter.getDate();
            const newMonthShort = inputFullDateDayAfter.toString().split(" ")[1];


            document.querySelector("#check-out-day").innerHTML = newInputDay;
            document.querySelector("#check-out-month").innerHTML = newMonthShort;
            document.querySelector("#check-out-week-day").innerHTML = newInputWeekDay;


            document.querySelector("#check-out-week-day").insertAdjacentElement("beforeend", tempSpan);

            // New Check-out Search String

            checkOutStr = `${newInputYear}-${newInputMonth}-${newInputDay}`;

        }
    }

    outInput = () => {
        document.querySelector("#check-out-day").innerHTML = inputDay;
        document.querySelector("#check-out-month").innerHTML = monthShort;
        document.querySelector("#check-out-week-day").innerHTML = inputWeekDay;

        document.querySelector("#check-out-select-date").className += " hidden";

        // If media (min-width: 769px) creates a comma

        const tempSpan = document.createElement("span");
        tempSpan.classList.add("home__reservations__date__week-day-comma");
        tempSpan.innerHTML = ", ";

        document.querySelector("#check-out-week-day").insertAdjacentElement("beforeend", tempSpan);

        checkOut = true;

        // Check-out Search String
        const inputYear = inputFullDate.getFullYear();
        const inputMonth = inputFullDate.getMonth() + 1;

        checkOutStr = `${inputYear}-${inputMonth}-${inputDay}`;

        // checkOutEntry(); //remover

        // Create check-out date selection highlight
        allDays1st.forEach(oneDay => { oneDay.removeAttribute('outSelected') });
        allDays2nd.forEach(oneDay => { oneDay.removeAttribute('outSelected') });

        checkOutDateSelected = inputFullDate;

        oneDay.setAttribute('outSelected', 'on');

        // --------------- LOGIC TO KEEP CHECK-IN ALWAYS BEFORE CHECK-OUT ----------------

        // Create new check-in date selection highlight
        if (checkInDateSelected.valueOf() >= checkOutDateSelected.valueOf() && checkIn && checkOut) {

            allDays1st.forEach(oneDay => { oneDay.removeAttribute('inSelected') });
            allDays2nd.forEach(oneDay => { oneDay.removeAttribute('inSelected') });

            checkInDateSelected = new Date(year, month + monthCounting + index, inputDay - 1);


            if (oneDay.previousSibling) {
                oneDay.previousSibling.setAttribute('inSelected', 'on');
            }

            // Display new check-in date
            const newInputWeekDay = inputFullDateDayBefore.toString().split(" ")[0];

            const newInputYear = inputFullDateDayBefore.getFullYear();
            const newInputMonth = inputFullDateDayBefore.getMonth() + 1;
            const newInputDay = inputFullDateDayBefore.getDate();
            const newMonthShort = inputFullDateDayBefore.toString().split(" ")[1]

            document.querySelector("#check-in-day").innerHTML = newInputDay;
            document.querySelector("#check-in-month").innerHTML = newInputWeekDay;
            document.querySelector("#check-in-week-day").innerHTML = newMonthShort;


            document.querySelector("#check-in-week-day").insertAdjacentElement("beforeend", tempSpan);

            // New Check-in Search String

            checkInStr = `${newInputYear}-${newInputMonth}-${newInputDay}`;
        }
    }

    // ---------------- LOGIC FOR DATES SELECTION --------------------
    if (inSelect) {

        if (!checkIn && checkOut) {

            inInput();

            inAnimaDeselect();

            closeCalendar();

        } else if (!checkIn || checkIn && !checkOut) {

            inInput();

            inAnimaDeselect();

            outAnimaSelect();

        } else if (checkIn && checkOut) {

            inInput();

        }
    } else if (outSelect) {


        if (!checkOut && checkIn) {

            outInput();

            outAnimaDeselect();

            closeCalendar();


        } else if (!checkOut && !checkIn && index === 0 && inputFullDate.valueOf() === actualDate.valueOf() || checkIn && checkOut && index === 0 && inputFullDate.valueOf() === actualDate.valueOf()) {

            inInput();

        } else if (!checkOut && !checkIn && index === 1 && inputFullDate.valueOf() === actualDate.valueOf() || checkIn && checkOut && index === 1 && inputFullDate.valueOf() === actualDate.valueOf()) {
            inInput();

        } else if (!checkOut || checkOut && !checkIn) {

            outInput();

            outAnimaDeselect();

            inAnimaSelect();

        } else if (checkOut && checkIn) {

            outInput();

        }
    }

    // -------------------- HIGHLIGHT DAYS BETWEEN -------------------------
    if (checkIn && checkOut) {

        calendarAll.forEach((calendar, index) => {

            const allDays = calendar.querySelectorAll('.home__reservations__calendar__days')

            highlightSelectedDays(allDays, index);
        });

    }

};

// --------------------- SELECT CHECK-IN DATE ---------------------------
document.querySelector("#check-in").onclick = () => {

    if (!calendarOpen) {

        openCalendar();

        inAnimaSelect();

    } else if (calendarOpen && outSelect) {

        outAnimaDeselect();

        inAnimaSelect();

    } else {

        closeCalendar();

    }

};


// --------------------- SELECT CHECK-OUT DATE ---------------------------

document.querySelector("#check-out").onclick = () => {


    if (!calendarOpen) {

        openCalendar();

        outAnimaSelect();

    } else if (calendarOpen && inSelect) {

        inAnimaDeselect();

        outAnimaSelect();

    } else {

        closeCalendar();

    }

};

// ----------------- CLOSE CALENDAR CLICKING OUTSIDE AREA ---------------------

document.addEventListener("click", closeCalendarOutClick);


// ------------------------------- SEARCH DATES -------------------------------


$('.home__reservations__search').click(() => {
    $('.home__reservations__search').attr('href', `https://www.airbnb.pt/s/Porto/homes?tab_id=home_tab&refinement_paths%5B%5D=%2Fhomes&flexible_trip_dates%5B%5D=july&flexible_trip_dates%5B%5D=june&flexible_trip_lengths%5B%5D=weekend_trip&date_picker_type=calendar&checkin=${checkInStr}&checkout=${checkOutStr}&adults=${getGuestValue()}&query=Porto&place_id=ChIJwVPhxKtlJA0RvBSxQFbZSKY&disable_auto_translation=false&source=structured_search_input_header&search_type=autocomplete_click`);
});