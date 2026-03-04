// ===== RESEARCH SLIDER (drag + momentum) =====
window._sliderDragged = false;
(function(){
  const wrap = document.querySelector('.slider-wrap');
  const track = document.querySelector('.slider-track');
  if(!wrap || !track) return;

  let isDown = false;
  let startX, currentX;
  let velX = 0, lastX, lastT;
  let rafId = null;
  let animPaused = false;

  // 트랙 전체 너비의 절반 = 1세트 길이
  function halfW(){
    return track.scrollWidth / 2;
  }

  // CSS 애니메이션 현재 위치 읽기
  function getTranslateX(){
    return new DOMMatrix(getComputedStyle(track).transform).m41;
  }

  function pauseAnim(){
    if(animPaused) return;
    currentX = getTranslateX();
    track.style.animation = 'none';
    track.style.transform = 'translateX(' + currentX + 'px)';
    animPaused = true;
  }

  function resumeAnim(){
    track.style.transform = '';
    track.style.animation = '';
    animPaused = false;
  }

  function setX(x){
    // 무한루프: -halfW ~ 0 범위 유지
    const h = halfW();
    x = x % h;
    if(x > 0) x -= h;
    currentX = x;
    track.style.transform = 'translateX(' + x + 'px)';
  }

  function momentum(){
    if(Math.abs(velX) < 0.3){
      // 속도 다 빠지면 CSS 애니메이션 복귀
      resumeAnim();
      return;
    }
    velX *= 0.93; // 감속 계수
    setX(currentX + velX);
    rafId = requestAnimationFrame(momentum);
  }

  // ── mouse ──
  var downClientX = 0, downClientY = 0;
  wrap.addEventListener('mousedown', function(e){
    cancelAnimationFrame(rafId);
    pauseAnim();
    isDown = true;
    startX = e.clientX;
    lastX = e.clientX;
    lastT = Date.now();
    velX = 0;
    downClientX = e.clientX;
    downClientY = e.clientY;
    window._sliderDragged = false;
    wrap.classList.add('dragging','grabbing');
    track.style.transition = 'none';
  });

  document.addEventListener('mousemove', function(e){
    if(!isDown) return;
    e.preventDefault();
    if(Math.abs(e.clientX - downClientX) > 5 || Math.abs(e.clientY - downClientY) > 5){
      window._sliderDragged = true;
    }
    const now = Date.now();
    const dt = Math.max(now - lastT, 1);
    velX = (e.clientX - lastX) / dt * 16; // 16ms 기준 속도
    lastX = e.clientX;
    lastT = now;
    setX(currentX + (e.clientX - startX));
    startX = e.clientX;
  });

  document.addEventListener('mouseup', function(){
    if(!isDown) return;
    isDown = false;
    wrap.classList.remove('dragging','grabbing');
    rafId = requestAnimationFrame(momentum);
  });

  // ── touch ──
  var touchDownX = 0;
  wrap.addEventListener('touchstart', function(e){
    cancelAnimationFrame(rafId);
    pauseAnim();
    startX = e.touches[0].clientX;
    lastX = startX;
    lastT = Date.now();
    velX = 0;
    touchDownX = e.touches[0].clientX;
    window._sliderDragged = false;
    wrap.classList.add('dragging');
    track.style.transition = 'none';
  },{passive:true});

  wrap.addEventListener('touchmove', function(e){
    const now = Date.now();
    const dt = Math.max(now - lastT, 1);
    const cx = e.touches[0].clientX;
    if(Math.abs(cx - touchDownX) > 5) window._sliderDragged = true;
    velX = (cx - lastX) / dt * 16;
    lastX = cx;
    lastT = now;
    setX(currentX + (cx - startX));
    startX = cx;
  },{passive:true});

  wrap.addEventListener('touchend', function(){
    wrap.classList.remove('dragging');
    rafId = requestAnimationFrame(momentum);
  });
})();

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
const defined = 'https://ohuqwtugvafcxfvwizqh.supabase.co/storage/v1/object/public/facility/';
const galleryItems = [
  {src:'facility-01.jpg',cap:'1인 독서실 전경'},
  {src:'facility-02.jpg',cap:'개인 독서 공간'},
  {src:'facility-03.jpg',cap:'프리미엄 독서실'},
  {src:'facility-04.jpg',cap:'휴게 공간'},
  {src:'facility-05.jpg',cap:'상담실'},
  {src:'facility-06.jpg',cap:'로비'},
  {src:'facility-07.jpg',cap:'입구'},
  {src:'facility-08.jpg',cap:'안면인식 턴게이트'},
  {src:'facility-09.jpg',cap:'독서실 내부'},
  {src:'facility-10.jpg',cap:'독서실 조명'},
  {src:'facility-11.jpg',cap:'복도'},
  {src:'facility-12.jpg',cap:'화장실'},
  {src:'facility-13.jpg',cap:'정수기'},
  {src:'facility-14.jpg',cap:'프린터'},
  {src:'facility-15.jpg',cap:'사물함'},
  {src:'facility-16.jpg',cap:'CCTV 관제'},
  {src:'facility-17.jpg',cap:'외관'}
];
const blogBase = 'https://fzekarlxthupgcbfrasy.supabase.co/storage/v1/object/public/website/blog-images/';
const blogImages = [
  {src:'b01_01.jpg'},{src:'b01_02.jpg'},{src:'b01_03.jpg'},{src:'b01_04.jpg'},{src:'b01_05.jpg'},
  {src:'b02_01.jpg'},{src:'b02_02.jpg'},{src:'b02_03.jpg'},{src:'b02_04.jpg'},{src:'b02_05.jpg'},
  {src:'b03_01.jpg'},{src:'b03_02.jpg'},{src:'b03_03.jpg'},{src:'b03_04.jpg'},{src:'b03_05.jpg'},
  {src:'b04_01.jpg'},{src:'b04_02.jpg'},{src:'b04_03.jpg'},{src:'b04_04.jpg'},{src:'b04_05.jpg'},
  {src:'b05_01.jpg'},{src:'b05_02.jpg'},{src:'b05_03.jpg'},{src:'b05_04.jpg'},{src:'b05_05.jpg'},
  {src:'b06_01.png'},{src:'b06_02.png'},{src:'b06_03.png'},{src:'b06_04.png'},
  {src:'b07_01.jpg'},{src:'b07_02.jpg'},{src:'b07_03.jpg'},{src:'b07_04.jpg'},{src:'b07_05.jpg'},
  {src:'b08_01.jpg'},{src:'b08_02.jpg'},{src:'b08_03.jpg'},{src:'b08_04.jpg'},{src:'b08_05.jpg'},
  {src:'b09_01.jpg'},{src:'b09_02.jpg'},{src:'b09_03.jpg'},{src:'b09_04.jpg'},{src:'b09_05.jpg'},
  {src:'b10_01.jpg'},{src:'b10_02.jpg'},{src:'b10_03.jpg'},{src:'b10_04.jpg'},
  {src:'b11_01.jpg'},{src:'b11_02.jpg'},{src:'b11_03.jpg'},{src:'b11_04.jpg'},
  {src:'b12_01.jpg'},{src:'b12_02.jpg'},{src:'b12_03.jpg'},{src:'b12_04.jpg'},{src:'b12_05.jpg'},
  {src:'b13_01.jpg'},{src:'b13_02.jpg'},{src:'b13_03.jpg'},
  {src:'b14_01.jpg'},{src:'b14_02.jpg'},{src:'b14_03.jpg'},{src:'b14_04.jpg'},{src:'b14_05.jpg'},
  {src:'b15_01.jpg'},{src:'b15_02.jpg'},{src:'b15_03.jpg'},{src:'b15_04.jpg'},{src:'b15_05.jpg'},
  {src:'b16_01.jpg'},{src:'b16_02.jpg'},{src:'b16_03.jpg'},{src:'b16_04.jpg'},{src:'b16_05.jpg'},
  {src:'b17_01.jpg'},{src:'b17_02.jpg'},{src:'b17_03.jpg'},{src:'b17_04.jpg'},{src:'b17_05.jpg'},
  {src:'b18_01.jpg'},{src:'b18_02.jpg'},{src:'b18_03.jpg'},{src:'b18_04.jpg'},{src:'b18_05.jpg'},
  {src:'b19_01.jpg'},{src:'b19_02.jpg'},{src:'b19_03.jpg'},{src:'b19_04.jpg'},{src:'b19_05.jpg'},
  {src:'b20_01.jpg'},{src:'b20_02.jpg'},{src:'b20_03.jpg'},{src:'b20_04.jpg'}
];

/* 트랙 초기화 헬퍼 — direction: 1 = →, -1 = ← */
function initGalleryTrack(trackEl, items, direction){
  if(!trackEl) return;
  const doubled = [...items, ...items];
  doubled.forEach((item) => {
    const d = document.createElement('div');
    d.className = 'fgal-slide';
    const fullSrc = item.base ? item.base + item.src : defined + item.src;
    d.innerHTML = `<img src="${fullSrc}" alt="${item.cap||''}" loading="lazy">${item.cap ? '<span class="fgal-cap">'+item.cap+'</span>' : ''}`;
    trackEl.appendChild(d);
  });
  let speed = 0.5 * direction;
  let pos = direction === -1 ? trackEl.scrollWidth / 2 : 0;
  let rafId;
  const halfW = () => trackEl.scrollWidth / 2;
  function auto(){
    pos += speed;
    if(pos >= halfW()) pos -= halfW();
    if(pos < 0) pos += halfW();
    trackEl.scrollLeft = pos;
    rafId = requestAnimationFrame(auto);
  }
  rafId = requestAnimationFrame(auto);
  // 드래그
  let isDrag=false, dragMoved=false, sx, ss;
  trackEl.addEventListener('mousedown', e=>{
    isDrag=true; dragMoved=false; sx=e.pageX; ss=pos;
    cancelAnimationFrame(rafId); trackEl.classList.add('grabbing');
  });
  window.addEventListener('mousemove', e=>{
    if(!isDrag) return;
    const dx=e.pageX-sx; if(Math.abs(dx)>4) dragMoved=true;
    pos=ss-dx;
    if(pos<0) pos+=halfW(); if(pos>=halfW()) pos-=halfW();
    trackEl.scrollLeft=pos;
  });
  window.addEventListener('mouseup', ()=>{
    if(!isDrag) return; isDrag=false;
    trackEl.classList.remove('grabbing');
    rafId=requestAnimationFrame(auto);
  });
  // 터치
  let tx;
  trackEl.addEventListener('touchstart', e=>{
    cancelAnimationFrame(rafId); tx=e.touches[0].pageX; ss=pos; dragMoved=false;
  },{passive:true});
  trackEl.addEventListener('touchmove', e=>{
    const dx=e.touches[0].pageX-tx; if(Math.abs(dx)>4) dragMoved=true;
    pos=ss-dx;
    if(pos<0) pos+=halfW(); if(pos>=halfW()) pos-=halfW();
    trackEl.scrollLeft=pos;
  },{passive:true});
  trackEl.addEventListener('touchend', ()=>{ rafId=requestAnimationFrame(auto); });
  trackEl.addEventListener('mouseenter', ()=>{ if(!isDrag) cancelAnimationFrame(rafId); });
  trackEl.addEventListener('mouseleave', ()=>{ if(!isDrag) rafId=requestAnimationFrame(auto); });
  return { trackEl, dragMoved:()=>dragMoved };
}

/* 시설 이미지 + 블로그 이미지 합치기 */
const facilityFull = galleryItems.map(i=>({...i, base: defined}));
const blogFull = blogImages.map(i=>({...i, base: blogBase, cap:''}));
const topItems = [...facilityFull, ...blogFull.slice(0, Math.ceil(blogFull.length/2))];
const bottomItems = [...blogFull.slice(Math.ceil(blogFull.length/2)), ...facilityFull];

var dragMoved = false;
const topTrack = initGalleryTrack(document.getElementById('facilityGalleryTop'), topItems, 1);
const bottomTrack = initGalleryTrack(document.getElementById('facilityGalleryBottom'), bottomItems, -1);
/* dragMoved 동기화 (라이트박스 클릭 방지용) */
Object.defineProperty(window, '_fgalDrag', {get:()=> (topTrack&&topTrack.dragMoved()) || (bottomTrack&&bottomTrack.dragMoved()) });

/* Lightbox */
var lb=document.getElementById('lightbox');
var lbImg=document.getElementById('lightboxImg');
var lbCounter=document.getElementById('lightboxCounter');
var lbCaption=document.getElementById('lightboxCaption');
var lbSpinner=document.getElementById('lightboxSpinner');
var thumbStrip=document.getElementById('lightboxThumbs');
var cur=0,scale=1,startX=0,diffX=0,dragging=false;

/* Build thumbs */
galleryItems.forEach(function(item,i){
  var t=document.createElement('img');t.src=defined+item.src;t.alt='';
  t.className='lb-thumb';t.dataset.idx=i;
  t.addEventListener('click',function(){cur=i;update();});
  thumbStrip.appendChild(t);
});

function openLB(i){cur=i;scale=1;lb.classList.add('active');update();document.body.style.overflow='hidden';}
function closeLB(){lb.classList.remove('active');document.body.style.overflow='';resetZoom();}
function resetZoom(){scale=1;lbImg.style.transform='';}
function update(){
  lbSpinner.style.display='block';lbImg.style.opacity='0';
  var img=new Image();img.src=defined+galleryItems[cur].src;
  img.onload=function(){
    lbImg.src=img.src;lbImg.style.opacity='1';lbSpinner.style.display='none';
  };
  lbCounter.textContent=(cur+1)+' / '+galleryItems.length;
  lbCaption.textContent=galleryItems[cur].cap;
  resetZoom();
  /* Active thumb */
  var thumbs=thumbStrip.querySelectorAll('.lb-thumb');
  thumbs.forEach(function(t,i){t.classList.toggle('active',i===cur);});
  thumbs[cur].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
}
function go(d){cur=(cur+d+galleryItems.length)%galleryItems.length;update();}

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

// ===== STICKY MOBILE CTA =====
(function(){
  var stickyCta = document.getElementById('stickyCta');
  if(!stickyCta) return;
  var heroH = window.innerHeight;
  var shown = false;
  window.addEventListener('scroll', function(){
    if(window.scrollY > heroH * 0.8 && !shown){
      stickyCta.classList.add('visible');
      shown = true;
    } else if(window.scrollY <= heroH * 0.5 && shown){
      stickyCta.classList.remove('visible');
      shown = false;
    }
  });
})();

// ===== MAGNETIC BUTTONS =====
(function(){
  if(window.innerWidth <= 768) return;
  var btns = document.querySelectorAll('.btn-magnetic');
  btns.forEach(function(btn){
    btn.addEventListener('mousemove', function(e){
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.3) + 'px,' + (y * 0.3) + 'px)';
    });
    btn.addEventListener('mouseleave', function(){
      btn.style.transform = 'translate(0,0)';
    });
  });
})();

// ===== RESEARCH CARD MODAL =====
(function(){
  var overlay = document.getElementById('rsModalOverlay');
  if(!overlay) return;
  var closeBtn = document.getElementById('rsModalClose');

  // data-modal 카드 클릭 가로채기
  document.addEventListener('click', function(e){
    var card = e.target.closest('[data-modal]');
    if(!card) return;
    // 슬라이더 드래그 중이면 모달 열지 않음
    if(window._sliderDragged) return;
    e.preventDefault();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  function closeModal(){
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e){
    if(e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });
})();

