import "@/app/page.module.css";
import Image from "next/image";

export default function Home() {
  return (
    <main style={{ position:'relative', minHeight:'100vh', overflow:'hidden' }}>
      <Image
        src="/tesla.png"
        alt="Image"
        fill
        priority
        style={{ objectFit: "cover", zIndex: 0 }}
        />
          <div style={{ position: 'relative', zIndex: 1 }}></div>
    </main>
  );
}
