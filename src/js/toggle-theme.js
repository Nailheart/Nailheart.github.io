const toggleThemeButton = document.querySelector('.toggle-theme');
if (toggleThemeButton) {
  toggleThemeButton.addEventListener('click', () => {
    toggleTheme();
  });

  // function to set a given theme/color-scheme
  function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
  }

  // function to toggle between light and dark theme
  function toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
      setTheme('theme-light');
      toggleThemeButton.classList.remove('toggle-theme--dark');
    } else {
      setTheme('theme-dark');
      toggleThemeButton.classList.add('toggle-theme--dark');
    }
  }

  // Immediately invoked function to set the theme on initial load
  (function () {
    if (localStorage.getItem('theme') === 'theme-dark') {
      setTheme('theme-dark');
      toggleThemeButton.classList.add('toggle-theme--dark');
    } else {
      setTheme('theme-light');
      toggleThemeButton.classList.remove('toggle-theme--dark');
    }
  })();
}
