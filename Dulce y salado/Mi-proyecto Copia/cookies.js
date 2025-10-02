document.addEventListener('DOMContentLoaded', (event) => {
    const cookieBanner = document.getElementById('ck');
    const acceptBtn = document.getElementById('accept-cookies-btn');
    const cookieName = 'cookieAccepted';

  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(cname) {
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function checkCookie() {
    const userAccepted = getCookie(cookieName);
    if (userAccepted !== "true") {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000); // Pequeño retraso para que la animación sea visible
    }
  }

  acceptBtn.addEventListener('click', () => {
    setCookie(cookieName, "true", 365); // Guarda la preferencia por 365 días
    cookieBanner.classList.remove('show');
  });

  checkCookie();
});