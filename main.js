// Import styles
import './style.css';

// Language switching functionality
let currentLang = localStorage.getItem('preferredLanguage') || 'fr';

async function loadComponents() {
  const headerResponse = await fetch('./components/header.html');
  const footerResponse = await fetch('./components/footer.html');
  
  const headerHtml = await headerResponse.text();
  const footerHtml = await footerResponse.text();
  
  document.getElementById('header-placeholder').innerHTML = headerHtml;
  document.getElementById('footer-placeholder').innerHTML = footerHtml;
  
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

  // Update product details if on product page
  if (window.location.pathname.includes('product.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
      updateProductContent(productId, lang);
    }
  }
}

// Initialize Swiper on homepage
async function initializeHomeSwiper() {
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    try {
      const response = await fetch('/data/products.json');
      const data = await response.json();
      const featuredProducts = document.getElementById('featured-products');
      
      Object.values(data.products).filter((product)=>product.featured).slice(0, 6).forEach(product => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        
        slide.innerHTML = `
          <a href="./product.html?id=${product.id}" class="featured-product">
            <img src="${product.images[0]}" alt="${product.titleEn}" />
            <div class="featured-product-info">
              <h3 data-en="${product.titleEn}" data-fr="${product.titleFr}">${product.titleEn}</h3>
            </div>
          </a>
        `;
        
        featuredProducts.appendChild(slide);
      });

      new Swiper('.featured-swiper', {
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

      // Update the language for the newly added content
      switchLanguage(currentLang, false);
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  }
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  // Set the access key from environment variable
  document.getElementById('access-key').value = process.env.WEB3FORM_ACCESS_KEY;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formStatus = document.getElementById('form-status');
    
    // Disable submit button during submission
    submitButton.disabled = true;
    
    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        formStatus.textContent = currentLang === 'en' ? 
          'Thank you for your message. We will contact you soon!' : 
          'Merci pour votre message. Nous vous contacterons bientôt !';
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      formStatus.textContent = currentLang === 'en' ? 
        'There was an error sending your message. Please try again.' : 
        'Une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer.';
      formStatus.className = 'form-status error';
    } finally {
      submitButton.disabled = false;
    }
  });
}

// Gallery page functionality
const galleryGrid = document.getElementById('gallery-grid');
if (galleryGrid) {
  loadGallery();
}

async function loadGallery() {
  try {
    const response = await fetch('/data/products.json');
    const data = await response.json();
    const galleryGrid = document.getElementById('gallery-grid');
    
    Object.values(data.products).forEach(product => {
      const item = document.createElement('a');
      item.href = `/product.html?id=${product.id}`;
      item.className = 'gallery-item';
      
      item.innerHTML = `
        <img src="${product.images[0]}" alt="${product.titleEn}" />
        <p data-en="${product.titleEn}" data-fr="${product.titleFr}">${product.titleEn}</p>
      `;
      
      galleryGrid.appendChild(item);
    });

    // Update the language for the newly added content
    switchLanguage(currentLang, false);
  } catch (error) {
    console.error('Error loading gallery:', error);
  }
}

// Product page functionality
if (window.location.pathname.includes('product.html')) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (productId) {
    loadProductDetails(productId);
  }
}

let currentProductId = null;

async function loadProductDetails(productId) {
  try {
    const response = await fetch('/data/products.json');
    const data = await response.json();
    const product = data.products[productId];
    
    if (!product) {
      console.error('Product not found');
      return;
    }

    currentProductId = productId;
    updateProductContent(productId, currentLang);

    // Set up image gallery
    const mainImage = document.getElementById('main-image');
    const thumbnailGrid = document.getElementById('thumbnail-grid');
    
    mainImage.src = product.images[0];
    mainImage.alt = product.titleEn;

    thumbnailGrid.innerHTML = '';
    product.images.forEach((image, index) => {
      const thumbnail = document.createElement('div');
      thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
      thumbnail.innerHTML = `<img src="${image}" alt="${product.titleEn} ${index + 1}" />`;
      
      thumbnail.addEventListener('click', () => {
        mainImage.src = image;
        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
        thumbnail.classList.add('active');
      });
      
      thumbnailGrid.appendChild(thumbnail);
    });
  } catch (error) {
    console.error('Error loading product details:', error);
  }
}

function updateProductContent(productId, lang) {
  fetch('/data/products.json')
    .then(response => response.json())
    .then(data => {
      const product = data.products[productId];
      if (!product) return;

      document.getElementById('product-title').textContent = 
        lang === 'en' ? product.titleEn : product.titleFr;
      document.getElementById('product-description').textContent = 
        lang === 'en' ? product.descriptionEn : product.descriptionFr;
    })
    .catch(error => console.error('Error updating product content:', error));
}

// Initialize components and features
document.addEventListener('DOMContentLoaded', async () => {
  await loadComponents();
  await initializeHomeSwiper();
});