import fs from 'fs';

const filePath = process.argv[2] || './Icon.svelte';
const fileContent = fs.readFileSync(filePath, 'utf8');

const icons: Record<string, string> = {};
const iconList = [];

const firstIfRegex = /\{#if name === ['"]([^'"]+)['"]\}([\s\S]*?)(?=\{:else if name)/;
const firstMatch = fileContent.match(firstIfRegex);
if (firstMatch) {
    const iconName = firstMatch[1];
    let svgContent = firstMatch[2].trim();

    const svgMatch = svgContent.match(/(<svg[\s\S]*?<\/svg>)/);
    if (svgMatch) {
        iconList.push({ name: iconName, svg: svgMatch[1] });
    }
}

const regex = /\{:else if name === ['"]([^'"]+)['"]\}([\s\S]*?)(?=\{:else if name|{:else}|{\/if})/g;

let match;
while ((match = regex.exec(fileContent)) !== null) {
    const iconName = match[1];
    let svgContent = match[2].trim();

    const svgMatch = svgContent.match(/(<svg[\s\S]*?<\/svg>)/);
    if (svgMatch) {
        iconList.push({ name: iconName, svg: svgMatch[1] });
    }
}

iconList.forEach(icon => {
    icons[icon.name] = icon.svg;
});

const elseRegex = /\{:else\}([\s\S]*?)(?=<\/div>)/;
const elseMatch = fileContent.match(elseRegex);
if (elseMatch) {
    let svgContent = elseMatch[1].trim();
    const svgMatch = svgContent.match(/(<svg[\s\S]*?<\/svg>)/);
    if (svgMatch) {
        icons['fallback'] = svgMatch[1];
    }
}

const outputPath = 'icons.json';
fs.writeFileSync(outputPath, JSON.stringify(icons, null, 2), 'utf8');

console.log(`Parsed ${Object.keys(icons).length} icons`);
console.log(`Output written to ${outputPath}`);
console.log(`\nIcon names found: ${Object.keys(icons).join(', ')}`);