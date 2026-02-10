/**
 * App Icon Generator Script
 * Generates all Android & iOS app icon sizes from the SVG logo.
 *
 * Usage: node scripts/generate-icons.js
 * Requires: npm install --save-dev sharp
 */

const fs = require('fs');
const path = require('path');

async function generateIcons() {
    const sharp = require('sharp');

    const SVG_PATH = path.resolve(__dirname, '../src/assets/logo/logo-icon.svg');
    const ANDROID_RES = path.resolve(__dirname, '../android/app/src/main/res');
    const IOS_APPICONSET = path.resolve(
        __dirname,
        '../ios/KiranaMitra/Images.xcassets/AppIcon.appiconset',
    );

    // Read SVG and render at high resolution first
    const svgBuffer = fs.readFileSync(SVG_PATH);

    // Add a white background to the SVG for the icon
    const svgString = svgBuffer.toString();
    const svgWithBg = svgString.replace(
        '<svg ',
        '<svg style="background-color: #FFFFFF" ',
    );

    // Create a base 1024x1024 PNG with white background + padding
    const basePng = await sharp(Buffer.from(svgWithBg))
        .resize(1024, 1024, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .png()
        .toBuffer();

    console.log('✓ Base 1024x1024 icon created');

    // ──── ANDROID ────
    const androidSizes = [
        { folder: 'mipmap-mdpi', size: 48 },
        { folder: 'mipmap-hdpi', size: 72 },
        { folder: 'mipmap-xhdpi', size: 96 },
        { folder: 'mipmap-xxhdpi', size: 144 },
        { folder: 'mipmap-xxxhdpi', size: 192 },
    ];

    for (const { folder, size } of androidSizes) {
        const dir = path.join(ANDROID_RES, folder);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        // Square icon
        await sharp(basePng)
            .resize(size, size)
            .png()
            .toFile(path.join(dir, 'ic_launcher.png'));

        // Round icon (circular mask)
        const roundMask = Buffer.from(
            `<svg width="${size}" height="${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
      </svg>`,
        );

        await sharp(basePng)
            .resize(size, size)
            .composite([{ input: roundMask, blend: 'dest-in' }])
            .png()
            .toFile(path.join(dir, 'ic_launcher_round.png'));

        console.log(`✓ Android ${folder}: ${size}x${size}`);
    }

    // ──── iOS ────
    if (!fs.existsSync(IOS_APPICONSET))
        fs.mkdirSync(IOS_APPICONSET, { recursive: true });

    const iosSizes = [
        { name: 'icon-20@2x.png', size: 40, idiom: 'iphone', scale: '2x', sizeStr: '20x20' },
        { name: 'icon-20@3x.png', size: 60, idiom: 'iphone', scale: '3x', sizeStr: '20x20' },
        { name: 'icon-29@2x.png', size: 58, idiom: 'iphone', scale: '2x', sizeStr: '29x29' },
        { name: 'icon-29@3x.png', size: 87, idiom: 'iphone', scale: '3x', sizeStr: '29x29' },
        { name: 'icon-40@2x.png', size: 80, idiom: 'iphone', scale: '2x', sizeStr: '40x40' },
        { name: 'icon-40@3x.png', size: 120, idiom: 'iphone', scale: '3x', sizeStr: '40x40' },
        { name: 'icon-60@2x.png', size: 120, idiom: 'iphone', scale: '2x', sizeStr: '60x60' },
        { name: 'icon-60@3x.png', size: 180, idiom: 'iphone', scale: '3x', sizeStr: '60x60' },
        { name: 'icon-1024.png', size: 1024, idiom: 'ios-marketing', scale: '1x', sizeStr: '1024x1024' },
    ];

    for (const { name, size } of iosSizes) {
        await sharp(basePng)
            .resize(size, size)
            .png()
            .toFile(path.join(IOS_APPICONSET, name));
        console.log(`✓ iOS ${name}: ${size}x${size}`);
    }

    // Write Contents.json for iOS
    const contentsJson = {
        images: iosSizes.map(({ name, idiom, scale, sizeStr }) => ({
            filename: name,
            idiom,
            scale,
            size: sizeStr,
        })),
        info: { author: 'xcode', version: 1 },
    };

    fs.writeFileSync(
        path.join(IOS_APPICONSET, 'Contents.json'),
        JSON.stringify(contentsJson, null, 2),
    );
    console.log('✓ iOS Contents.json updated');

    // Save 1024 base icon for reference
    const logoDir = path.resolve(__dirname, '../logo');
    await sharp(basePng).toFile(path.join(logoDir, 'app-icon-1024.png'));
    console.log('✓ Saved logo/app-icon-1024.png');

    console.log('\n🎉 All app icons generated successfully!');
}

generateIcons().catch(err => {
    console.error('Error generating icons:', err);
    process.exit(1);
});
