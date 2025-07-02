import React from "react";
import { motion } from "framer-motion";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-white"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full" key={i}>
                  <div>{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">{name}</div>
                      <div className="leading-5 opacity-60 tracking-tight">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

;

const testimonials = [
  {
    text: "لم نتلقَ أي آراء بعد، لكننا متحمسون لسماع انطباعاتكم قريبًا! نؤمن بأن تجاربكم هي أفضل شهادة على جودة ما نقدمه.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "الإسم واللقب",
    role: "مستشار التوجيه والإرشاد",
  },
  {
    text: "لم نتلقَ أي آراء بعد، لكننا متحمسون لسماع انطباعاتكم قريبًا! نؤمن بأن تجاربكم هي أفضل شهادة على جودة ما نقدمه.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "الإسم واللقب",
    role: "مدير(ة)",
  },
  {
    text: "لم نتلقَ أي آراء بعد، لكننا متحمسون لسماع انطباعاتكم قريبًا! نؤمن بأن تجاربكم هي أفضل شهادة على جودة ما نقدمه.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "الإسم واللقب",
    role: "مستشار التوجيه والإرشاد",
  },
  {
    text: "لم نتلقَ أي آراء بعد، لكننا متحمسون لسماع انطباعاتكم قريبًا! نؤمن بأن تجاربكم هي أفضل شهادة على جودة ما نقدمه.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "الإسم واللقب",
    role: "مستشار التوجيه والإرشاد",
  },
  {
    text: "لم نتلقَ أي آراء بعد، لكننا متحمسون لسماع انطباعاتكم قريبًا! نؤمن بأن تجاربكم هي أفضل شهادة على جودة ما نقدمه.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "الإسم واللقب",
    role: "مستشار التوجيه والإرشاد",
  },
  {
    text: "لم نتلقَ أي آراء بعد، لكننا متحمسون لسماع انطباعاتكم قريبًا! نؤمن بأن تجاربكم هي أفضل شهادة على جودة ما نقدمه.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "الإسم واللقب",
    role: "مستشار رئيس",
  },
  {
    text: "لم نتلقَ أي آراء بعد، لكننا متحمسون لسماع انطباعاتكم قريبًا! نؤمن بأن تجاربكم هي أفضل شهادة على جودة ما نقدمه.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "الإسم واللقب",
    role: "مستشار التوجيه والإرشاد",
  },
  {
    text: "لم نتلقَ أي آراء بعد، لكننا متحمسون لسماع انطباعاتكم قريبًا! نؤمن بأن تجاربكم هي أفضل شهادة على جودة ما نقدمه.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "الإسم واللقب",
    role: "مدير(ة)",
  },
  {
    text: "لم نتلقَ أي آراء بعد، لكننا متحمسون لسماع انطباعاتكم قريبًا! نؤمن بأن تجاربكم هي أفضل شهادة على جودة ما نقدمه.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "الإسم واللقب",
    role: "مستشار التوجيه والإرشاد",
  },
];


const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);


const Testimonials = () => {
  return (
    <section className="bg-background text-gray-800 my-20 relative">

      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">آراء المستخدمين</div>
          </div>

          <h2 className="text-3xl font-bold tracking-tighter mt-5">
            نحن فخورون بما نقدمه.
          </h2>
          <p className="text-center mt-5 opacity-75">
            آراء المستخدمين ستُعرض هنا قريبًا لتسليط الضوء على قصص النجاح والتجارب الإيجابية مع منصتنا. تابعونا!
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;