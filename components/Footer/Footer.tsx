import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer p-4 bg-base-200 text-base-content flex flex-col gap-2">
      <div className="flex justify-between w-full items-center">
        <div className="text-sm opacity-70">
          © {new Date().getFullYear()} Noted.
        </div>
        <div className="flex gap-4">
          <a
            href="https://github.com/AviroopPaul"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/avirooppaul/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <Linkedin size={20} />
          </a>
        </div>
        <div className="text-sm opacity-70">
          All rights reserved to <a className="text-primary" href="https://linkedin.com/in/avirooppaul" target="_blank" rel="noopener noreferrer">Aviroop.</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
