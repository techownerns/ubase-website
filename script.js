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

// ===== MOBILE TOGGLE (모바일 탭바로 대체됨) =====
// 햄버거 버튼 제거 → 모바일 탭바(mobTabBar) 사용

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



// ===== 모바일 탭바 =====
(function(){
  var tabBar = document.getElementById('mobTabBar');
  if(!tabBar) return;
  var heroH = window.innerHeight * 0.6;

  // 스크롤 시 표시/숨김
  window.addEventListener('scroll', function(){
    if(window.scrollY > heroH){
      tabBar.classList.add('visible');
    } else {
      tabBar.classList.remove('visible');
    }
  }, {passive:true});

  // 현재 섹션 하이라이트
  var links = tabBar.querySelectorAll('a[href^="#"]');
  var sections = [];
  links.forEach(function(a){
    var id = a.getAttribute('href').replace('#','');
    var sec = document.getElementById(id);
    if(sec) sections.push({el:sec, link:a});
  });

  function updateActive(){
    var scrollY = window.scrollY + 80;
    var current = null;
    sections.forEach(function(s){
      if(s.el.offsetTop <= scrollY) current = s;
    });
    links.forEach(function(a){ a.classList.remove('active'); });
    if(current) current.link.classList.add('active');
  }
  window.addEventListener('scroll', updateActive, {passive:true});
  updateActive();

  // 탭 클릭 시 해당 탭으로 스크롤 (탭바 내)
  links.forEach(function(a){
    a.addEventListener('click', function(){
      var rect = a.getBoundingClientRect();
      var barRect = tabBar.getBoundingClientRect();
      var offset = rect.left - barRect.left - barRect.width/2 + rect.width/2;
      tabBar.scrollBy({left:offset, behavior:'smooth'});
    });
  });
})();

// ===== 멘토 영상 호버 재생 =====
(function(){
  var cards = document.querySelectorAll('.mentor-profile-card');
  cards.forEach(function(card){
    var video = card.querySelector('.mentor-video');
    if(!video) return;
    card.addEventListener('mouseenter', function(){ video.play(); });
    card.addEventListener('mouseleave', function(){ video.pause(); });
  });
})();

// ===== 멘토 인터뷰 모달 =====
(function(){
  var mentorData={
    choi:{
      name:'최호준 멘토',
      univ:'세명대학교 한의예과',
      intro:'수능 4등급에서 시작해 삼수 끝에 일반정시로 한의대에 합격한 최호준입니다. 성적이 오르지 않던 시절을 겪어봤기에, 막막한 학생의 마음을 가장 잘 이해하는 멘토가 되겠습니다.',
      qa:[
        {q:'어떤 담임멘토가 되어주실 건가요?',a:'단순히 위에서 지시하고 진도만 체크하는 관리자가 아니라, 같은 길을 먼저 걸어보고 그 고통을 누구보다 잘 아는 든든한 페이스메이커이자 나침반이 되겠습니다. 포기하고 싶은 순간에는 마음 편히 기댈 수 있는 따뜻한 버팀목이 되어주고, 잘못된 방향으로 가고 있을 때는 가장 빠르고 확실한 길을 안내해 주는 단단한 멘토가 되겠습니다.'},
        {q:'멘토링 시 가장 중요하게 생각하는 것은?',a:'정확한 내 위치 파악(메타인지)과 올바른 방향성 설정입니다. 학생과의 깊이 있는 상담을 통해 현재 성적대와 학습 습관의 문제점을 냉정하고 정확하게 진단하는 것을 최우선으로 삼습니다. 학생의 현재 수준에 딱 맞는 단계별 목표를 설정해 주고, 반드시 성적이 오르는 경험을 맛보게 해주겠습니다.'},
        {q:'어떤 유형의 학생에게 도움을 줄 수 있나요?',a:'열심히 하려는 의지는 있지만 기초가 부족해 막막한 학생, 그리고 특정 등급에 정체되어 아무리 노력해도 성적이 오르지 않아 답답함을 느끼는 학생에게 가장 극적인 변화를 만들어 줄 수 있습니다. 현실적으로 소화 가능한 분량으로 학습 계획을 쪼개는 법, 개념과 기출의 본질을 파헤치는 분석법, 멘탈 관리법까지 기초부터 탄탄하게 세워드리겠습니다.'},
        {q:'본인의 공부 스타일은?',a:'압도적인 기본기 완성과 타협 없는 기출 분석이었습니다. 평가원 기출문제는 출제자의 의도와 매력적인 오답의 근거까지 완벽하게 설명할 수 있을 때까지 분석했습니다. 약점을 회피하지 않고 집요하게 파고들어 강점으로 바꾸는 독종 같은 공부 스타일, 그것이 제가 기적을 만든 비결입니다.'}
      ]
    },
    kim:{
      name:'김명준 멘토',
      univ:'서울대학교 전기정보공학부',
      intro:'군복무를 하던 도중 수능을 보고 전역 후 신입생으로 입학했습니다. 나름 입시를 오래했었고, 그 경험을 바탕으로 올해 수능을 보는 멘티들한테 많은 도움을 주고 싶습니다.',
      qa:[
        {q:'본인의 공부 방법이나 스토리를 들려주세요',a:'군대라는 한정된 환경 속 최대한으로 효율적인 공부를 하기 위해 많은 고민을 했었습니다. 6월 모의고사 전후, 9월 모의고사 전후, 수능 직전에 어떤 문제집을 풀지 크게 틀을 잡아 주마다 계획을 세워 변수가 생기면 조금씩 수정하는 방향으로 공부를 진행했습니다.'},
        {q:'학습지도 포인트를 들려주세요',a:'각 학생들이 스스로 공부의 방향성을 확립하는 것이 중요하다고 생각합니다. 각 과목을 어떻게 공부하는지, 실제 시험장에서 어떤 방식으로 문제를 풀고 전략을 짜는지는 개인마다 모두 다릅니다. 저의 경험을 바탕으로 조언을 해주며 학생 자신이 스스로의 공부방법을 잡게 해 효율적으로 공부하는 데 도와주고 싶습니다.'},
        {q:'구체적으로 어떤 학습 조언을 주실 수 있나요?',a:'현재 수능 시장은 컨텐츠가 너무 많아 오히려 어떤 문제집을 어느 시기에 풀어야 할지 고민하는 경우가 많습니다. 특히 국어의 경우 수능 백분위 91에서 96, 그리고 100으로 정직하게 우상향을 했었습니다. 국어의 여러 기출 문제집과 사설 문제집의 균형을 어떤 식으로 잡아야 할지 방향성을 제시하겠습니다.'},
        {q:'어떤 학생분이 멘토님과 잘 맞을까요?',a:'성적을 올리고 싶은 열의가 있는 학생, 과목의 시간 배분과 같은 학습 방향에 대한 고민이 있는 학생에게 현실적인 조언과 함께 무거운 입시의 짐을 같이 들어주는 멘토가 되겠습니다.'}
      ]
    },
    park:{
      name:'박예지 멘토',
      univ:'고려대학교 경제학과',
      intro:'학생부종합전형, 논술전형, 정시전형 모두에서 성과를 이루었습니다. 반수 생활에서 철저한 시간 관리와 기출 분석을 통해 합격한 경험을 바탕으로 도움을 드리겠습니다.',
      qa:[
        {q:'본인의 공부 방법이나 스토리를 들려주세요',a:'항상 계획을 짜면서 공부하였습니다. 입시는 오래, 꾸준히 하는 장기 레이스입니다. 주어진 시간을 알차게 활용하는 것이 입시 성공에 가장 큰 부분이었습니다. 기본 개념을 공부한 뒤 평가원 기출문제를 최소 5개년치를 풀고, 기출문제를 여러번 분석하며 완벽하게 숙지한 후 사설 문제를 풀었습니다.'},
        {q:'학습지도 포인트를 들려주세요',a:'가장 중요하게 생각하는 것은 방향성입니다. 본인이 현재 어떤 위치에 있는지, 어떤 상황인지 객관적으로 생각하고 앞으로 어떤 부분을 채워나갈 건지 먼저 생각해야 합니다. 멘토로서 객관적으로 학생들의 상태를 보고 거시적인 부분부터 미시적인 부분까지 공부의 방향성을 잡아주겠습니다.'},
        {q:'구체적으로 어떤 학습 조언을 주실 수 있나요?',a:'학생부종합전형을 준비하는 학생의 경우, 현재 등급대와 생기부를 참고해 앞으로 어떤 방향으로 생기부를 채워나가야 할지 조언해드립니다. 정시전형을 준비하는 학생의 경우, 최근 모의고사 성적과 현재 공부 방법을 보고 과목별로 어떤 방향으로 공부하는게 좋을지 조언해드립니다.'},
        {q:'어떤 학생분이 멘토님과 잘 맞을까요?',a:'아직 공부 방향성을 못잡겠는 학생, 내가 지금 하고 있는게 맞는지 의심되는 학생, 객관적으로 자신의 상태를 점검해보고 싶은 학생, 입시에 대한 고민이 있는 모든 학생에게 추천합니다. 친구같은 멘토가 되겠습니다.'}
      ]
    }
  };

  var overlay=document.getElementById('mentorModal');
  var body=document.getElementById('mentorModalBody');
  if(!overlay||!body) return;

  document.querySelectorAll('.mentor-profile-card[data-mentor]').forEach(function(card){
    card.addEventListener('click',function(){
      var key=card.getAttribute('data-mentor');
      var d=mentorData[key];
      if(!d) return;
      var html='<div class="mentor-modal-header"><div><h3>'+d.name+'</h3><div class="mentor-modal-univ">'+d.univ+'</div></div></div>';
      html+='<div class="mentor-modal-intro">'+d.intro+'</div>';
      d.qa.forEach(function(item){
        html+='<div class="mentor-modal-qa"><h4>'+item.q+'</h4><p>'+item.a+'</p></div>';
      });
      body.innerHTML=html;
      overlay.classList.add('active');
      document.body.style.overflow='hidden';
    });
  });

  overlay.addEventListener('click',function(e){
    if(e.target===overlay||e.target.classList.contains('mentor-modal-close')){
      overlay.classList.remove('active');
      document.body.style.overflow='';
    }
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&overlay.classList.contains('active')){
      overlay.classList.remove('active');
      document.body.style.overflow='';
    }
  });
})();

/* ── FACILITY GALLERY (BENTO GRID + LIGHTBOX/INSTA VIEWER) ── */
const BUCKET = 'https://ohuqwtugvafcxfvwizqh.supabase.co/storage/v1/render/image/public/facility/';
const BUCKET_FULL = 'https://ohuqwtugvafcxfvwizqh.supabase.co/storage/v1/object/public/facility/';

/* 벤토 배치 순서: featured(lg)는 큰 타일, 나머지는 작은 타일 */
var facilityImages = [
  {src:'facility-04.jpg',cap:'독서실 전경',lg:true},
  {src:'b01_02.jpg'},{src:'b01_03.jpg'},
  {src:'b02_05.jpg'},{src:'b03_01.jpg'},
  {src:'b03_03.jpg'},{src:'b05_05.jpg'},
  {src:'facility-02.jpg',cap:'개인 독서 공간',lg:true},
  {src:'b07_03.jpg'},{src:'b09_04.jpg'},
  {src:'facility-01.jpg',cap:'안면인식 턴게이트',lg:true},
  {src:'b11_01.jpg'},{src:'b11_02.jpg'},
  {src:'b11_03.jpg'},{src:'b13_02.jpg'},
  {src:'b14_01.jpg'},{src:'b17_01.jpg'},
  {src:'facility-03.jpg',cap:'프리미엄 로비',lg:true},
  {src:'b17_02.jpg'},{src:'b05_02.jpg'},
  {src:'b10_02.jpg'},{src:'b11_04.jpg'},
  {src:'facility-11.jpg',cap:'복도'},
  {src:'b14_03.jpg'},{src:'b15_01.jpg'},
  {src:'facility-06.jpg',cap:'휴게 공간',lg:true},
  {src:'b15_02.jpg'},{src:'b17_05.jpg'},
  {src:'b19_01.jpg'},{src:'b20_03.jpg'},
  {src:'facility-08.jpg',cap:'식당/휴게 공간',lg:true},
  {src:'facility-15.jpg',cap:'상담실'},
  {src:'facility-16.jpg',cap:'프린터/복합기'},
  {src:'facility-17.jpg',cap:'휴게실 전경'},
  {src:'b03_05.jpg'},{src:'b08_02.jpg'},
  {src:'b12_03.jpg'},{src:'b14_05.jpg'},
  {src:'facility-10.jpg',cap:'개인 좌석'},
  {src:'b04_01.jpg'},{src:'b04_05.jpg'},
  {src:'b07_01.jpg'},{src:'b07_05.jpg'},
  {src:'b08_04.jpg'},{src:'b10_01.jpg'},
  {src:'b12_04.jpg'},{src:'b13_01.jpg'},
  {src:'b15_05.jpg'},{src:'b16_05.jpg'},
  {src:'b18_05.jpg'}
];

/* ── 벤토 그리드 렌더링 ── */
var currentFiltered = facilityImages;

(function renderBento() {
  var grid = document.getElementById('facGrid');
  facilityImages.forEach(function(item, i) {
    var card = document.createElement('div');
    card.className = 'bento-card' + (item.lg ? ' bento-card--lg' : '');
    var w = item.lg ? 800 : 400;
    var h = item.lg ? 600 : 300;
    var thumbUrl = BUCKET + item.src + '?width=' + w + '&height=' + h + '&resize=cover&quality=75';
    card.innerHTML = '<img src="' + thumbUrl + '" alt="' + (item.cap||'') + '" loading="lazy">'
      + (item.cap ? '<span class="bento-cap">' + item.cap + '</span>' : '');
    card.addEventListener('click', function(){ openViewer(i); });
    grid.appendChild(card);
  });
})();

/* ── 더보기 버튼 ── */
var bentoMore = document.getElementById('bentoMore');
function getBentoStep() {
  var w = window.innerWidth;
  if (w <= 480) return 256;
  if (w <= 768) return 308;
  if (w <= 1024) return 395;
  return 470;
}
bentoMore.addEventListener('click', function() {
  var grid = document.getElementById('facGrid');
  var step = getBentoStep();
  var current = parseInt(grid.style.maxHeight) || step;
  var next = current + step;
  if (next >= grid.scrollHeight) {
    grid.style.maxHeight = 'none';
    bentoMore.classList.add('hidden');
  } else {
    grid.style.maxHeight = next + 'px';
  }
});

/* ── PC/모바일 분기 ── */
function openViewer(idx) {
  if (window.innerWidth <= 768) {
    openInsta(idx);
  } else {
    openLB(idx);
  }
}

/* ── PC 라이트박스 ── */
var lb = document.getElementById('lightbox');
var lbImg = document.getElementById('lightboxImg');
var lbCounter = document.getElementById('lightboxCounter');
var lbCaption = document.getElementById('lightboxCaption');
var lbSpinner = document.getElementById('lightboxSpinner');
var thumbStrip = document.getElementById('lightboxThumbs');
var cur = 0, scale = 1, startX = 0, diffX = 0, dragging = false;

function buildThumbs() {
  thumbStrip.innerHTML = '';
  currentFiltered.forEach(function(item, i) {
    var t = document.createElement('img');
    t.src = BUCKET + item.src + '?width=80&height=60&resize=cover&quality=60';
    t.alt = ''; t.className = 'lb-thumb'; t.dataset.idx = i;
    t.addEventListener('click', function(){ cur = i; lbUpdate(); });
    thumbStrip.appendChild(t);
  });
}

function openLB(i) {
  buildThumbs();
  cur = i; scale = 1;
  lb.classList.add('active');
  lbUpdate();
  document.body.style.overflow = 'hidden';
}
function closeLB() { lb.classList.remove('active'); document.body.style.overflow = ''; resetZoom(); }
function resetZoom() { scale = 1; lbImg.style.transform = ''; lbImg.style.transformOrigin = ''; }
function lbUpdate() {
  lbSpinner.style.display = 'block'; lbImg.style.opacity = '0';
  var img = new Image();
  img.src = BUCKET_FULL + currentFiltered[cur].src;
  img.onload = function() {
    lbImg.src = img.src; lbImg.style.opacity = '1'; lbSpinner.style.display = 'none';
  };
  /* 카운터 삭제됨 */
  lbCaption.textContent = currentFiltered[cur].cap || '';
  resetZoom();
  var thumbs = thumbStrip.querySelectorAll('.lb-thumb');
  thumbs.forEach(function(t, i){ t.classList.toggle('active', i === cur); });
  if (thumbs[cur]) thumbs[cur].scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
}
function lbGo(d) { cur = (cur + d + currentFiltered.length) % currentFiltered.length; lbUpdate(); }

document.getElementById('lightboxClose').addEventListener('click', closeLB);
document.getElementById('lightboxPrev').addEventListener('click', function(){ lbGo(-1); });
document.getElementById('lightboxNext').addEventListener('click', function(){ lbGo(1); });
lb.addEventListener('click', function(e){ if(e.target === lb) closeLB(); });
document.addEventListener('keydown', function(e) {
  if (!lb.classList.contains('active')) return;
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowLeft') lbGo(-1);
  if (e.key === 'ArrowRight') lbGo(1);
});

/* 라이트박스 터치 스와이프 */
lbImg.addEventListener('touchstart', function(e){
  if(e.touches.length===1){startX=e.touches[0].clientX;dragging=true;diffX=0;}
},{passive:true});
lbImg.addEventListener('touchmove', function(e){
  if(!dragging||e.touches.length!==1)return;diffX=e.touches[0].clientX-startX;
},{passive:true});
lbImg.addEventListener('touchend', function(){
  if(!dragging)return;dragging=false;
  if(Math.abs(diffX)>50){diffX>0?lbGo(-1):lbGo(1);}
});
/* 핀치 줌 */
var initDist=0;
lbImg.addEventListener('touchstart', function(e){
  if(e.touches.length===2){
    dragging=false; /* 핀치 시 스와이프 비활성화 */
    initDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
    var rect=lbImg.getBoundingClientRect();
    var mx=(e.touches[0].clientX+e.touches[1].clientX)/2-rect.left;
    var my=(e.touches[0].clientY+e.touches[1].clientY)/2-rect.top;
    lbImg.style.transformOrigin=mx+'px '+my+'px';
  }
},{passive:true});
lbImg.addEventListener('touchmove', function(e){
  if(e.touches.length===2&&initDist>0){
    var d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
    scale=Math.min(3,Math.max(1,scale*(d/initDist)));initDist=d;
    lbImg.style.transform='scale('+scale+')';e.preventDefault();
  }
},{passive:false});
/* 더블탭 줌 */
var lastTap=0;
lbImg.addEventListener('touchend', function(e){
  if(e.touches.length>0)return;
  var now=Date.now();
  if(now-lastTap<300){
    if(scale>1){scale=1;lbImg.style.transform='';lbImg.style.transformOrigin='';}
    else{
      var rect=lbImg.getBoundingClientRect();
      var tx=e.changedTouches[0].clientX-rect.left;
      var ty=e.changedTouches[0].clientY-rect.top;
      lbImg.style.transformOrigin=tx+'px '+ty+'px';
      scale=2;lbImg.style.transform='scale(2)';
    }
  }
  lastTap=now;
});

/* ── 모바일 인스타 뷰어 ── */
var instaEl = document.getElementById('instaViewer');
var instaScroll = document.getElementById('instaScroll');
var instaCounter = document.getElementById('instaCounter');

function openInsta(idx) {
  instaScroll.innerHTML = '';
  currentFiltered.forEach(function(item, i) {
    var slide = document.createElement('div');
    slide.className = 'insta-slide';
    slide.dataset.idx = i;
    var imgUrl = BUCKET_FULL + item.src;
    slide.innerHTML = '<img src="' + imgUrl + '" alt="' + (item.cap||'') + '">'
      + (item.cap ? '<div class="insta-slide-cap">' + item.cap + '</div>' : '');
    instaScroll.appendChild(slide);
    /* 인스타 슬라이드 핀치 줌 */
    (function(sl){
      var img=sl.querySelector('img');
      var sDist=0,sScale=1,sLastTap=0;
      img.addEventListener('touchstart',function(e){
        if(e.touches.length===2){
          sDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
          var rect=img.getBoundingClientRect();
          var mx=(e.touches[0].clientX+e.touches[1].clientX)/2-rect.left;
          var my=(e.touches[0].clientY+e.touches[1].clientY)/2-rect.top;
          img.style.transformOrigin=mx+'px '+my+'px';
          instaScroll.style.scrollSnapType='none';
          instaScroll.style.overflowY='hidden';
        }
      },{passive:true});
      img.addEventListener('touchmove',function(e){
        if(e.touches.length===2&&sDist>0){
          var d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
          sScale=Math.min(3,Math.max(1,sScale*(d/sDist)));sDist=d;
          img.style.transform='scale('+sScale+')';e.preventDefault();
        }
      },{passive:false});
      img.addEventListener('touchend',function(e){
        if(e.touches.length>0)return;
        /* 줌 아웃 시 리셋 (1.05 미만이면 1로 간주) */
        if(sScale<=1.05){
          sScale=1;img.style.transform='';img.style.transformOrigin='';
          instaScroll.style.scrollSnapType='y mandatory';
          instaScroll.style.overflowY='';
        }
        /* 더블탭 줌 */
        var now=Date.now();
        if(now-sLastTap<300){
          if(sScale>1){
            sScale=1;img.style.transform='';img.style.transformOrigin='';
            instaScroll.style.scrollSnapType='y mandatory';
            instaScroll.style.overflowY='';
          } else {
            var rect=img.getBoundingClientRect();
            var tx=e.changedTouches[0].clientX-rect.left;
            var ty=e.changedTouches[0].clientY-rect.top;
            img.style.transformOrigin=tx+'px '+ty+'px';
            sScale=2;img.style.transform='scale(2)';
            instaScroll.style.scrollSnapType='none';
            instaScroll.style.overflowY='hidden';
          }
        }
        sLastTap=now;
      });
    })(slide);
  });
  instaEl.classList.add('active');
  document.body.style.overflow = 'hidden';
  /* 해당 인덱스로 스크롤 */
  setTimeout(function(){
    var target = instaScroll.children[idx];
    if(target) target.scrollIntoView({behavior:'instant'});
    updateInstaCounter();
  }, 50);
  /* 스크롤 시 카운터 업데이트 */
  instaScroll.addEventListener('scroll', updateInstaCounter);
}

function updateInstaCounter() {
  var scrollTop = instaScroll.scrollTop;
  var slideH = instaScroll.children[0] ? instaScroll.children[0].offsetHeight : 1;
  var idx = Math.round(scrollTop / slideH);
  /* 카운터 삭제됨 */
}

function closeInsta() {
  instaEl.classList.remove('active');
  document.body.style.overflow = '';
  instaScroll.removeEventListener('scroll', updateInstaCounter);
}

document.getElementById('instaClose').addEventListener('click', closeInsta);
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && instaEl.classList.contains('active')) closeInsta();
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
  var modalUni = document.getElementById('rsModalUni');
  var modalTitle = document.getElementById('rsModalTitle');
  var modalMeta = document.getElementById('rsModalMeta');
  var modalBody = document.getElementById('rsModalBody');
  var modalLink = document.getElementById('rsModalLink');

  var researchDetails = {
    '연세대학교': {meta:'PubMed · 2024', body:'<p>본 연구는 대학생의 학업적 자기효능감과 학습환경 간의 상호작용이 학업 성과에 미치는 영향을 분석하였습니다.</p><p><strong>핵심 발견:</strong> 지지적인 학습 환경(조용한 공간, 구조화된 시간표, 또래 학습 분위기)이 학생의 자기효능감을 유의미하게 높이고, 이는 집중 지속 시간 연장과 학업 성취도 향상으로 이어졌습니다.</p><p><strong>시사점:</strong> 의지가 아닌 환경 설계가 지속 가능한 학습 습관의 핵심 동력임을 실증적으로 확인하였습니다.</p>'},
    '하버드대학교': {meta:'PubMed · 2019', body:'<p>본 연구는 의지력(self-control)의 한계를 인정하고, 환경을 사전에 설계하는 전략이 자기조절에 더 효과적임을 밝혔습니다.</p><p><strong>핵심 발견:</strong> 유혹 요소를 물리적으로 제거한 환경에서 학습한 그룹이 의지력에만 의존한 그룹보다 목표 달성률이 2배 이상 높았습니다.</p><p><strong>시사점:</strong> 의지력 훈련보다 환경 설계가 장기적 자기조절 성공의 핵심 전략입니다.</p>'},
    '고려대학교': {meta:'IJESTY · 2023', body:'<p>본 연구는 뇌파(EEG) 측정을 통해 학습 환경 설계 방식이 집중도에 미치는 영향을 정량적으로 분석하였습니다.</p><p><strong>핵심 발견:</strong> 소음 차단, 휴대폰 격리 등 통제된 학습 환경에서 알파파·베타파 비율이 유의미하게 개선되어 깊은 집중 상태가 더 오래 유지되었습니다.</p><p><strong>시사점:</strong> 학습 환경의 물리적 설계가 뇌 수준에서 집중력을 좌우한다는 과학적 근거를 제시합니다.</p>'},
    '스탠퍼드대학교': {meta:'PubMed · 2014', body:'<p>본 연구는 물리적 환경 변화(걷기)가 창의적 사고에 미치는 영향을 실험적으로 검증하였습니다.</p><p><strong>핵심 발견:</strong> 환경을 바꾼 그룹(실내→실외 걷기)의 창의적 사고 점수가 평균 81% 향상되었으며, 이는 환경이 인지 수행에 직접 영향을 미침을 보여줍니다.</p><p><strong>시사점:</strong> 학습 공간의 물리적 특성이 사고력과 문제해결 능력에 직접적인 영향을 미칩니다.</p>'},
    '서울대학교': {meta:'Springer · 2001', body:'<p>본 연구는 고등학생 1,012명을 대상으로 교실 환경 인식이 학업 성취도에 미치는 영향을 분석하였습니다.</p><p><strong>핵심 발견:</strong> 교실의 응집력, 참여도, 질서 수준 등 환경적 요인이 학업 성취를 유의미하게 예측하였으며, 물리적 환경 개선만으로도 성적 향상 효과가 나타났습니다.</p><p><strong>시사점:</strong> 학습 환경의 질이 개인 능력 못지않게 성적에 중요한 변수임을 확인하였습니다.</p>'},
    '프린스턴대학교': {meta:'PubMed · 2011', body:'<p>본 연구는 시각적 혼란(물건 배치, 정리 상태)이 뇌의 정보 처리 능력에 미치는 영향을 fMRI로 분석하였습니다.</p><p><strong>핵심 발견:</strong> 시각적으로 어수선한 환경에서 뇌의 주의력 자원이 분산되어 집중력과 작업 성과가 유의미하게 저하되었습니다.</p><p><strong>시사점:</strong> 정돈된 학습 공간이 뇌의 처리 효율을 높여 더 깊은 집중을 가능하게 합니다.</p>'},
    '펜실베이니아대학교': {meta:'PMC · 2016', body:'<p>본 연구는 Angela Duckworth의 Grit(끈기) 이론을 바탕으로, 환경이 끈기 발휘에 미치는 영향을 분석하였습니다.</p><p><strong>핵심 발견:</strong> 의지(Grit)는 유혹이 제거된 전략적 환경에서 더 강력하게 발휘되며, 환경 없이 의지만으로는 성과 달성이 제한적이었습니다.</p><p><strong>시사점:</strong> 끈기는 타고나는 것이 아니라, 환경이 뒷받침될 때 극대화되는 역량입니다.</p>'},
    'MIT': {meta:'MIT EdTech · 2003', body:'<p>본 연구는 MIT의 TEAL(Technology-Enabled Active Learning) 프로젝트로, 강의식 교실을 소그룹 상호작용 교실로 재설계한 결과를 분석하였습니다.</p><p><strong>핵심 발견:</strong> 환경 재설계 후 학생 이해도가 유의미하게 향상되었고, 낙제율이 50% 감소하였습니다.</p><p><strong>시사점:</strong> 학습 공간의 물리적 재설계만으로도 학업 성과를 크게 개선할 수 있습니다.</p>'},
    '예일대학교': {meta:'Yale Poorvu Center', body:'<p>본 연구는 능동적 학습(Active Learning)을 촉진하는 교실 환경 설계의 효과를 분석하였습니다.</p><p><strong>핵심 발견:</strong> 능동적 학습을 유도하는 환경 설정이 학생 참여도를 높이고, 특히 성적 하위권 학생들의 격차 해소에 크게 기여하였습니다.</p><p><strong>시사점:</strong> 환경 설계를 통한 학습 참여 유도가 모든 수준의 학생에게 효과적입니다.</p>'},
    '콜럼비아대학교': {meta:'Columbia CTL', body:'<p>본 연구는 높은 신뢰(High Trust)와 낮은 스트레스(Low Stress) 환경이 학습에 미치는 영향을 분석하였습니다.</p><p><strong>핵심 발견:</strong> 심리적 안전감이 확보된 환경에서 학생의 자발적 의지가 높아지고, 이는 학업 성공과 직접적으로 연결되었습니다.</p><p><strong>시사점:</strong> 물리적 환경뿐 아니라 심리적 환경(신뢰, 안정감)도 학습 성과의 핵심 요인입니다.</p>'}
  };

  // 모든 rs-card 클릭 가로채기
  document.addEventListener('click', function(e){
    var card = e.target.closest('.rs-card');
    if(!card) return;
    if(window._sliderDragged) return;
    e.preventDefault();

    var uniName = card.querySelector('.rs-uni-name');
    var headline = card.querySelector('.rs-headline');
    var href = card.getAttribute('href');
    var uni = uniName ? uniName.textContent.trim() : '';
    var title = headline ? headline.textContent.trim() : '';
    var detail = researchDetails[uni];

    modalUni.textContent = uni;
    modalTitle.textContent = title;
    modalMeta.textContent = detail ? detail.meta : '';
    modalBody.innerHTML = detail ? detail.body : '';
    modalLink.href = href || '#';

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

// ===== 할인 팝업 =====
(function(){
  var overlay = document.getElementById('discountOverlay');
  var closeBtn = document.getElementById('discountClose');
  var ctaBtn = document.getElementById('discountCta');
  if(!overlay) return;

  function openPopup(){ overlay.classList.add('active'); document.body.style.overflow='hidden'; }
  function closePopup(){ overlay.classList.remove('active'); document.body.style.overflow=''; sessionStorage.setItem('ubase_discount_seen','1'); }

  if(!sessionStorage.getItem('ubase_discount_seen')){
    setTimeout(openPopup, 2500);
  }

  closeBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', function(e){ if(e.target===overlay) closePopup(); });
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape' && overlay.classList.contains('active')) closePopup();
  });

  if(ctaBtn){
    ctaBtn.addEventListener('click', function(e){
      e.preventDefault();
      closePopup();
      document.getElementById('contact').scrollIntoView({behavior:'smooth'});
    });
  }
})();

/* ── CHATBOT ── */
(function(){
  var CHAT_URL = 'https://ohuqwtugvafcxfvwizqh.supabase.co/functions/v1/chat';
  var fab = document.getElementById('chatbotFab');
  var panel = document.getElementById('chatbotPanel');
  var form = document.getElementById('chatbotForm');
  var input = document.getElementById('chatbotInput');
  var msgBox = document.getElementById('chatbotMessages');
  if(!fab || !panel) return;

  var history = [];

  fab.addEventListener('click', function(){
    var open = fab.classList.toggle('active');
    panel.classList.toggle('active');
    if(open) input.focus();
  });

  function addMsg(role, text){
    var wrap = document.createElement('div');
    wrap.className = 'chatbot-msg chatbot-msg-' + (role === 'user' ? 'user' : 'bot');
    var bubble = document.createElement('div');
    bubble.className = 'chatbot-msg-bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    msgBox.appendChild(wrap);
    msgBox.scrollTop = msgBox.scrollHeight;
    return wrap;
  }

  function addTyping(){
    var wrap = document.createElement('div');
    wrap.className = 'chatbot-msg chatbot-msg-bot chatbot-msg-typing';
    wrap.innerHTML = '<div class="chatbot-msg-bubble"><span></span><span></span><span></span></div>';
    msgBox.appendChild(wrap);
    msgBox.scrollTop = msgBox.scrollHeight;
    return wrap;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var text = input.value.trim();
    if(!text) return;
    input.value = '';

    addMsg('user', text);
    history.push({ role: 'user', content: text });

    var typing = addTyping();

    fetch(CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      typing.remove();
      var reply = data.reply || data.error || '죄송합니다. 다시 시도해주세요.';
      addMsg('bot', reply);
      history.push({ role: 'assistant', content: reply });
    })
    .catch(function(){
      typing.remove();
      addMsg('bot', '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    });
  });
})();

