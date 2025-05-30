
'use client'
import { Header, Footer, Main } from './components/layout';
import { Toaster } from './components/ui/common/sonner';



export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between p-0 min-h-screen bg-background">
        <Header />
        <main className="flex-1 container py-8">
         <Main />
        </main>
        <Footer />
        <Toaster 
    
        position="top-center" 
        richColors
        closeButton

        />
      </div>
  );
}
