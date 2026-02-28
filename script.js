// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile toggle
const toggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  toggle.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('active');
    toggle.classList.remove('active');
  });
});

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }});
}, { threshold: 0.15 });
revealEls.forEach(el => revealObs.observe(el));

// Number count-up animation
const numberEls = document.querySelectorAll('.number-value');
const numberObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const isZero = el.dataset.isZero === 'true';

      if (isZero) {
        el.textContent = '0' + suffix;
        numberObs.unobserve(el);
        return;
      }

      let current = 0;
      const duration = 1500;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.round(current) + suffix;
      }, 16);

      numberObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
numberEls.forEach(el => numberObs.observe(el));
// 네이버 지도 초기화
function initNaverMaps() {
  // 광장점 (서울시 광진구 구의강변로106)
  var gwangjangPos = new naver.maps.LatLng(37.5465, 127.0940);
  var mapGwangjang = new naver.maps.Map('map-gwangjang', {
    center: gwangjangPos,
    zoom: 16,
    zoomControl: true,
    zoomControlOptions: {
      position: naver.maps.Position.TOP_RIGHT
    }
  });
  new naver.maps.Marker({
    position: gwangjangPos,
    map: mapGwangjang,
    title: '유베이스 광장점'
  });

  // 강동점 (서울시 강동구 양재대로 1464)
  var gangdongPos = new naver.maps.LatLng(37.5350, 127.1320);
  var mapGangdong = new naver.maps.Map('map-gangdong', {
    center: gangdongPos,
    zoom: 16,
    zoomControl: true,
    zoomControlOptions: {
      position: naver.maps.Position.TOP_RIGHT
    }
  });
  new naver.maps.Marker({
    position: gangdongPos,
    map: mapGangdong,
    title: '유베이스 강동점'
  });
}

if (document.readyState === 'complete') {
  initNaverMaps();
} else {
  window.addEventListener('load', initNaverMaps);
}