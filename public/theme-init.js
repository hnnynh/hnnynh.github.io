let dark = false;
const savedDarkMode = localStorage.getItem("darkMode");

if (savedDarkMode) {
  dark = JSON.parse(savedDarkMode);
} else {
  dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
}

document.documentElement.classList.toggle("dark", dark);
