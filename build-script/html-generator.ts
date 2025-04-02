import { Product } from './type';

function generateProductPageContent(product: Product): string {
    return `
      <div class="product-images-container">
        <div class="main-image">
          <img id="main-image" src="${product.images[0]}" alt="${product.titleEn}" />
        </div>
        <div class="thumbnail-grid" id="thumbnail-grid">
          ${product.images
            .map(
                (image, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}">
              <img src="${image}" alt="${product.titleEn} ${index + 1}" />
            </div>
          `
            )
            .join('')}
        </div>
      </div>
      <div class="product-info">
        <h1 id="product-title" data-en="${product.titleEn}" data-fr="${product.titleFr}">${product.titleEn}</h1>
        <div class="product-description">
          <p id="product-description" data-en="${product.descriptionEn}" data-fr="${product.descriptionFr}">
            ${product.descriptionEn}
          </p>
        </div>
      </div>
  `;
}

function generateGalleryElementContent(product: Product): string {
    return `
        <a href="/generated/products/${product.id}.html" class="gallery-item">
          <img src="${product.images[0]}" alt="${product.titleEn}" />
          <p data-en="${product.titleEn}" data-fr="${product.titleFr}">${product.titleEn}</p>
        </a>
      `;
}

function generateSwiperSlide(product: Product): string {
    return `
        <div class="swiper-slide">
          <a href="/generated/products/${product.id}.html" class="featured-product">
            <img src="${product.images[0]}" alt="${product.titleEn}" />
            <div class="featured-product-info">
              <h3 data-en="${product.titleEn}" data-fr="${product.titleFr}">${product.titleEn}</h3>
            </div>
          </a>
        </div>
      `;
}

export { generateProductPageContent, generateGalleryElementContent, generateSwiperSlide };