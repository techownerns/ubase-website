// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE TOGGLE =====
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

// ===== HERO SCROLL PARALLAX =====
(function() {
  const hero = document.getElementById('hero');
  const heroVideo = hero.querySelector('.hero-video');
  const heroOverlay = hero.querySelector('.hero-overlay');
  const heroContent = hero.querySelector('.hero-content');
  const heroScroll = hero.querySelector('.hero-scroll');
  const heroH = window.innerHeight;
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    if (scrollY > heroH) { ticking = false; return; }
    const ratio = scrollY / heroH;
    heroVideo.style.transform = 'scale(1.1) translateY(' + (scrollY * 0.4) + 'px)';
    heroOverlay.style.background = 'rgba(0,0,0,' + (0.55 + ratio * 0.3) + ')';
    heroContent.style.transform = 'translateY(' + (scrollY * -0.3) + 'px)';
    heroContent.style.opacity = 1 - ratio * 1.5;
    heroScroll.style.opacity = 1 - ratio * 3;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  heroVideo.addEventListener('timeupdate',function(){
    if(heroVideo.currentTime>=14){
      heroVideo.style.objectPosition='80% center';
    }else{
      heroVideo.style.objectPosition='center center';
    }
  });
})();

// ===== HERO MOUSE PARALLAX =====
(function() {
  const hero = document.getElementById('hero');
  const heroYear = hero.querySelector('.hero-year');
  const heroBadge = hero.querySelector('.hero-badge');
  const heroH1 = hero.querySelector('h1');
  const heroDesc = hero.querySelector('.hero-desc');
  const heroActions = hero.querySelector('.hero-actions');
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  hero.addEventListener('mousemove', function(e) {
    const rect = hero.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  hero.addEventListener('mouseleave', function() {
    mouseX = 0;
    mouseY = 0;
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.06;
    currentY += (mouseY - currentY) * 0.06;

    if (heroYear) heroYear.style.transform = 'translate(' + (currentX * -15) + 'px,' + (currentY * -12) + 'px)';
    if (heroBadge) heroBadge.style.transform = 'translate(' + (currentX * -8) + 'px,' + (currentY * -8) + 'px)';
    if (heroH1) heroH1.style.transform = 'translate(' + (currentX * -15) + 'px,' + (currentY * -12) + 'px)';
    if (heroDesc) heroDesc.style.transform = 'translate(' + (currentX * -10) + 'px,' + (currentY * -8) + 'px)';
    if (heroActions) heroActions.style.transform = 'translate(' + (currentX * -6) + 'px,' + (currentY * -5) + 'px)';

    requestAnimationFrame(animate);
  }

  if (window.innerWidth > 768) {
    animate();
  }
})();

// ===== SCROLL REVEAL (Dolly-in Z-axis) =====
const revealEls = document.querySelectorAll('.reveal-up');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ===== 3D TILT CARDS =====
(function() {
  if (window.innerWidth <= 768) return;

  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = y * -8;
      const rotateY = x * 8;
      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
})();

// ===== NUMBER COUNT-UP + NEON GLOW =====
const numberEls = document.querySelectorAll('.number-value');
const numberObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const decimal = parseInt(el.dataset.decimal) || 0;
      const isZero = el.dataset.isZero === 'true';

      if (isZero) {
        el.textContent = '0' + suffix;
        el.classList.add('glow');
        numberObs.unobserve(el);
        return;
      }

      let current = 0;
      const duration = 1800;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
          el.classList.add('glow');
        }
        el.textContent = (decimal > 0 ? current.toFixed(decimal) : Math.round(current)) + suffix;
      }, 16);

      numberObs.unobserve(el);
    }
  });
}, { threshold: 0.4 });
numberEls.forEach(el => numberObs.observe(el));

// ===== SYSTEM STEP VIDEO AUTOPLAY =====
(function() {
  const videos = document.querySelectorAll('.system-step-video video');
  const videoObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.play();
      } else {
        e.target.pause();
      }
    });
  }, { threshold: 0.3 });
  videos.forEach(v => videoObs.observe(v));
})();

// ===== NAVER MAP (안전가드 포함) =====
function makeMapByAddress(mapId, address, title) {
  if (typeof naver === 'undefined' || !naver.maps) return;
  var map = new naver.maps.Map(mapId, {
    zoom: 16,
    zoomControl: true,
    zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT }
  });

  naver.maps.Service.geocode({ query: address }, function(status, response) {
    if (status !== naver.maps.Service.Status.OK) return;
    var item = response.v2.addresses && response.v2.addresses[0];
    if (!item) return;
    var pos = new naver.maps.LatLng(Number(item.y), Number(item.x));
    map.setCenter(pos);
    new naver.maps.Marker({ position: pos, map: map, title: title });
  });
  return map;
}

function initNaverMaps() {
  if (typeof naver === 'undefined' || !naver.maps) return;
  makeMapByAddress('map-gwangjang', '서울시 광진구 구의강변로106 삼성쉐르빌', '유베이스 광장점');
  makeMapByAddress('map-gangdong', '서울시 강동구 양재대로 1464 남경빌딩', '유베이스 강동점');
}

if (document.readyState === 'complete') {
  initNaverMaps();
} else {
  window.addEventListener('load', initNaverMaps);
}

// ===== 멘토 카드 1회 출력 =====
(function(){
  var cards=document.querySelectorAll('.mentor-profile-card');
  cards.forEach(function(card){
    var video=card.querySelector('.mentor-cycle-video');
    var logo=card.querySelector('.mentor-cycle-logo');
    var logoImg=logo?logo.querySelector('img'):null;
    var dept=card.querySelector('.mentor-cycle-dept');
    var univ=card.querySelector('.mentor-cycle-univ');
    if(!video||!logo||!dept||!univ) return;

    logo.style.animation='logoIntro 2.8s ease-in-out forwards';
    logoImg.style.animation='logoSpin 2.4s ease-in-out forwards';
    dept.style.animation='deptIntro 2.8s ease-in-out forwards';

    setTimeout(function(){
      video.currentTime=0;
      video.style.opacity='1';
      univ.style.transition='opacity 0.5s ease';univ.style.opacity='1';
    },2400);
  });
})();

/* ── FACILITY GALLERY + LIGHTBOX ── */
(function(){
  var BASE='https://ohuqwtugvafcxfvwizqh.supabase.co/storage/v1/object/public/facility/';
  var items=[
    {src:'facility-01.jpg',cap:'안면인식 출결 단말기'},
    {src:'facility-02.jpg',cap:'개인 좌석 · 시디즈 의자'},
    {src:'facility-03.jpg',cap:'환영 디스플레이 · 스터디존 입구'},
    {src:'facility-04.jpg',cap:'광장점 열람실 전경'},
    {src:'facility-05.jpg',cap:'학습 중 좌석 풍경'},
    {src:'facility-06.jpg',cap:'휴게실 · 커피머신'},
    {src:'facility-07.jpg',cap:'프린터 · 공지보드'},
    {src:'facility-08.jpg',cap:'휴게실 전경 · 냉장고'},
    {src:'facility-09.jpg',cap:'휴대폰 보관함 (광장점)'},
    {src:'facility-10.jpg',cap:'강동점 좌석'},
    {src:'facility-11.jpg',cap:'복도 · 턴게이트 입구'},
    {src:'facility-12.jpg',cap:'휴대폰 보관함 (강동점)'},
    {src:'facility-13.jpg',cap:'턴게이트 · CCTV 보안'},
    {src:'facility-14.jpg',cap:'강동점 열람실 전경'},
    {src:'facility-15.jpg',cap:'미션벽 · 식당'},
    {src:'facility-16.jpg',cap:'복합기 · 출력실'},
    {src:'facility-17.jpg',cap:'시설 안내'}
  ];
  var grid=document.getElementById('facilityGallery');
  if(!grid)return;
  items.forEach(function(item,i){
    var wrap=document.createElement('div');wrap.className='fgal-item';
    var img=document.createElement('img');
    img.src=BASE+item.src;img.alt=item.cap;img.loading='lazy';
    var cap=document.createElement('span');cap.className='fgal-cap';cap.textContent=item.cap;
    wrap.appendChild(img);wrap.appendChild(cap);
    wrap.addEventListener('click',function(){openLB(i);});
    grid.appendChild(wrap);
  });

  /* Lightbox */
  var lb=document.getElementById('lightbox');
  var lbImg=document.getElementById('lightboxImg');
  var lbCounter=document.getElementById('lightboxCounter');
  var lbCaption=document.getElementById('lightboxCaption');
  var lbSpinner=document.getElementById('lightboxSpinner');
  var thumbStrip=document.getElementById('lightboxThumbs');
  var cur=0,scale=1,startX=0,diffX=0,dragging=false;

  /* Build thumbs */
  items.forEach(function(item,i){
    var t=document.createElement('img');t.src=BASE+item.src;t.alt='';
    t.className='lb-thumb';t.dataset.idx=i;
    t.addEventListener('click',function(){cur=i;update();});
    thumbStrip.appendChild(t);
  });

  function openLB(i){cur=i;scale=1;lb.classList.add('active');update();document.body.style.overflow='hidden';}
  function closeLB(){lb.classList.remove('active');document.body.style.overflow='';resetZoom();}
  function resetZoom(){scale=1;lbImg.style.transform='';}
  function update(){
    lbSpinner.style.display='block';lbImg.style.opacity='0';
    var img=new Image();img.src=BASE+items[cur].src;
    img.onload=function(){
      lbImg.src=img.src;lbImg.style.opacity='1';lbSpinner.style.display='none';
    };
    lbCounter.textContent=(cur+1)+' / '+items.length;
    lbCaption.textContent=items[cur].cap;
    resetZoom();
    /* Active thumb */
    var thumbs=thumbStrip.querySelectorAll('.lb-thumb');
    thumbs.forEach(function(t,i){t.classList.toggle('active',i===cur);});
    thumbs[cur].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  }
  function go(d){cur=(cur+d+items.length)%items.length;update();}

  document.getElementById('lightboxClose').addEventListener('click',closeLB);
  document.getElementById('lightboxPrev').addEventListener('click',function(){go(-1);});
  document.getElementById('lightboxNext').addEventListener('click',function(){go(1);});
  lb.addEventListener('click',function(e){if(e.target===lb)closeLB();});
  document.addEventListener('keydown',function(e){
    if(!lb.classList.contains('active'))return;
    if(e.key==='Escape')closeLB();
    if(e.key==='ArrowLeft')go(-1);
    if(e.key==='ArrowRight')go(1);
  });

  /* Touch swipe */
  lbImg.addEventListener('touchstart',function(e){
    if(e.touches.length===1){startX=e.touches[0].clientX;dragging=true;diffX=0;}
  },{passive:true});
  lbImg.addEventListener('touchmove',function(e){
    if(!dragging||e.touches.length!==1)return;diffX=e.touches[0].clientX-startX;
  },{passive:true});
  lbImg.addEventListener('touchend',function(){
    if(!dragging)return;dragging=false;
    if(Math.abs(diffX)>50){diffX>0?go(-1):go(1);}
  });

  /* Pinch to zoom */
  var initDist=0;
  lbImg.addEventListener('touchstart',function(e){
    if(e.touches.length===2){
      initDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
    }
  },{passive:true});
  lbImg.addEventListener('touchmove',function(e){
    if(e.touches.length===2){
      var d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      scale=Math.min(3,Math.max(1,scale*(d/initDist)));initDist=d;
      lbImg.style.transform='scale('+scale+')';e.preventDefault();
    }
  },{passive:false});
  /* Double tap zoom */
  var lastTap=0;
  lbImg.addEventListener('touchend',function(e){
    if(e.touches.length>0)return;
    var now=Date.now();
    if(now-lastTap<300){scale=scale>1?1:2;lbImg.style.transform='scale('+scale+')';}
    lastTap=now;
  });
})();
