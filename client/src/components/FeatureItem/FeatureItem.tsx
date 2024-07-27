import { Image } from "@nextui-org/react";
import React, { Ref, useContext, useRef } from "react";
import { ThemeContext } from "../ThemeProvider";
import { motion, useScroll, useTransform } from "framer-motion";

const cardAnimation = {
  hidden: (custom: boolean) => ({
    x: custom ? -250 : 250,
    opacity: 0,
  }),
  visible: () => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.6 },
  }),
};

const FeatureItem = ({
  title,
  text,
  parentRef,
  image,
}: {
  title: string;
  text: string;
  parentRef: Ref<HTMLDivElement>;
  image?: string;
}) => {
  const { theme } = useContext(ThemeContext);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
  });
  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <motion.div
      className="flex flex-col gap-16 items-center flex-wrap mt-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.2 }}
      ref={parentRef}
    >
      <motion.div
        variants={cardAnimation}
        custom={true}
        ref={ref}
        className="flex-1 flex flex-col gap-6 p-1"
      >
        <h3 className="text-4xl">{title}</h3>
        <p className="text-lg text-default-500">{text}</p>
      </motion.div>
      <div className="flex-1 sm:hidden">
        <Image
          className="size-[300px] object-cover border border-default-500 p-2"
          src={
            theme === "dark" && image
              ? image.slice(0, -4) + "-dark" + image.slice(-4)
              : image
          }
        />
      </div>
    </motion.div>
  );
};

export default FeatureItem;
