// Juice Carousel JavaScript

class JuiceCarousel {
  constructor() {
    this.init();
  }

  init() {
    this.initSwiper();
    this.initVideoControls();
    this.initDesktopHover();
    this.initDoubleTap();
    this.initKeyboardNavigation();
  }

  initSwiper() {
    this.swiper = new Swiper('.juice-carousel__mobile', {
      direction: 'vertical',
      slidesPerView: 1,
      spaceBetween: 0,
      mousewheel: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        type: 'bullets',
      },
      on: {
        slideChange: () => {
          this.handleSlideChange();
        },
        touchStart: () => {
          this.handleTouchStart();
        },
      },
    });
  }

  initVideoControls() {
    const videos = document.querySelectorAll('.juice-slide__video, .juice-card__video');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Handle autoplay restrictions
              console.log('Autoplay prevented');
            });
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    videos.forEach((video) => {
      observer.observe(video);
    });
  }

  initDesktopHover() {
    const cards = document.querySelectorAll('.juice-card');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const video = card.querySelector('.juice-card__video');
        if (video) {
          video.play().catch(() => {
            console.log('Autoplay prevented');
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        const video = card.querySelector('.juice-card__video');
        if (video) {
          video.pause();
        }
      });
    });
  }

  initDoubleTap() {
    let lastTap = 0;
    const slides = document.querySelectorAll('.juice-slide');

    slides.forEach((slide) => {
      slide.addEventListener('click', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;

        if (tapLength < 300 && tapLength > 0) {
          // Double tap detected
          this.handleDoubleTap(slide);
        }

        lastTap = currentTime;
      });
    });
  }

  handleDoubleTap(slide) {
    const heart = document.createElement('div');
    heart.className = 'juice-heart';
    heart.innerHTML = '❤️';
    heart.style.position = 'absolute';
    heart.style.left = '50%';
    heart.style.top = '50%';
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.fontSize = '5rem';
    heart.style.animation = 'heartBeat 0.5s ease-out';
    heart.style.zIndex = '1000';

    slide.appendChild(heart);

    // Remove heart after animation
    setTimeout(() => {
      heart.remove();
    }, 500);
  }

  initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (window.innerWidth >= 768) {
        const cards = document.querySelectorAll('.juice-card');
        const activeCard = document.activeElement;
        const currentIndex = Array.from(cards).indexOf(activeCard);

        switch (e.key) {
          case 'ArrowRight':
            if (currentIndex < cards.length - 1) {
              cards[currentIndex + 1].focus();
            }
            break;
          case 'ArrowLeft':
            if (currentIndex > 0) {
              cards[currentIndex - 1].focus();
            }
            break;
          case 'ArrowUp':
            if (currentIndex >= 4) {
              cards[currentIndex - 4].focus();
            }
            break;
          case 'ArrowDown':
            if (currentIndex < cards.length - 4) {
              cards[currentIndex + 4].focus();
            }
            break;
        }
      }
    });
  }

  handleSlideChange() {
    const activeSlide = this.swiper.slides[this.swiper.activeIndex];
    const video = activeSlide.querySelector('.juice-slide__video');
    
    if (video) {
      video.play().catch(() => {
        console.log('Autoplay prevented');
      });
    }
  }

  handleTouchStart() {
    // Add haptic feedback if supported
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new JuiceCarousel();
});

// Add heart beat animation
const style = document.createElement('style');
style.textContent = `
  @keyframes heartBeat {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
  }
`;
document.head.appendChild(style); 