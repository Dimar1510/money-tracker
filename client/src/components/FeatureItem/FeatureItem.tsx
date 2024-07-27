import { Image } from "@nextui-org/react";
import React, { useContext } from "react";
import { ThemeContext } from "../ThemeProvider";

const FeatureItem = ({
  title,
  text,
  image,
}: {
  title: string;
  text: string;
  image: string;
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="flex gap-16 items-center flex-wrap">
      <div className="flex-1 min-w-[300px]">
        <h3 className="text-3xl">{title}</h3>
        <p className="text-lg">{text}</p>
      </div>
      <Image
        src={
          theme === "dark"
            ? image.slice(0, -4) + "-dark" + image.slice(-4)
            : image
        }
        className="flex-1 max-h-[400px] aspect-square border border-primary"
      />
    </div>
  );
};

export default FeatureItem;
