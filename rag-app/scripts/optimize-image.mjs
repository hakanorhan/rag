import sharp from "sharp";

await sharp("public/images/hero-image-dark.png")
  .resize({ width: 1400, withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile("public/optimized/hero-image-dark.webp");
