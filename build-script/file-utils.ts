import { readFile, mkdir, writeFile } from 'fs';
import path, { join } from 'path';
import { JSDOM } from 'jsdom';
import { readdir } from 'fs';
import { DirectoryStructure, FileLocation, WrittingBatchParameter } from './type';
import { rm } from 'fs';

function getGeneratedDir(): string {
    const generatedDir = join(__dirname, '..', 'generated');
    return generatedDir;
}

async function readJsonFile<T = any>(filePath: string): Promise<T> {
    return new Promise((resolve, reject) => {
        readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            try {
                const json = JSON.parse(data) as T;
                resolve(json);
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
}

async function readHtmlFileDom(filePath: string): Promise<Document> {
    return new Promise((resolve, reject) => {
        readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            try {
                const dom = new JSDOM(data);
                resolve(dom.window.document);
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
}

async function writeTextToGeneratedDir(path: string, fileName: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const generatedDir = getGeneratedDir();
        const filePath = join(generatedDir, path, fileName);

        mkdir(generatedDir, { recursive: true }, (err) => {
            if (err) {
                return reject(err);
            }

            writeFile(filePath, content, 'utf8', (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

async function writeBatchToGeneratedDir(writtingBatchParameter: WrittingBatchParameter[]): Promise<void> {
    for (const { filePath: dirPath, fileName, content } of writtingBatchParameter) {
        const fullDirPath = join(getGeneratedDir(), dirPath);

        await new Promise<void>((resolve, reject) => {
            mkdir(fullDirPath, { recursive: true }, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });

        const filePath = join(fullDirPath, fileName);

        await new Promise<void>((resolve, reject) => {
            writeFile(filePath, content, 'utf8', (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}

async function getAllHtmlFiles(dirs: DirectoryStructure[]): Promise<FileLocation[]> {
    const htmlFiles: FileLocation[] = [];

    for (const dir of dirs) {
        const rootDir = dir.rootDir ?? dir.currentDir;
        const files = await new Promise<import('fs').Dirent[]>((resolve, reject) => {
            readdir(dir.currentDir, { withFileTypes: true }, (err, files) => {
                if (err) {
                    return reject(err);
                }
                resolve(files);
            });
        });

        for (const file of files) {
            const fullPath = join(dir.currentDir, file.name);
            if (file.isDirectory()) {
                const nestedHtmlFiles = await getAllHtmlFiles([{currentDir: fullPath, rootDir}]);
                htmlFiles.push(...nestedHtmlFiles);
            } else if (file.isFile() && file.name.endsWith('.html')) {
                htmlFiles.push({
                    filePath: dir.currentDir,
                    fileName: file.name,
                    fullName: fullPath,
                    relativePath: path.relative(rootDir, dir.currentDir),
                });
            }
        }
    }

    return htmlFiles;
}

async function readFileContent(fullPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        readFile(fullPath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}

async function clearGeneratedDir(): Promise<void> {
    return new Promise((resolve, reject) => {
        const generatedDir = getGeneratedDir();
        rm(generatedDir, { recursive: true, force: true }, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

export { readJsonFile, readHtmlFileDom, writeTextToGeneratedDir, writeBatchToGeneratedDir, getAllHtmlFiles, readFileContent, clearGeneratedDir };