import { Image } from "@nextui-org/react";
import { useContext, useEffect, useRef, useState } from "react";
import FeatureItem from "src/components/FeatureItem/FeatureItem";
import { ThemeContext } from "src/components/ThemeProvider";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import createImg from "src/assets/images/create.png";
import categoriesImg from "src/assets/images/categories.png";
import expenseImg from "src/assets/images/expense.png";
import hiddenImg from "src/assets/images/hidden.png";
import exportImg from "src/assets/images/export.png";
import createImgDark from "src/assets/images/create-dark.png";
import categoriesImgDark from "src/assets/images/categories-dark.png";
import expenseImgDark from "src/assets/images/expense-dark.png";
import hiddenImgDark from "src/assets/images/hidden-dark.png";
import exportImgDark from "src/assets/images/export-dark.png";

const images = [createImg, categoriesImg, expenseImg, hiddenImg, exportImg];
const imagesDark = [
  createImgDark,
  categoriesImgDark,
  expenseImgDark,
  hiddenImgDark,
  exportImgDark,
];

const HomeCards: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const ref4 = useRef<HTMLDivElement>(null);
  const refs = [ref0, ref1, ref2, ref3, ref4];

  const [src, setSrc] = useState(theme === "dark" ? imagesDark[0] : images[0]);
  const { scrollY } = useScroll();

  const handleImageChange = () => {
    const stickyTop = window.innerHeight * 0.33 + window.scrollY;

    refs.forEach((ref, index) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementBottom = rect.bottom + window.scrollY;

        if (elementTop <= stickyTop + 200 && elementBottom >= stickyTop) {
          setSrc(theme === "dark" ? imagesDark[index] : images[index]);
        }
      }
    });
  };

  useMotionValueEvent(scrollY, "change", () => {
    handleImageChange();
  });

  useEffect(() => {
    handleImageChange();
  }, [theme]);

  useEffect(() => {
    setSrc(theme === "dark" ? imagesDark[0] : images[0]);
  }, [theme]);

  return (
    <motion.div
      className="flex gap-10 relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 1 }}
    >
      <div className="flex flex-col flex-1 gap:8 sm:gap-y-60 mb-20">
        <FeatureItem
          image={theme === "dark" ? imagesDark[1] : images[1]}
          parentRef={ref0}
          title="Добавляйте транзакции"
          text="Вносите свои расходы или доходы для ежедневного учета и Where's the money сразу же добавит их в статистику."
        />
        <FeatureItem
          image={theme === "dark" ? imagesDark[2] : images[2]}
          parentRef={ref1}
          title="Создавайте и редактируйте категории"
          text="Получайте общую картину трат и прибыли, разбив расходы и доходы по категориям."
        />
        <FeatureItem
          image={theme === "dark" ? imagesDark[3] : images[3]}
          parentRef={ref2}
          title="Графики расходов"
          text="Позволяют с легкостью отслеживать, куда и сколько денег уходит каждый месяц."
        />
        <FeatureItem
          image={theme === "dark" ? imagesDark[3] : images[3]}
          parentRef={ref3}
          title="Скрывайте лишнее"
          text="Если информация с какой-либо карточки в данный момент не нужна, ее можно скрыть c главной страницы."
        />
        <FeatureItem
          image={theme === "dark" ? imagesDark[4] : images[4]}
          parentRef={ref4}
          title="Экспорт в Excel"
          text="Сохраните таблицу транзакций себе на устройство в формате xlsx для дальнейшего анализа или сравнения."
        />
      </div>
      <div className="flex-1 hidden sm:block">
        <div className="sticky top-1/3 flex justify-end ">
          <AnimatePresence mode="wait">
            <motion.div
              key={src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              exit={{ opacity: 0 }}
            >
              <Image
                className="size-[350px] object-cover border border-default-500 p-2"
                src={src}
                alt="Feature"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeCards;
