// Language switching functionality
let currentLang = localStorage.getItem('preferredLanguage') || 'fr';

async function loadComponents() {
  // After loading components, update active menu item and apply language
  updateActiveMenuItem();
  switchLanguage(currentLang, false);
  setupLanguageButtons();
}

function updateActiveMenuItem() {
  const currentPath = window.location.pathname;
  const menuItems = document.querySelectorAll('.menu a');

  menuItems.forEach(item => {
    if (item.getAttribute('href') === currentPath) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function setupLanguageButtons() {
  const langButtons = document.querySelectorAll('.lang-btn');

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
  });
}

function switchLanguage(lang, save = true) {
  currentLang = lang;
  if (save) {
    localStorage.setItem('preferredLanguage', lang);
  }

  document.documentElement.lang = lang;

  // Update active button state
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update all translatable elements
  document.querySelectorAll('[data-en][data-fr]').forEach(element => {
    element.textContent = element.dataset[lang];
  });
}

// Initialize Swiper on homepage
async function initializeHomeSwiper() {
  const swiperContainer = document.getElementById('swiper-container');
  if (swiperContainer) {
    try {
      new Swiper('.swiper', {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 30,
        loop: true,
        effect: 'coverflow',
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
      });
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  }
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');

    // Disable submit button during submission
    submitButton.disabled = true;

    try {
      const formData = {};
      const inputs = contactForm.querySelectorAll('input, textarea', 'select');
      inputs.forEach((input) => {
        if (input.name) {
          formData[input.name] = input.value;
        }
      });
      console.log('Form data:', JSON.stringify(formData));
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        const formStatus = document.getElementById('form-status-success');
        formStatus.className = 'form-status success visible';
        contactForm.reset();
      } else {
        console.log('Error:', data);
        throw new Error(data.message);
      }
    } catch (error) {
      console.log('Error:', error);
      const formStatus = document.getElementById('form-status-error');
      formStatus.className = 'form-status error visible';
    } finally {
      submitButton.disabled = false;
    }
  });
}

const productContentElement = document.getElementById('product-content');
if(productContentElement) {
  try {

    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail'); // Select all thumbnail divs

    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener('click', () => {
        const img = thumbnail.querySelector('img'); // Find the <img> inside the thumbnail div
        if (img) {
          console.log('Thumbnail clicked:', img.src);
          mainImage.src = img.src; // Set the main image's src to the thumbnail's img src

          // Update the active class
          document.querySelectorAll('.thumbnail').forEach((thumb) => thumb.classList.remove('active'));
          thumbnail.classList.add('active'); // Add 'active' to the clicked thumbnail div
        }
      });
    });
    
  } catch (error) {
    console.error('Error loading product details:', error);
  }
}

// Initialize components and features
document.addEventListener('DOMContentLoaded', async () => {
  await loadComponents();
  await initializeHomeSwiper();
});