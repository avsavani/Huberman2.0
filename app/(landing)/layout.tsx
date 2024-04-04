import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="bg-background flex flex-col h-screen">
          <Navbar />
          <div className="flex-1 h-screen overflow-hidden">
            {children}
          </div>
          <Footer />
      </div>
  );
}
