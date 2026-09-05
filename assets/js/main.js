(function () {
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Horaires du jour, dérivés du tableau ci-dessus : 9h-21h, 20h le dimanche.
  var closing = [20, 21, 21, 21, 21, 21, 21];
  var days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  var now = new Date();
  var day = now.getDay();
  var hour = now.getHours() + now.getMinutes() / 60;
  var closesAt = closing[day];

  var todayEl = document.getElementById('todayHours');
  if (todayEl) {
    if (hour >= 9 && hour < closesAt) {
      todayEl.textContent = 'Ouvert aujourd’hui jusqu’à ' + closesAt + 'h';
    } else if (hour < 9) {
      todayEl.textContent = 'Ouvre à 9h — ' + days[day] + ' 9h à ' + closesAt + 'h';
    } else {
      var tomorrow = (day + 1) % 7;
      todayEl.textContent = 'Fermé — réouverture ' + days[tomorrow] + ' à 9h';
    }
  }

  var todayRow = document.querySelector('.hours-row[data-day="' + day + '"]');
  if (todayRow) todayRow.classList.add('today');

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = now.getFullYear();
})();
