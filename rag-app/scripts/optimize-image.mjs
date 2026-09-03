import sharp from "sharp";

await sharp("public/images/futuristic.png")
  .resize({ width: 1920, withoutEnlargement: true })
  .webp({ quality: 20 })
  .toFile("public/optimized/futuristic.webp");
