import { Tooltip } from "@nextui-org/react";
import React, { useContext } from "react";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { ThemeContext } from "src/components/ThemeProvider";

const HelpTooltip = ({
  text,
  placement,
}: {
  text: string;
  placement:
    | "top-start"
    | "top"
    | "top-end"
    | "bottom-start"
    | "bottom"
    | "bottom-end"
    | "left-start"
    | "left"
    | "left-end"
    | "right-start"
    | "right"
    | "right-end";
}) => {
  return (
    <div className="z-50">
      <Tooltip closeDelay={150} showArrow placement={placement} content={text}>
        <div className="text-default-500">
          <IoIosHelpCircleOutline size={30} />
        </div>
      </Tooltip>
    </div>
  );
};

export default HelpTooltip;
