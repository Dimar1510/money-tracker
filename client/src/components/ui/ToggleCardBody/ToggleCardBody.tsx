import { CardHeader } from "@nextui-org/react";
import React, { FC, ReactElement } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { selectGrid } from "src/app/gridSlice";
import { useAppSelector } from "src/app/hooks";
import { useActions } from "src/app/useActions";

interface IProps {
  cardKey: string;
  cardTitle: string;
  children: ReactElement;
}

const ToggleCardBody: FC<IProps> = ({ cardKey, cardTitle, children }) => {
  const { toggleCard } = useActions();
  const grid = useAppSelector(selectGrid);

  return (
    <>
      <CardHeader className="justify-between">
        <h3>{cardTitle}</h3>
        <button
          onClick={() => toggleCard(cardKey)}
          className="hover:text-primary"
        >
          {grid[cardKey] ? <FaRegEyeSlash /> : <FaRegEye />}
        </button>
      </CardHeader>
      {grid[cardKey] && children}
    </>
  );
};

export default ToggleCardBody;
