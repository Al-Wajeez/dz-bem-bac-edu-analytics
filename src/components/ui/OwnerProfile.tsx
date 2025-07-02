import React, { useState } from "react";
import { motion } from "framer-motion";


const HeroSection: React.FC = () => {
  return (
    <motion.section className="w-full flex flex-col items-center text-center gap-6">
      <div className="relative mb-2">
        <span className="absolute inset-0 rounded-full opacity-60 blur-lg animate-glow" />
        <img
          src="https://api.dicebear.com/8.x/lorelei-neutral/svg?seed=John"
          alt="avatar"
          className="relative size-32 rounded-full border-4 border-zinc-800 shadow-xl z-10"
        />
      </div>
      <h1 className="text-3xl text-gray-800 font-extrabold leading-tight tracking-tight drop-shadow-lg">
        حدادي عبد الرؤوف
      </h1>
      <p className="text-xl text-gray-800 max-w-lg mx-auto font-inter font-normal">
        أصمّم تجارب ويب تعليمية متطورة، تركّز على التحليل المدرسي والتربوي، باستخدام واجهات مستخدم حديثة وعالية الأداء.
      </p>
    </motion.section>
  );
};


const AboutBlock = () => (
  <div className="w-full bg-white rounded-2xl border border-gray-300 p-7 shadow-lg text-center">
    <p className="text-xl text-gray-800 font-normal">
      شغوف ببناء تطبيقات تعليمية تجمع بين الجمال والوظيفة، وتدعم اتخاذ القرار التربوي من خلال عرض البيانات بشكل واضح وفعّال.
    </p>
  </div>
);

const ConnectSection: React.FC = () => {
  const [showToast] = useState(false);
  const [error] = useState("");

  return (
    <section className="w-full flex flex-col items-center text-center gap-4 mt-8 font-inter relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg font-semibold text-base animate-fade-in">
          Message sent!
        </div>
      )}
      <p className="text-lg text-zinc-400 mb-4 max-w-md mx-auto font-normal">
        يرجى التواصل معنا في حال راودتكم أي استفسارات بشأن الحلول التعليمية الرقمية.
      </p>
      {error && (
        <div className="text-red-500 text-sm mt-1 font-medium">{error}</div>
      )}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export const OwnerProfile = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
    {/* Animated background blob */}
    <div className="absolute -top-32 -left-32 w-[500px] h-[500px] opacity-20 rounded-full blur-3xl animate-pulse-slow z-0" />
    <div className="w-full max-w-2xl flex flex-col items-center gap-12 z-10">
      <HeroSection />
      <AboutBlock />
      <ConnectSection />
    </div>
  </div>
  );
};
