import sharp from "sharp";

await sharp("public/images/rentcars/premium-cabrio.png")
  .resize({ width: 400, withoutEnlargement: true })
  .webp({ quality: 90 })
  .toFile("public/optimized/rentcars/premium-cabrio.webp");
