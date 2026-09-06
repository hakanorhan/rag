import sharp from "sharp";

await sharp("public/images/hero-image.png")
  .resize({ width: 1920, withoutEnlargement: true })
  .webp({ quality: 90 })
  .toFile("public/optimized/hero-image.webp");
