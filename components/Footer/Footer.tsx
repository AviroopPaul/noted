import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer p-2 sm:p-4 bg-base-200 text-base-content">
      <div className="flex flex-row items-center justify-between w-full gap-2 sm:gap-6 text-sm">
        <div className="opacity-70">
          © {new Date().getFullYear()}{" "}
          <span className="hidden sm:inline">Noted.</span>
        </div>
        <div className="flex gap-4 sm:gap-6">
          <a
            href="https://github.com/AviroopPaul"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <Github className="h-[20px] w-[20px] sm:h-[24px] sm:w-[24px]" />
          </a>
          <a
            href="https://www.linkedin.com/in/avirooppaul/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <Linkedin className="h-[20px] w-[20px] sm:h-[24px] sm:w-[24px]" />
          </a>
        </div>
        <div className="opacity-70">
          <span className="inline sm:hidden">By </span>
          <span className="hidden sm:inline">All rights reserved to </span>
          <a
            className="text-primary"
            href="https://linkedin.com/in/avirooppaul"
            target="_blank"
            rel="noopener noreferrer"
          >
            Aviroop
          </a>
          <span className="hidden sm:inline">.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
