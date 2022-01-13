(() => {
  // Stiky header
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > header.offsetTop) {
        header.classList.add('header--sticky');
      } else {
        header.classList.remove('header--sticky');
      }
    });
  }
})();