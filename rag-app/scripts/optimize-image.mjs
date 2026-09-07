import sharp from "sharp";

await sharp("public/images/office.png")
  .resize({ width: 1920, withoutEnlargement: true })
  .webp({ quality: 90 })
  .toFile("public/optimized/office.webp");
