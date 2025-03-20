import React from 'react';
import { TabletSmartphone, ExternalLink } from 'lucide-react';
import favicon from '../images/favicon.png'; // Import the image
import { TrueFocus } from "../components/ui/true-focus"; // Import the TrueFocus component
import { HighlighterItem, HighlightGroup, Particles } from "../components/ui/highlighter"; // Import the Highlighter components
import { useAnimate } from "framer-motion";

interface IntroPageProps {
  setShowIntro: (show: boolean) => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ setShowIntro }) => {

  const [scope, animate] = useAnimate();

  React.useEffect(() => {
    animate(
      [
        ["#pointer", { left: 200, top: 60 }, { duration: 0 }],
        ["#javascript", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 50, top: 102 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#javascript", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#react-js", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 224, top: 170 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#react-js", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#typescript", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 88, top: 198 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#typescript", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#next-js", { opacity: 1 }, { duration: 0.3 }],
        [
          "#pointer",
          { left: 200, top: 60 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#next-js", { opacity: 0.5 }, { at: "-0.3", duration: 0.1 }],
      ],
      {
        repeat: Number.POSITIVE_INFINITY,
      },
    );
  }, [animate]);

  // Function to handle button click and redirect
  const handleRedirect = (url: string) => {
    window.location.href = url;
  };

  return (
  
    <div className="min-h-screen bg-gray-50 text-white" dir="rtl">
      <HighlightGroup>
      <HighlighterItem>
      {/* Main Content */}
      <main className="pt-20" ref={scope}>
        
          <Particles
            className="absolute inset-0 z-10 opacity-100 transition-opacity duration-1000 ease-in-out group-hover:opacity-100 pointer-events-none"
            quantity={400}
            color={"#555555"}
            vy={-0.2}
          />

        {/* Hero Section */}
        <div className="container mx-auto px-12 py-2 flex flex-col items-center">
          <a href="/">
            <div className="inline-flex items-center rounded-full border px-2.5 py-2 mb-4 text-xs transition-colors focus:outline-green focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-200">
              <span className="text-green-800">أخر تحديث 15 مارس 2025 - 🎉 إضافة التحليل الشامل</span>
            </div>
          </a>

          {/* Hero Picture or Logo (Top) */}
          
          <div className="w-full flex justify-center mb-8">
            <img
              src={favicon} // Use the imported image
              alt="Hero Image"
              className="w-32 h-32 md:w-32 md:h-32 rounded-lg transition-transform duration-500 hover:scale-110 hover:rotate-12"
            />
          </div>

          {/* Hero Content (Centered) */}
          <div className="w-full text-center">
            
            {/* TrueFocus Component */}
            <div className="container mx-auto px-2 py-2 mb-4">
              <TrueFocus
                sentence="استبيان الميول والاهتمامات"
                manualMode={false}
                blurAmount={5}
                borderColor="red"
                animationDuration={2}
                pauseBetweenAnimations={1}
              />
            </div>
            <p className="text-lg sm:text-xl text-gray-800 mb-8">
              مرحبًا بك في موقع الوجيز لتحليل استبيان الميول والاهتمامات!
            </p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowIntro(false)}
                className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ml-4" style={{zIndex:11}}
              >
                <TabletSmartphone className="w-5 h-5 ml-2" />
                الدخول إلى الموقع
              </button>

              <button
                onClick={() => handleRedirect('https://al-wajeez.vercel.app/')} // Replace with your URL
                className="flex items-center px-6 py-3 bg-gray-600 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition duration-300" style={{zIndex:11}}
              >
                <ExternalLink className="w-5 h-5 ml-2" />
                الموقع الرسمي
              </button>
            </div>
            
            <div className="relative w-full pt-12 px-4 sm:px-6 lg:px-8">
              <div className="flex relative z-10 overflow-hidden border rounded-md shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] border-brand/10 dark:border-brand/5">
                <img
                  alt="AI Platform Dashboard"
                  width="1248"
                  height="765"
                  className="w-full h-auto transition-transform duration-300 hover:scale-104"
                  loading="lazy"
                  decoding="async"
                  src="https://www.launchuicomponents.com/app-light.png"
                />
              </div>
            </div>
          </div>
        </div>
        
      </main>

      {/* Footer Section */}
      <footer className="py-10 px-4 text-center">
        <p className="text-gray-600">برمجة حدادي عبد الرؤوف - جميع الحقوق محفوظة 2025.</p>
      </footer>
      </HighlighterItem>
      </HighlightGroup>
    </div>
    
    
            
  );
};

export default IntroPage;