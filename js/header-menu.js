const showMenu = () => {
    document.querySelector(".navigation").classList.add("toggle-on");
};

const closeMenu = () => {
    document.querySelector(".navigation").classList.remove("toggle-on");
}

document.querySelector("#header__navigation__on").onclick = showMenu;
document.querySelector("#header__navigation__off").onclick = closeMenu;
