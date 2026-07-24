// 导航栏滚动效果 + 当前导航高亮（合并为单个滚动监听）
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');
let scrollTicking = false;

function onScroll() {
  scrollTicking = false;
  // 导航栏样式
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  // 当前导航高亮
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(onScroll);
  }
}, { passive: true });

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// 滚动动画
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// 观察需要动画的元素
document.querySelectorAll('.about, .works, .skills, .contact').forEach(el => {
  observer.observe(el);
});

// 数字递增动画
function animateNumbers() {
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(el => {
    const text = el.textContent;
    const match = text.match(/^(\d+)(\+?)$/);
    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = match[2];
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * easeOut);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    el.textContent = '0' + suffix;
    requestAnimationFrame(update);
  });
}

// 当about板块可见时触发数字动画
const aboutObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateNumbers();
      aboutObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const aboutSection = document.querySelector('.about');
if (aboutSection) {
  aboutObserver.observe(aboutSection);
}

// 鼠标跟随光效（throttled via rAF）
const hero = document.querySelector('.hero');
let heroTicking = false;

if (hero) {
  hero.addEventListener('mousemove', (e) => {
    if (heroTicking) return;
    heroTicking = true;
    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      hero.style.setProperty('--mouse-x', `${x}px`);
      hero.style.setProperty('--mouse-y', `${y}px`);
      heroTicking = false;
    });
  }, { passive: true });
}

// 灯箱功能
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxBody = document.getElementById('lightbox-body');
  const detailModal = document.getElementById('detail-modal');
  const detailBody = document.getElementById('detail-body');
  const workCards = document.querySelectorAll('.work-card');

  if (!lightbox || !lightboxBody || !detailModal || !detailBody) return;

  // 项目数据
  const projects = [
    {
      id: 1,
      gallery: [
        { gradient: "url('作品/作品1.webp') center/contain no-repeat #1a1a1a", text: '', details: [
          { gradient: "url('作品/作品1.webp') center/contain no-repeat #1a1a1a", text: '' },
          { gradient: "url('作品/品牌要素.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/情绪版1.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/情绪版2.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/设计理念1.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/设计理念2.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/品牌色彩1.webp') center/contain no-repeat #2d5a3d", text: '' },
          { gradient: "url('作品/品牌色彩2.webp') center/contain no-repeat #c9a96e", text: '' },
          { gradient: "url('作品/LOGO规范.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/LOGO组合1.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/LOGO组合2.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/品牌应用1.webp') center/contain no-repeat #1a1a1a", text: '' },
          { gradient: "url('作品/品牌应用2.webp') center/contain no-repeat #2d5a3d", text: '' },
          { gradient: "url('作品/品牌应用3.webp') center/contain no-repeat #2d5a3d", text: '' },
          { gradient: "url('作品/品牌应用4.webp') center/contain no-repeat #2d5a3d", text: '' },
          { gradient: "url('作品/品牌应用5.webp') center/contain no-repeat #d4c4a8", text: '' },
          { gradient: "url('作品/品牌应用6.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/品牌应用7.webp') center/contain no-repeat #2d5a3d", text: '' },
          { gradient: "url('作品/品牌应用8.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/品牌应用9.webp') center/contain no-repeat #2d5a3d", text: '' },
          { gradient: "url('作品/品牌应用10.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/品牌应用11.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/画册.webp') center/contain no-repeat #f5f5f5", text: '' }
        ]},
        { gradient: "url('作品/APP说明.webp') center/contain no-repeat #f5f5f5", text: '', details: [
          { gradient: "url('作品/APP说明.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/色彩设计.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/设计方案1.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/设计方案2.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/设计方案3.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/方案汇总.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/图标展示.webp') center/contain no-repeat #f5f5f5", text: '' }
        ]},
        { gradient: "url('作品/ITZR智仁.webp') center/contain no-repeat #1a1a1a", text: '', details: [
          { gradient: "url('作品/ITZR智仁.webp') center/contain no-repeat #1a1a1a", text: '' },
          { gradient: "url('作品/ITZR_logo.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/ITZR贴纸.webp') center/contain no-repeat #d0d0d0", text: '' },
          { gradient: "url('作品/ITZR画册.webp') center/contain no-repeat #d0d0d0", text: '' },
          { gradient: "url('作品/ITZR工牌.webp') center/contain no-repeat #d0d0d0", text: '' },
          { gradient: "url('作品/ITZR杯子.webp') center/contain no-repeat #d0d0d0", text: '' },
          { gradient: "url('作品/ITZR名片.webp') center/contain no-repeat #d0d0d0", text: '' }
        ]},
        { gradient: "url('作品/GBA医疗工牌.webp') center/contain no-repeat #f5f5f5", text: '', details: [
          { gradient: "url('作品/GBA医疗工牌.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/GBA_logo.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/GBA展架.webp') center/contain no-repeat #3a6b9f", text: '' },
          { gradient: "url('作品/GBA形象墙.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/GBA手提袋.webp') center/contain no-repeat #f5f5f5", text: '' }
        ]}
      ]
    },
    {
      id: 2,
      gallery: [
        { gradient: "url('作品/产品包装.webp') center/contain no-repeat #f5f5f5", text: '', details: [
          { gradient: "url('作品/产品包装.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/产品包装展开.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/SECAM包装.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/SECAM说明书.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/SD卡包装.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/Superior包装.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/SmartIP包装.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/MMV包装.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/Geeni包装.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/陈皮白茶包装.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/ECHIPS包装.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/Garza包装.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/太阳能板说明书.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/智能门铃详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/产品标签设计.webp') center/contain no-repeat #f5f5f5", text: '' }
        ]},
        { gradient: "url('作品/电商设计2.webp') center/contain no-repeat #f5f5f5", text: '', details: [
          { gradient: "url('作品/电商设计详情1.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/美妆banner.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/美妆banner2.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/手表详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/香薰详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/香薰详情2.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/饰品包装详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/蜡烛详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/香薰片详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/车载香薰详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/安防摄像头详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/电商banner图.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/洗护banner图.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/香氛洗护详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/檀木香氛详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/美妆详情图.webp') center/contain no-repeat #f5f5f5", text: '' }
        ]},
        { gradient: "url('作品/笔记本电脑封面.webp') center/contain no-repeat #f5f5f5", text: '', details: [
          { gradient: "url('作品/笔记本电脑封面.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/一体机详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/平板电脑详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/平板电脑X10详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/ITZR一体机详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/行车记录仪详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/平板电脑详情2.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/行车记录仪功能详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/平板电脑详情3.webp') center/contain no-repeat #f5f5f5", text: '' }
        ]}
      ]
    },
    {
      id: 3,
      gallery: [
        { gradient: "url('作品/AIO电脑详情.webp') center/contain no-repeat #f5f5f5", text: '', details: [
          { gradient: "url('作品/AIO电脑详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/VR设备详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/安防摄像头详情2.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/安防摄像头详情3.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/安防摄像头详情4.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/安防摄像头详情5.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/手机指环支架详情.webp') center/contain no-repeat #f5f5f5", text: '' }
        ]},
        { gradient: "url('作品/行车记录仪多角度.webp') center/contain no-repeat #f5f5f5", text: '', details: [
          { gradient: "url('作品/行车记录仪多角度.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/行车记录仪详情1.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/行车记录仪详情2.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/行车记录仪详情3.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/行车记录仪详情4.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/行车记录仪详情5.webp') center/contain no-repeat #f5f5f5", text: '' }
        ]},
        { gradient: "url('作品/WiFi摄像头.webp') center/contain no-repeat #f5f5f5", text: '', details: [
          { gradient: "url('作品/WiFi摄像头.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/WiFi摄像头详情1.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/WiFi摄像头详情2.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('Items/WiFi摄像头详情3.jpg') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/WiFi摄像头详情4.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/WiFi摄像头详情5.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/WiFi摄像头详情7.webp') center/contain no-repeat #f5f5f5", text: '' }
        ]},
        { gradient: "url('作品/珠宝首饰.webp') center/contain no-repeat #f5f5f5", text: '', details: [
          { gradient: "url('作品/珠宝首饰.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/玫瑰金箭头手链详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/玫瑰金四叶草耳钉详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/金色珍珠吊坠详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/金色珍珠项链详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/玫瑰金星星套装详情.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/玫瑰金星星套装展示.webp') center/contain no-repeat #f5f5f5", text: '' }
        ]}
      ]
    },
    {
      id: 4,
      gallery: [
        { gradient: "url('作品/UAPP封面.webp') center/contain no-repeat #1a1a2e", text: '', details: [
          { gradient: "url('作品/UAPP封面.webp') center/contain no-repeat #1a1a2e", text: '' },
          { gradient: "url('作品/UAPP详情1.webp') center/contain no-repeat #1a1a2e", text: '' },
          { gradient: "url('作品/UAPP详情2.webp') center/contain no-repeat #1a1a2e", text: '' },
          { gradient: "url('作品/UAPP详情3.webp') center/contain no-repeat #1a1a2e", text: '' },
          { gradient: "url('作品/UAPP详情4.webp') center/contain no-repeat #1a1a2e", text: '' }
        ]},
        { gradient: "url('作品/第四个列表2封面.webp') center/contain no-repeat #1a1a2e", text: '', details: [
          { gradient: "url('作品/第四个详情2.mp4') center/contain no-repeat #1a1a2e", text: '' },
          { gradient: "url('作品/第四个详情2-1.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/第四个详情2-2.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/第四个详情2-3.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/第四个详情2-4.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/第四个详情2-5.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/第四个详情2-6.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/第四个详情2-7.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/第四个详情2-8.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/第四个详情2-9.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/第四个详情2-10.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/第四个详情2-11.webp') center/contain no-repeat #f5f5f5", text: '' }
        ]},
        { gradient: "url('作品/云天团封面.webp') center/contain no-repeat #4a9c3d", text: '', details: [
          { gradient: "url('作品/云天团封面.webp') center/contain no-repeat #4a9c3d", text: '' },
          { gradient: "url('作品/云天团详情1.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/云天团详情2.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/云天团详情3.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/云天团详情4.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/云天团详情5.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/云天团详情6.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/云天团详情7.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/云天团详情8.webp') center/contain no-repeat #f5f5f5", text: '' },
          { gradient: "url('作品/云天团详情9.webp') center/contain no-repeat #f5f5f5", text: '' }
        ]}
      ]
    }
  ];

  // 打开灯箱
  function openLightbox(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    lightboxBody.innerHTML = project.gallery.map((item, index) => `
      <div class="lightbox-item" style="background: ${item.gradient}" data-project="${projectId}" data-item="${index}">
        <span>${item.text}</span>
        <div class="lightbox-item-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    `).join('');

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // 事件委托：灯箱卡片点击
  lightboxBody.addEventListener('click', (e) => {
    const item = e.target.closest('.lightbox-item');
    if (item) {
      openDetail(parseInt(item.dataset.project), parseInt(item.dataset.item));
    }
  });

  // 关闭灯箱
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // 打开详情
  function openDetail(projectId, itemIndex) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const galleryItem = project.gallery[itemIndex];
    if (!galleryItem || !galleryItem.details) return;

    detailBody.innerHTML = galleryItem.details.map(item => {
      const urlMatch = item.gradient.match(/url\(['"]?(.+?)['"]?\)/);
      if (urlMatch) {
        const url = urlMatch[1];
        if (/\.(mp4|webm|ogg)$/i.test(url)) {
          return `<div class="detail-item"><video src="${url}" autoplay controls loop muted playsinline style="width:100%;height:100%;object-fit:contain;"></video></div>`;
        }
        return `<div class="detail-item"><img src="${url}" alt="" loading="lazy" /></div>`;
      }
      return `<div class="detail-item" style="background: ${item.gradient}"><span>${item.text}</span></div>`;
    }).join('');

    lightbox.classList.remove('active');
    detailModal.classList.add('active');
    document.getElementById('detail-body').scrollTop = 0;
  }

  // 关闭详情
  function closeDetail() {
    detailModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // 返回灯箱
  function backToLightbox() {
    detailModal.classList.remove('active');
    lightbox.classList.add('active');
  }

  // 绑定作品卡片点击
  workCards.forEach((card, index) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      openLightbox(index + 1);
    });
  });

  // 绑定关闭按钮
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-back').addEventListener('click', closeLightbox);

  // 绑定详情关闭按钮
  detailModal.querySelector('.detail-close').addEventListener('click', closeDetail);
  detailModal.querySelector('.detail-overlay').addEventListener('click', closeDetail);
  document.getElementById('detail-back').addEventListener('click', backToLightbox);

  // ESC关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (detailModal.classList.contains('active')) {
        backToLightbox();
      } else if (lightbox.classList.contains('active')) {
        closeLightbox();
      }
    }
  });
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
  // 移除加载动画
  document.body.classList.add('loaded');

  // 初始化 BorderGlow 效果
  initBorderGlow();

  // 初始化灯箱
  initLightbox();
});

// BorderGlow 边框发光效果
function initBorderGlow() {
  const cards = document.querySelectorAll('.border-glow-card');

  cards.forEach(card => {
    let ticking = false;
    card.addEventListener('pointermove', (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const edge = getEdgeProximity(card, x, y);
        const angle = getCursorAngle(card, x, y);

        card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(0)}`);
        card.style.setProperty('--cursor-angle', `${angle.toFixed(0)}deg`);
        ticking = false;
      });
    });
  });
}

function getEdgeProximity(el, x, y) {
  const { width, height } = el.getBoundingClientRect();
  const cx = width / 2;
  const cy = height / 2;
  const dx = x - cx;
  const dy = y - cy;
  let kx = Infinity;
  let ky = Infinity;
  if (dx !== 0) kx = cx / Math.abs(dx);
  if (dy !== 0) ky = cy / Math.abs(dy);
  return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
}

function getCursorAngle(el, x, y) {
  const { width, height } = el.getBoundingClientRect();
  const cx = width / 2;
  const cy = height / 2;
  const dx = x - cx;
  const dy = y - cy;
  if (dx === 0 && dy === 0) return 0;
  const radians = Math.atan2(dy, dx);
  let degrees = radians * (180 / Math.PI) + 90;
  if (degrees < 0) degrees += 360;
  return degrees;
}
