export interface Product {
    id: string;
    titleEn: string;
    titleFr: string;
    descriptionEn: string;
    descriptionFr: string;
    images: string[];
    featured: boolean;
}

export interface ProductsData {
    products: Record<string, Product>;
}

export interface FileLocation {
    filePath: string;
    fileName: string;
    fullName: string;
    relativePath: string;
}

export interface WrittingBatchParameter {
    filePath: string;
    fileName: string;
    content: string;
}

export interface DirectoryStructure {
    currentDir: string;
    rootDir?: string;
}