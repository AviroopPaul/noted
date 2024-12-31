import { useState, useEffect } from "react";
import LoadingSpinner from "../../UI/LoadingSpinner";

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIModal = ({ isOpen, onClose }: AIModalProps) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<
    Array<{ prompt: string; response: string }>
  >([
    {
      response: "What's on your mind?",
    } as { prompt: string; response: string },
  ]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (response.ok && data.response) {
        setConversations((prev) => [
          ...prev,
          { prompt, response: data.response },
        ]);
        setPrompt("");
      } else {
        throw new Error(data.error || "Failed to get AI response");
      }
    } catch (error) {
      console.error("AI request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="bg-base-100 rounded-2xl w-full max-w-2xl h-[90vh] sm:max-h-[80vh] flex flex-col border border-primary/20 shadow-lg shadow-primary/20 [&::-webkit-scrollbar-thumb]:bg-base-content/20 [&::-webkit-scrollbar]:bg-base-content/5">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-primary/20 flex justify-between items-center bg-base-200/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <h2
              className="text-base sm:text-lg modal-header-gradient"
              style={{
                fontFamily: "'Quicksand', sans-serif",
                letterSpacing: "0.03em",
              }}
            >
              NotedAI
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle text-base-content"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Conversation History */}
        <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-3 sm:space-y-4 [&::-webkit-scrollbar-thumb]:bg-base-content/20 [&::-webkit-scrollbar]:bg-base-content/5">
          {conversations.map((conv, index) => (
            <div key={index} className="space-y-2">
              {conv.prompt && (
                <div className="bg-base-200/50 p-2 sm:p-3 rounded-lg border border-base-300">
                  <p className="font-medium text-xs sm:text-sm text-base-content/70 mb-1 sm:mb-2">
                    You
                  </p>
                  <p className="mt-1 text-sm sm:text-base text-base-content">
                    {conv.prompt}
                  </p>
                </div>
              )}
              <div className="bg-primary/5 p-2 sm:p-3 rounded-lg border border-primary/20">
                <div className="flex justify-between items-start">
                  <p
                    className="font-medium text-xs sm:text-sm text-primary mb-1 sm:mb-2"
                    style={{
                      fontFamily: "'Quicksand', sans-serif",
                      letterSpacing: "0.03em",
                    }}
                  >
                    NotedAI
                  </p>
                  {conv.prompt && (
                    <button
                      onClick={() => copyToClipboard(conv.response)}
                      className="btn btn-ghost btn-xs text-base-content"
                      title="Copy response"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 sm:h-4 sm:w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm sm:text-base text-base-content">
                  {conv.response}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-4 border-t border-primary/20 bg-base-200/50"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything..."
              className="input input-bordered input-sm sm:input-md flex-1 bg-base-100 border-primary/20 text-base-content focus:border-primary"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm sm:btn-md"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIModal;
