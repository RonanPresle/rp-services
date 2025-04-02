import { join } from 'path';
import { readJsonFile } from './file-utils';
import { validateProductsData } from './data-validation';
import { ProductsData } from './type';

async function getProductData(): Promise<ProductsData> {
    const productsDataPath = join(__dirname, '..', 'data', 'products.json');
    const productsData: ProductsData = await readJsonFile<ProductsData>(productsDataPath);

    validateProductsData(productsData);

    return productsData;
}

export { getProductData };