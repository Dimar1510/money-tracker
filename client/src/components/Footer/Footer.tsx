import { FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <div className="flex group p-4 bg-default-50 w-full">
      <a
        aria-label={"Github"}
        href={"https://github.com/Dimar1510/money-tracker"}
        className="text-text-clr inline-flex size-full rounded-lg p-1 justify-center"
        target="_blank"
        rel="noreferrer"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-center text-text-clr group-hover:scale-125  transition-transform duration-500 group-hover:rotate-[360deg] will-change-transform ">
            <FaGithub />
          </span>
          <span className="uppercase">Dmitry Martynov</span>
        </div>
      </a>
    </div>
  );
};
