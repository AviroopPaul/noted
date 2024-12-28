import { ArrowRight, BookText, Globe, Users2 } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <BookText className="w-6 h-6" />,
    title: "Rich Text Editor",
    description: "Create beautiful documents with our intuitive editor",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Access Anywhere",
    description:
      "Your notes are securely stored in the cloud, accessible from any device",
  },
  {
    icon: <Users2 className="w-6 h-6" />,
    title: "Custom Themes",
    description: "Personalize your workspace with a variety of themes",
  },
];

export default function Welcome() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-base-content">
          Welcome to <span className="font-mono text-primary">Noted.</span>
        </h1>
        <p className="text-lg text-base-content">
          Sign in to start creating and organizing your notes
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
            >
              <div className="text-primary mb-3 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-base-content mb-2">{feature.title}</h3>
              <p className="text-sm text-base-content">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-3">
          <Link href="/auth/signup" className="btn btn-primary gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-base-content text-sm">
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
