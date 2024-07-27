import { Card, CardHeader, Spinner } from "@nextui-org/react";
import React, { FC, ReactElement } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { selectGrid } from "src/app/gridSlice";
import { useAppSelector } from "src/app/hooks";
import { useActions } from "src/app/useActions";

interface IProps {
  cardKey: string;
  cardTitle: string;
  children: ReactElement;
  icon: ReactElement;
  isLoading: boolean;
}

const ToggleCard: FC<IProps> = ({
  cardKey,
  cardTitle,
  children,
  icon,
  isLoading,
}) => {
  const { toggleCard } = useActions();
  const grid = useAppSelector(selectGrid);

  return (
    <Card shadow="sm" className="flex-1 h-fit" id={cardKey}>
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
          onClick={(e) => {
            e.stopPropagation();
            toggleCard(cardKey);
          }}
          className={`hover:text-primary ${
            !grid[cardKey] && "group-hover:text-primary"
          }`}
        >
          {grid[cardKey] ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
        </button>
      </CardHeader>

      {grid[cardKey] &&
        (isLoading ? <Spinner size="lg" className="p-4" /> : children)}
    </Card>
  );
};

export default ToggleCard;
