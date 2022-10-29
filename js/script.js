const ls = localStorage;
/* ******** Menu ******** */
((d) => {
  const $btnMenu = d.querySelector(".menu-btn"),
    $menu = d.querySelector(".menu");

  $btnMenu.addEventListener("click", (e) => {
    $btnMenu.firstElementChild.classList.toggle("none");
    $btnMenu.lastElementChild.classList.toggle("none");
    $menu.classList.toggle("is-active");
  });

  d.addEventListener("click", (e) => {
    if (!e.target.matches(".menu a")) return false;

    $btnMenu.firstElementChild.classList.remove("none");
    $btnMenu.lastElementChild.classList.add("none");
    $menu.classList.remove("is-active");
  });
})(document);

/* ******** End Menu ******** */

/* ******** Dark theme ******** */
function darkTheme(btn, classDark) {
  const $themeBtn = document.querySelector(btn),
    $selectors = document.querySelectorAll("[data-dark]");

  //console.log($selectors);

  let moon = "🌙";
  let sun = "🌞";

  const lightMode = () => {
    $selectors.forEach((el) => el.classList.remove(classDark));
    $themeBtn.textContent = moon;
    ls.setItem("theme", "light");
  };

  const darkMode = () => {
    $selectors.forEach((el) => el.classList.add(classDark));
    $themeBtn.textContent = sun;
    ls.setItem("theme", "dark");
  };

  document.addEventListener("click", (e) => {
    if (e.target.matches(btn)) {
      console.log($themeBtn.textContent);
      if ($themeBtn.textContent === moon) {
        darkMode();
      } else {
        lightMode();
      }
    }
  });

  document.addEventListener("DOMContentLoaded", (e) => {
    //console.log(ls.getItem("theme"));
    if (ls.getItem("theme") === null) ls.setItem("theme", "light");
    if (ls.getItem("theme") === "light") {
      lightMode();
    }
    if (ls.getItem("theme") === "dark") {
      darkMode();
    }
  });
}
darkTheme(".dark-theme-btn", "dark-mode");

/* ******** End Dark theme ******** */
