import "./globals.css";
import "../styles/gradients.css";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Hello Vote",
  description: "Nowoczesny DApp do anonimowego głosowania",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-gradient-3d text-white font-sans">
        <Header />
        <main className="flex flex-col md:flex-row gap-6 p-6 md:p-12">
          {children}
        </main>
      </body>
    </html>
  );
}
