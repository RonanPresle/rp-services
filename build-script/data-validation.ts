import { ProductsData } from './type';

function validateProductsData(productsData: ProductsData): void {
    const ids = new Set<string>();

    for (const key in productsData.products) {
        const product = productsData.products[key];
        if (ids.has(product.id)) {
            throw new Error(`Duplicate product ID found: ${product.id}`);
        }
        ids.add(product.id);
    }

    console.log("ProductsData validation passed.");
}

export { validateProductsData };
