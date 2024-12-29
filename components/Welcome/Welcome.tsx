import { ArrowRight, BookText, Globe, Users2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./Welcome.module.css";

const features = [
  {
    icon: <BookText className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Rich Text Editor",
    description: "Create beautiful documents with our intuitive editor",
  },
  {
    icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Access Anywhere",
    description:
      "Your notes are securely stored in the cloud, accessible from any device",
  },
  {
    icon: <Users2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Custom Themes",
    description: "Personalize your workspace with a variety of themes",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 sm:w-6 sm:h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: "NotedAI Assistant",
    description:
      "Get intelligent help with your note-taking using our AI assistant",
  },
];

export default function Welcome() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-2xl w-full text-center space-y-4 sm:space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-base-content">
          Welcome to{" "}
          <span className={cn("text-primary", styles.animatedText)}>
            Noted.
          </span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-14 mx-auto max-w-lg">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-3 sm:p-4 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
            >
              <div className="text-primary mb-2 sm:mb-3 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-base-content mb-1 sm:mb-2">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-base-content">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 space-y-3">
          <Link
            href="/auth/signup"
            className="btn btn-primary gap-2 text-sm sm:text-base w-full sm:w-auto"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-base-content text-xs sm:text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
