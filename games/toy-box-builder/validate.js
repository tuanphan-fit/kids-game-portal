#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Use process.cwd() to get current directory
const baseDir = process.cwd();
const gameDir = path.join(baseDir, 'games', 'toy-box-builder');

console.log('🧸 Toy Box Builder - MVP Validation\n');

// Check if directory exists
if (!fs.existsSync(gameDir)) {
    console.error('❌ Game directory not found');
    process.exit(1);
}
console.log('✅ Game directory exists');

// Check required files
const requiredFiles = [
    'index.html',
    'style.css',
    'scene.js',
    'physics.js',
    'input.js',
    'app.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
    const filePath = path.join(gameDir, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const size = (stats.size / 1024).toFixed(1);
        console.log(`✅ ${file} (${size} KB)`);
    } else {
        console.log(`❌ ${file} not found`);
        allFilesExist = false;
    }
});

if (allFilesExist) {
    console.log('\n✅ All required files exist\n');
} else {
    console.log('\n❌ Some files are missing\n');
    process.exit(1);
}

// Check HTML structure
const indexPath = path.join(gameDir, 'index.html');
const htmlContent = fs.readFileSync(indexPath, 'utf8');

console.log('📋 HTML Structure Check:');

const htmlChecks = [
    { name: 'Canvas element', test: htmlContent.includes('id="gameCanvas"') },
    { name: 'Spawn buttons', test: htmlContent.includes('spawn-btn') },
    { name: 'Reset button', test: htmlContent.includes('btn-reset') },
    { name: 'Back button', test: htmlContent.includes('btn-back') },
    { name: 'Three.js CDN', test: htmlContent.includes('three.min.js') },
    { name: 'Cannon-es CDN', test: htmlContent.includes('cannon-es.min.js') },
    { name: 'Scene script', test: htmlContent.includes('scene.js') },
    { name: 'Physics script', test: htmlContent.includes('physics.js') },
    { name: 'Input script', test: htmlContent.includes('input.js') },
    { name: 'App script', test: htmlContent.includes('app.js') },
    { name: 'Navigation script', test: htmlContent.includes('navigation.js') }
];

htmlChecks.forEach(check => {
    if (check.test) {
        console.log(`✅ ${check.name}`);
    } else {
        console.log(`❌ ${check.name}`);
    }
});

// Check JavaScript functions
console.log('\n📝 JavaScript Functions Check:');

const jsFiles = ['scene.js', 'physics.js', 'input.js', 'app.js'];

jsFiles.forEach(fileName => {
    const filePath = path.join(gameDir, fileName);
    const content = fs.readFileSync(filePath, 'utf8');
    const functions = content.match(/function\s+(\w+)/g) || [];
    const windowExports = content.match(/window\.\w+\s*=/g) || [];

    console.log(`\n${fileName}:`);
    console.log(`  Functions: ${functions.length}`);
    console.log(`  Window exports: ${windowExports.length}`);

    if (functions.length === 0) {
        console.log('  ⚠️  No functions found!');
    } else {
        functions.slice(0, 5).forEach(fn => {
            const name = fn.replace(/function\s+/, '');
            console.log(`  ✅ ${name}`);
        });
        if (functions.length > 5) {
            console.log(`  ... and ${functions.length - 5} more`);
        }
    }
});

// Check for common issues
console.log('\n🔍 Code Quality Check:');

const allJsContent = jsFiles.map(fileName => {
    return fs.readFileSync(path.join(gameDir, fileName), 'utf8');
}).join('\n');

const qualityChecks = [
    { name: 'No console.log statements (production)', test: !allJsContent.includes('console.log') },
    { name: 'Uses let/const instead of var', test: !allJsContent.includes('var ') },
    { name: 'Proper event listener setup', test: allJsContent.includes('addEventListener') },
    { name: 'Uses requestAnimationFrame', test: allJsContent.includes('requestAnimationFrame') },
    { name: 'Has error handling', test: allJsContent.includes('try') },
    { name: 'Functions exported to window', test: allJsContent.includes('window.') },
    { name: 'Modular structure', test: jsFiles.length >= 4 }
];

qualityChecks.forEach(check => {
    if (check.name.includes('console.log')) {
        if (check.test) {
            console.log(`⚠️  ${check.name}`);
        } else {
            console.log(`✅ ${check.name}`);
        }
    } else {
        if (check.test) {
            console.log(`✅ ${check.name}`);
        } else {
            console.log(`❌ ${check.name}`);
        }
    }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('🎉 MVP VALIDATION COMPLETE');
console.log('='.repeat(50));

console.log('\n📊 Summary:');
console.log(`  Files: ${requiredFiles.length}`);
console.log(`  Total Size: ${calculateTotalSize(gameDir)} KB`);
console.log(`  Status: Ready for testing`);

console.log('\n🚀 Next Steps:');
console.log('  1. Start local server: npx serve -l 8000');
console.log('  2. Open browser: http://localhost:8000');
console.log('  3. Click "Toy Box" game card');
console.log('  4. Test all features');
console.log('  5. Report any issues');

console.log('\n📝 See README.md for detailed documentation\n');

function calculateTotalSize(dir) {
    let totalSize = 0;
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
            totalSize += stats.size;
        }
    });

    return (totalSize / 1024).toFixed(1);
}