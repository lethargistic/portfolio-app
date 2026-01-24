import { readdir, readFile, writeFile } from 'fs/promises';
import { join, parse } from 'path';
import { existsSync } from 'fs';

interface IconsRecord {
    [key: string]: string;
}

async function convertSvgsToJson(
    inputFolder: string,
    outputFile: string = 'icons.json'
): Promise<void> {
    try {
        const files = await readdir(inputFolder);

        const svgFiles = files.filter(file => file.toLowerCase().endsWith('.svg'));

        if (svgFiles.length === 0) {
            console.log('No SVG files found in the folder.');
            return;
        }

        const newIcons: IconsRecord = {};

        for (const file of svgFiles) {
            const filePath = join(inputFolder, file);
            let { name } = parse(file);
            name = name.replace('dot', '-');

            const svgContent = await readFile(filePath, 'utf-8');

            newIcons[name] = svgContent.trim();
        }

        if (existsSync(outputFile)) {
            const existingContent = await readFile(outputFile, 'utf-8');

            const existingKeys = new Set<string>();
            const keyMatches = existingContent.matchAll(/"([^"]+)":\s*"/g);
            for (const match of keyMatches) {
                existingKeys.add(match[1]);
            }

            const iconsToAdd: IconsRecord = {};
            const skippedIcons: string[] = [];

            for (const [key, value] of Object.entries(newIcons)) {
                if (existingKeys.has(key)) {
                    skippedIcons.push(key);
                } else {
                    iconsToAdd[key] = value;
                }
            }

            if (Object.keys(iconsToAdd).length === 0) {
                console.log('No new icons to add (all already exist)');
                if (skippedIcons.length > 0) {
                    console.log(`Skipped duplicates: ${skippedIcons.join(', ')}`);
                }
                return;
            }

            const lastBraceIndex = existingContent.lastIndexOf('}');
            const beforeClosing = existingContent.substring(0, lastBraceIndex);

            const hasExistingEntries = beforeClosing.includes('"');

            const newEntriesArray = Object.entries(iconsToAdd).map(([key, value]) =>
                `  "${key}": ${JSON.stringify(value)}`
            );

            const newEntriesString = newEntriesArray.join(',\n');

            const updatedContent = beforeClosing +
                (hasExistingEntries ? ',\n' : '') +
                newEntriesString + '\n' +
                existingContent.substring(lastBraceIndex);

            await writeFile(outputFile, updatedContent, 'utf-8');

            console.log(`Added ${Object.keys(iconsToAdd).length} new icons to ${outputFile}`);
            console.log(`New icons: ${Object.keys(iconsToAdd).join(', ')}`);
            if (skippedIcons.length > 0) {
                console.log(`Skipped duplicates: ${skippedIcons.join(', ')}`);
            }
        } else {
            const output = `const icons: Record<string, string> = ${JSON.stringify(newIcons, null, 2)};\n\nexport default icons;`;
            await writeFile(outputFile, output, 'utf-8');
            console.log(`Created ${outputFile} with ${svgFiles.length} icons`);
        }

    } catch (error) {
        console.error('Error converting SVGs:', error);
        throw error;
    }
}

const inputFolder = process.argv[2] || './svgs';
const outputFile = process.argv[3] || './icons.ts';

convertSvgsToJson(inputFolder, outputFile);