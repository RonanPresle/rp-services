import { fillDynamicContent } from './create-dynamic-content';
import { generateProducts as generateProductPages } from './create-product-pages';
import { getProductData } from './data-management';
import { clearGeneratedDir } from './file-utils';


async function main() {
    try {
        const productsData = await getProductData();

        await clearGeneratedDir();

        await generateProductPages(productsData);

        await fillDynamicContent(productsData);

    } catch (error) {
        console.error("Error generating product pages:", error);
    }
}


main();