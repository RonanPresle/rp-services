import { join } from "path";
import { generateGalleryElementContent, generateSwiperSlide } from "./html-generator";
import { ProductsData, WrittingBatchParameter } from "./type";
import { getAllHtmlFiles, readFileContent, readHtmlFileDom, writeBatchToGeneratedDir, writeTextToGeneratedDir } from "./file-utils";
import { DomDynamicAnchor } from "./dom-dynamic-anchor";

function generateSwiperContent(products: ProductsData): string {
    const featuredProducts = Object.values(products.products)
        .filter(product => product.featured)
        .slice(0, 6);

    return featuredProducts.map(generateSwiperSlide).join('');
}

function generateGalleryContent(products: ProductsData): string {
    return Object.values(products.products).map(generateGalleryElementContent).join('');
}

function addSwiperContent(products: ProductsData, domContent: Document): Document {
    const newDocument = domContent.cloneNode(true) as Document;
    const featuredProducts = newDocument.getElementById(DomDynamicAnchor.SWIPPER_CONTAINER_ID);
    if (featuredProducts) {
        featuredProducts.innerHTML = generateSwiperContent(products);
    }
    return newDocument;
}

function addGalleryContent(products: ProductsData, domContent: Document): Document {
    const newDocument = domContent.cloneNode(true) as Document;
    const galleryContainer = newDocument.getElementById(DomDynamicAnchor.GALLERY_CONTAINER_ID);
    if (galleryContainer) {
        galleryContainer.innerHTML = generateGalleryContent(products);
    }
    return newDocument;
}

async function replaceAnchorByContentFromComponent(domContent: Document, filename: string, domDynamicAnchor: DomDynamicAnchor): Promise<Document> {
    const newDocument = domContent.cloneNode(true) as Document;
    const htmlTag = newDocument.getElementById(domDynamicAnchor);
    if (htmlTag) {
        const content = await readFileContent(join(__dirname, '..', 'src', 'components', filename));
        htmlTag.innerHTML = content;
    }
    return newDocument;
}

async function addHeaderAndFooter(domContent: Document): Promise<Document> {
    let newDocument = await replaceAnchorByContentFromComponent(domContent, `nav.html`, DomDynamicAnchor.NAV_PLACEHOLDER);
    newDocument = await replaceAnchorByContentFromComponent(newDocument, `footer.html`, DomDynamicAnchor.FOOTER_PLACEHOLDER);
    return newDocument;
}

async function fillDynamicContent(products: ProductsData): Promise<void> {
    const htmlFileLocations = await getAllHtmlFiles([{ currentDir: join(__dirname, '..', 'generated') }, { currentDir: join(__dirname, '..', 'src', 'main') }]);

    const filesToCreate: WrittingBatchParameter[] = await Promise.all(
        htmlFileLocations.map(async (fileLocation) => {
            let domContent = await readHtmlFileDom(fileLocation.fullName);

            domContent = addSwiperContent(products, domContent);
            domContent = addGalleryContent(products, domContent);

            domContent = await addHeaderAndFooter(domContent);

            const htmlContent = `<!DOCTYPE html>\n${domContent.documentElement.outerHTML}`;
            return {
                filePath: fileLocation.relativePath,
                fileName: fileLocation.fileName,
                content: htmlContent,
            };
        }));
    await writeBatchToGeneratedDir(filesToCreate);
}

export { fillDynamicContent };