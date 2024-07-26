import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ChartNavigation = ({
  slide,
  setSlide,
  lastSlide,
  year,
}: {
  slide: number;
  setSlide: React.Dispatch<React.SetStateAction<number>>;
  lastSlide: number;
  year: string;
}) => {
  const handleLeftClick = () => {
    if (slide > 0) {
      setSlide((prev) => prev - 1);
    } else {
      setSlide(lastSlide);
    }
  };

  const handleRightClick = () => {
    if (slide === lastSlide) {
      setSlide(0);
    } else {
      setSlide((prev) => prev + 1);
    }
  };

  return (
    <div className="flex justify-center flex-1 items-center gap-2">
      <div className="flex items-center gap-4">
        <button type="button" onClick={handleLeftClick}>
          <FaChevronLeft size={20} />
        </button>
        <span className="text-xl">{year}г.</span>
        <button type="button" onClick={handleRightClick}>
          <FaChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChartNavigation;
