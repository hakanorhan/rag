import ResponsiveAppBar from "@/atomic-design/organisms/ResponsiveAppBar";

import Image from "next/image";

export default function Home() {
  return (
    <>
    <ResponsiveAppBar backgroundColor={"transparent"} />
    <main style={{ position:'relative', minHeight:'100vh', overflow:'hidden', marginTop: '-80px' }}>
      <Image
        src="/tesla.png"
        alt="Image"
        fill
        priority
        style={{ objectFit: "cover", zIndex: 0 }}
        />
          <div style={{ position: 'relative', zIndex: 1 }}>

          </div>
    </main>
    </>
  );
}
