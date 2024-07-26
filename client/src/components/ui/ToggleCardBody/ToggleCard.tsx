import { Card, CardHeader } from "@nextui-org/react";
import React, { FC, ReactElement } from "react";
import { IconType } from "react-icons";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { selectGrid } from "src/app/gridSlice";
import { useAppSelector } from "src/app/hooks";
import { useActions } from "src/app/useActions";

interface IProps {
  cardKey: string;
  cardTitle: string;
  children: ReactElement;
  icon: ReactElement;
}

const ToggleCard: FC<IProps> = ({ cardKey, cardTitle, children, icon }) => {
  const { toggleCard } = useActions();
  const grid = useAppSelector(selectGrid);

  return (
    <Card shadow="sm" className="flex-1 h-fit">
      <CardHeader
        className={`group justify-between ${
          !grid[cardKey] && "cursor-pointer"
        }`}
        onClick={grid[cardKey] ? () => {} : () => toggleCard(cardKey)}
      >
        <h3 className="flex gap-2 items-center">
          {icon}
          {cardTitle}
        </h3>
        <button
          onClick={() => toggleCard(cardKey)}
          className={`hover:text-primary ${
            !grid[cardKey] && "group-hover:text-primary"
          }`}
        >
          {grid[cardKey] ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
        </button>
      </CardHeader>
      {grid[cardKey] && children}
    </Card>
  );
};

export default ToggleCard;
