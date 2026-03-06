const path = require("path");
const fs = require("fs-extra");
const sharp = require("sharp");
const { default: pngToIco } = require("png-to-ico");
const png2icons = require("png2icons");

const sourceIcon = path.resolve(__dirname, "./icon-para-1024.png");
// const sourceIcon = path.resolve(__dirname, "./icon-256.png");
const outputDir = path.resolve(__dirname, "./icons");

const sizes = [16, 32, 48, 64, 128, 256, 512, 1024];
// const sizes = [16, 32, 48, 64, 128, 256];

async function generatePNGVariants() {
  await fs.ensureDir(outputDir);

  const generatedPNGs = [];

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-para-${size}.png`);

    await sharp(sourceIcon)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    generatedPNGs.push(outputPath);
    console.log(`✔ PNG ${size}x${size} généré`);
  }

  return generatedPNGs;
}

async function generateICO(pngPaths) {
  const icoBuffer = await pngToIco(
    pngPaths.filter(p =>
      [16, 32, 48, 256].some(size => p.includes(`-para-${size}.png`))
    )
  );

  const icoPath = path.join(outputDir, "icon-para.ico");
  await fs.writeFile(icoPath, icoBuffer);

  console.log("✔ icon.ico généré");
}

async function generateICNS() {
  const png1024 = await fs.readFile(
    path.join(outputDir, "icon-para-1024.png")
    // path.join(outputDir, "icon-256.png")
  );

  const icnsBuffer = png2icons.createICNS(
    png1024,
    png2icons.BICUBIC,
    0
  );

  const icnsPath = path.join(outputDir, "icon-para.icns");
  await fs.writeFile(icnsPath, icnsBuffer);

  console.log("✔ icon.icns généré");
}

(async () => {
  try {
    const pngPaths = await generatePNGVariants();
    await generateICO(pngPaths);
    await generateICNS();
    console.log("🎉 Toutes les icônes sont prêtes !");
  } catch (err) {
    console.error(err);
  }
})();
