import React from 'react';
import { TabletSmartphone, ExternalLink, QrCode } from 'lucide-react';
import favicon from './../images/favicon.png';
import telegram from './../images/telegram.png';
import { TextRotate } from "./ui/text-rotate";
import { LayoutGroup, motion } from "framer-motion"
import { HighlighterItem, HighlightGroup, Particles } from "../components/ui/highlighter"; // Import the Highlighter components
import { useAnimate } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { EmbeddedVideo } from "./ui/EmbeddedVideo";
import { OwnerProfile } from "./ui/OwnerProfile";
import { SiteOffers } from "./ui/SiteOffers";
import Testimonials from "./ui/Testimonials";
import { References } from "./ui/References";

const IntroPage: React.FC = () => {

  const navigate = useNavigate();

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
      <div className="fixed top-4 right-4 z-50" dir="rtl">
        <div className="group relative">
          <div 
            className="flex items-top text-gray-800 rounded-lg hover:shadow-lg hover:bg-white hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="p-3">
              <QrCode className="w-7 h-7 animate-pulse" />
            </div>
            <div className="max-w-0 group-hover:max-w-xs group-hover:max-h-xs transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap">
              <img
                src={telegram} // Use the imported image
                alt="Telegram"
                className="w-32 h-32 md:w-32 md:h-32 rounded-lg transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
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
              <span className="text-green-800">أخر تحديث 01 جويلية 2025 - 🎉 إضافة مقارنة النتائج</span>
            </div>
          </a>

          {/* Hero Picture or Logo (Top) */}
          
          <div className="w-full flex justify-center mb-8">
            <img
              src={favicon} // Use the imported image
              alt="Al Wajeez Logo"
              className="w-32 h-32 md:w-32 md:h-32 rounded-lg transition-transform duration-500 hover:scale-110 hover:rotate-12" style={{zIndex:11}}
            />
          </div>

          {/* Hero Content (Centered) */}
          <div className="w-full text-center">
            
            {/* TrueFocus Component */}
            <div className="relative flex gap-4 text-6xl font-bold justify-center items-center flex-wrap text-gray-800 bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text">
              <LayoutGroup>
                <motion.p className="flex flex-col xl:flex-row whitespace-pre" layout>
                  <motion.span
                      className="pt-0.5 sm:pt-4 md:pt-4 xl:pt-4"
                      layout
                      transition={{ type: "spring", damping: 40, stiffness: 500 }}
                    >
                      تحليل نتائج شهادة{" "}
                  </motion.span>
                  <TextRotate
                    texts={[
                      "التعليم المتوسط",
                      "البكالوريا",
                    ]}
                    mainClassName="text-white px-2 bg-gray-800 overflow-hidden py-0.5 sm:py-3.5 md:py-3 sm:px-3 md:px-3.5 lg:px-3.5 sm:mt-6 md:mt-6 xl:mt-2 justify-center rounded-lg"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-3 md:pb-4"
                    transition={{ type: "spring", damping: 40, stiffness: 500 }}
                    rotationInterval={2000}
                  />
                </motion.p>
              </LayoutGroup>
            </div>
            <p className="text-lg sm:text-xl text-gray-800 mb-8 mt-8">
              مرحبًا بك في موقع الوجيز، رفيقك الذكي لتحليل نتائج شهادة التعليم المتوسط وشهادة البكالوريا!
            </p>
            <p className="text-sm sm:text-sm text-gray-800 mb-8 mt-8">
              هنا تتحول الأرقام إلى رؤى، وتصبح النتائج حكاية نجاح مشوّقة!
            </p>
            
            <div className="flex flex-col md:flex-row justify-center space-x-4">
              <button
                onClick={() => navigate('/tcl')}
                disabled
                title="قيد الإنشاء"
                className="flex items-center px-6 py-3 bg-gray-200 text-gray-600 rounded-lg shadow-md hover:bg-gray-200 transition duration-300 ml-4 mt-2 mb-2 cursor-not-allowed opacity-50" style={{zIndex:11}}
              >
                <TabletSmartphone className="w-5 h-5 ml-2" />
                شهادة البكالوريا
                
            
              </button>

              <button
                onClick={() => navigate('/tcs')}
                className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ml-4 mt-2 mb-2" style={{zIndex:11}}
              >
                <TabletSmartphone className="w-5 h-5 ml-2" />
                شهادة التعليم المتوسط
              </button>

              <button
                onClick={() => handleRedirect('https://al-wajeez.vercel.app/')} // Replace with your URL
                className="flex items-center px-6 py-3 bg-gray-600 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition duration-300 mt-2 mb-2" style={{zIndex:11}}
              >
                <ExternalLink className="w-5 h-5 ml-2" />
                الموقع الرسمي
              </button>
            </div>
          
          </div>
        </div>
        
      </main>

      {/* New Sections Start */}
      <div className="space-y-16 mt-8">
        {/* Embedded YouTube Video Section */}
        <EmbeddedVideo />
        {/* Site Owner Profile Section */}
        <OwnerProfile />
        {/* What the Site Offers Section */}
        <motion.div className="items-center justify-center max-w-5xl mx-auto">
          <div className="top-0 left-0">
            <motion.h2 className="text-3xl text-gray-800 font-bold mb-6 text-center">خدمات تحليلية متكاملة في متناول يدك</motion.h2>
            <motion.p className='text-ms text-gray-800 max-lg:px-8 mb-6 text-center'>موقعنا يقدم لك تحليلًا دقيقًا للنتائج مع إمكانية مقارنة البيانات عبر رسوم بيانية احترافية. احصل على تقارير بيداغوجية تساعدك على فهم أعمق للأداء، كل ذلك في واجهة تفاعلية سهلة الاستخدام. والأفضل من ذلك، خدماتنا مجانية تمامًا، مع دقة عالية وتحليل يتم في ثوانٍ معدودة.</motion.p>
            <SiteOffers />
          </div>
        </motion.div>
        {/* Testimonials Section */}
        <Testimonials />
        {/* References Section */}
        <section className="my-24 px-4 md:px-10">
          <div className="flex flex-col items-center justify-center max-w-5xl mx-auto"  style={{zIndex:11}}>
            <h2 className="text-3xl text-gray-800 font-bold mb-6 text-center">المراجع والمصادر</h2>
            <p className="text-ms text-gray-800 mb-6 text-center">تم تطوير هذا الموقع استناداً إلى المراجع والمقررات وكذا المناشير الرسمية الصادرة عن وزارة التربية والتعليم الوطني، بهدف توفير محتوى تعليمي موثوق يتماشى مع التوجيهات والمناهج المعتمدة.</p>
            <References
              title="المنشور الوزاري | 1474"
              description="المؤرخ في 14 سبتمبر 2021 بخصوص ترتيبات إعادة إدماج التلاميذ."
              variant="plus" // or "gradient", "plus", etc.
              className="max-w-[1000px] bg-white mb-4 mb-4"
            />

            <References
              title="المنشور الوزاري | 192"
              description="المؤرخ في 09 جويلية 2007 المتضمن دراسة نتائج الامتحانات الرسمية في النظام التربوي."
              variant="plus" // or "gradient", "plus", etc.
              className="max-w-[1000px] bg-white mb-4"
            />

            <References
              title="المنشور الوزاري | 618"
              description="المؤرخ في 18 أفريل 2022 بخصوص استحداث شعبة فنون في مرحلة التعليم الثانوي العام."
              variant="plus" // or "gradient", "plus", etc.
              className="max-w-[1000px] bg-white mb-4"
            />

            <References
              title="المنشور الوزاري | 48"
              description="المؤرخ في 13 فبراير 2008 خاص بتوجيه تلاميذ الاولى ثانوي الى شعب الثانية ثانوي."
              variant="plus" // or "gradient", "plus", etc.
              className="max-w-[1000px] bg-white mb-4"
            />

            <References
              title="المنشور الوزاري | 49"
              description="المؤرخ في 15 فيفري 2008 خاص بتوجيه تلاميذ الرابعة متوسط الى الجذعين المشتركين."
              variant="plus" // or "gradient", "plus", etc.
              className="max-w-[1000px] bg-white mb-4"
            />

            <References
              title="القرار الوزاري | 37"
              description="المؤرخ في 14 أفريل 2022 بخصوص تحديد شعب التعليم الثانوي العام والتكنولوجي."
              variant="plus" // or "gradient", "plus", etc.
              className="max-w-[1000px] bg-white mb-4"
            />

            <References
              title="القرار الوزاري | 827"
              description="الذي يحدد مهام المستشارين والمستشارين الرئيسيين في التوجيه المدرسي والمهني ونشاطاتهم في المؤسسات التعليمية."
              variant="plus" // or "gradient", "plus", etc.
              className="max-w-[1000px] bg-white mb-4"
            />

            <References
              title="المادة | 12"
              description="من القانون التوجيهي للتربية الوطنية رقم 08-04 المؤرخ في 23 جانفي 2008."
              variant="plus" // or "gradient", "plus", etc.
              className="max-w-[1000px] bg-white mb-4"
            />

            <References
              title="موقع"
              description="وزارة التربية الوطنية. | https://www.education.gov.dz"
              variant="plus" // or "gradient", "plus", etc.
              className="max-w-[1000px] bg-white mb-4"
            />  
          </div>
        </section>
      </div>
      {/* New Sections End */}

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