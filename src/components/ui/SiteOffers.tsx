import React from "react";
import { cn } from "../../lib/utils";
import {
  Calculator,
  GitCompare,
  SquareKanban,
  FileText,
  Goal,
  LayoutTemplate,
  Wallet,
  Gauge
} from "lucide-react";

export function SiteOffers() {
  const features = [
    {
      title: "تحليل النتائج",
      description:
        "حن نقدم لك تحليلاً شاملاً لنتائجك يساعدك في اتخاذ القرارات الصحيحة.",
      icon: <Calculator />,
    },
    {
      title: "مقارنة النتائج",
      description:
        "قارنة النتائج بطرق ذكية تتيح لك رؤية التوجهات والاختلافات بوضوح.",
      icon: <GitCompare />,
    },
    {
      title: "رسوم بيانية",
      description:
        "تمتع برسوم بيانية احترافية تسهل فهم البيانات وتساعدك على اتخاذ قرارات مدروسة.",
      icon: <SquareKanban />,
    },
    {
      title: "تقارير بيداغوجية",
      description: "تقارير بيداغوجية تساهم في فهم أعمق للنتائج.",
      icon: <FileText />,
    },
    {
      title: "دقة عالية",
      description: "استمتع بنتائج دقيقة وموثوقة تضمن لك قرارات مدروسة.",
      icon: <Goal />,
    },
    {
      title: "مجاني",
      description:
        "استفد من خدماتنا مجاناً وبكل سهولة، أفضل الأدوات في متناول يدك دون أي تكلفة.",
      icon: <Wallet />,
    },
    {
      title: "واجهة تفاعلية",
      description:
        "استمتع بتجربة مستخدم مبتكرة مع واجهة تفاعلية تلبي احتياجاتك.",
      icon: <LayoutTemplate />,
    },
    {
      title: "تحليل في ثواني",
      description: "تحليل فوري لنتائجك يساعدك على سرعة اتخاذ القرارات في وقت قياسي.",
      icon: <Gauge />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800 bg-white",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800" 
      )} 
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relatsive z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};



function OwnerProfile() {
  return (
    <div className="min-h-screen w-full">
      <div className="absolute top-0 left-0 w-full">
        <SiteOffers />
      </div>
    </div>
  );
}

export { OwnerProfile };