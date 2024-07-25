import { Tooltip } from "@nextui-org/react";
import React from "react";
import { IoIosHelpCircleOutline } from "react-icons/io";

const HelpTooltip = () => {
  return (
    <Tooltip
      closeDelay={150}
      showArrow
      placement="right"
      content="Формат даты: yy-mm-dd"
      classNames={{
        base: ["before:bg-neutral-400 dark:before:bg-white"],
        content: [
          "py-2 px-4 shadow-xl",
          "text-black bg-gradient-to-br from-white to-neutral-400",
        ],
      }}
    >
      <div className="text-default-500">
        <IoIosHelpCircleOutline size={30} />
      </div>
    </Tooltip>
  );
};

export default HelpTooltip;
