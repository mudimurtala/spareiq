import { useRef, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { PartGrid } from "../features/inventory/components/PartGrid";
import {
  useAiFinder,
  findMatchingParts,
} from "../features/ai-finder/hooks/useAiFinder";
import { placeholderParts } from "../lib/placeholderParts";

export const AiFinderPage = () => {
  const { messages, loading, error, sendMessage } = useAiFinder();
  const [inputValue, setInputValue] = useState("");
  const [matchedParts, setMatchedParts] = useState<typeof placeholderParts>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Extract keywords from AI response and find matching parts
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        const matchingParts = findMatchingParts(
          lastMessage.content,
          placeholderParts,
        );
        setMatchedParts(matchingParts);
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    await sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Chat Section */}
          <div className="mb-12 lg:mb-16">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-950 mb-2">
                AI Part Finder
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                Describe the part you need in plain English or Pidgin. Our AI
                will identify it for you.
              </p>
            </div>

            {/* Chat Window */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-96">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 space-y-4">
                {messages.length === 0 && !error && (
                  <div className="flex items-center justify-center h-full text-gray-500 text-center">
                    <p className="text-base sm:text-lg">
                      Start by describing a spare part you need, and I'll help
                      you find it!
                    </p>
                  </div>
                )}

                {/* Messages */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-accent-500 text-primary-950 font-semibold"
                          : "bg-white border border-gray-200 text-primary-950"
                      }`}
                    >
                      {/* Simple markdown rendering for bold text */}
                      {message.content
                        .split(/(\*\*.*?\*\*)/g)
                        .map((part, idx) => {
                          if (part.startsWith("**") && part.endsWith("**")) {
                            return (
                              <span key={idx} className="font-bold">
                                {part.slice(2, -2)}
                              </span>
                            );
                          }
                          return <span key={idx}>{part}</span>;
                        })}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="flex justify-start">
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 max-w-xs sm:max-w-md">
                      Error: {error}
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4 sm:p-6 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="E.g. the thing wey dey hold my side mirror for my 2010 Toyota..."
                    disabled={loading}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-accent-500 disabled:bg-gray-100"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !inputValue.trim()}
                    className="bg-accent-500 text-primary-950 font-bold py-3 px-4 sm:px-6 rounded-md hover:bg-opacity-90 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Matched Parts Section */}
          {matchedParts.length > 0 && (
            <div className="border-t border-gray-300 pt-12 lg:pt-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-950 mb-8">
                Matching Parts in Our Inventory
              </h2>
              <PartGrid parts={matchedParts} />
            </div>
          )}

          {messages.length > 0 && matchedParts.length === 0 && !loading && (
            <div className="border-t border-gray-300 pt-12 lg:pt-16 text-center">
              <p className="text-gray-600 text-lg">
                No matching parts found in current inventory.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
