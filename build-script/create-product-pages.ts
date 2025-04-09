import { join } from 'path';
import { readHtmlFileDom, writeBatchToGeneratedDir } from './file-utils';
import { ProductsData, WrittingBatchParameter } from './type';
import { generateProductPageContent } from './html-generator';

async function generateProducts(productsData: ProductsData): Promise<void> {
    console.log(`Generating product pages. (${Object.keys(productsData.products).join(", ")} products)`);

    const productTemplatePath = join(__dirname, '..', 'templates', 'product.template.html');
    const productTemplateDom = await readHtmlFileDom(productTemplatePath);

    const fileToCreate: WrittingBatchParameter[] = [];
    for (const key of Object.keys(productsData.products)) {
        const product = productsData.products[key];
        const document = productTemplateDom.cloneNode(true) as Document;
        const productSection = document.querySelector('.product-content');

        if (productSection) {
            productSection.innerHTML = generateProductPageContent(product);
        }

        const htmlContent = `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;
        fileToCreate.push({
            filePath: 'products',
            fileName: `${product.id}.html`,
            content: htmlContent,
        });
    }

    await writeBatchToGeneratedDir(fileToCreate)
    console.log("Product pages generated successfully.");
}

export { generateProducts };