import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex">
        {children}
      </main>
      <Footer />
    </div>
  );
}