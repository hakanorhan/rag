import sharp from "sharp";

await sharp("public/news.png")
  .resize({ width: 1920, withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile("public/optimized/news.webp");
