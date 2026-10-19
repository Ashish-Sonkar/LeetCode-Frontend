

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import {
  Send,
  Bot,
  Sparkles,
  User,
  Code2,
  Lightbulb,
  LoaderCircle,
  MessageCircle,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

function ChatAi({ problem }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const messageValue = watch("message", "");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  const onSubmit = async (data) => {
    const text = data.message?.trim();

    if (!text || isLoading) return;

    const userMessage = {
      role: "user",
      parts: [{ text }],
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsLoading(true);
    reset();

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: updatedMessages,
        title: problem?.title,
        description: problem?.description,
        testCases: problem?.visibleTestCases,
        startCode: problem?.startCode,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text:
                response.data?.message ||
                "I couldn't generate a response. Please try again.",
            },
          ],
        },
      ]);
    } catch (err) {
      console.error(
        "AI API Error:",
        err.response?.data || err.message
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text:
                err.response?.data?.message ||
                "Something went wrong. Please try again later.",
            },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestion = (text) => {
    setValue("message", text);
    inputRef.current?.focus();
  };

  const {
    ref: registeredInputRef,
    ...messageInputProps
  } = register("message", {
    required: "Please enter a message.",
    minLength: {
      value: 2,
      message: "Message must contain at least 2 characters.",
    },
    maxLength: {
      value: 5000,
      message: "Message cannot exceed 5000 characters.",
    },
    validate: (value) =>
      value.trim().length >= 2 || "Please enter a valid message.",
  });

  return (
    <div className="flex h-full min-h-[450px] max-h-[80vh] flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl">

      {/* Chat Header */}
      <div className="relative flex items-center justify-between gap-3 border-b border-base-300 bg-base-100 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bot size={25} />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-base-100 bg-success" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-base-content sm:text-lg">
              AI Coding Assistant
            </h2>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <p className="text-xs text-base-content/60">
                {isLoading ? "Thinking..." : "Ready to help you"}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary sm:flex">
          <Sparkles size={14} />
          Coding AI
        </div>
      </div>

      {/* Problem Context */}
      {problem?.title && (
        <div className="border-b border-base-300 bg-base-200/40 px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-2 text-xs text-base-content/60">
            <Code2 size={14} className="shrink-0 text-primary" />
            <span className="shrink-0">Problem:</span>
            <span className="truncate font-semibold text-base-content/80">
              {problem.title}
            </span>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 space-y-5 overflow-y-auto scroll-smooth px-3 py-5 sm:px-5">

        {/* Empty State */}
        {messages.length === 0 && (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-2 py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary">
              <Sparkles size={30} />
            </div>

            <h3 className="text-lg font-bold text-base-content">
              Let's solve this problem!
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/60">
              Ask me for hints, algorithm explanations, debugging help,
              or a more efficient solution.
            </p>

            <div className="mt-6 grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  handleSuggestion("Give me a hint for this problem without revealing the full solution.")
                }
                className="group flex items-start gap-3 rounded-xl border border-base-300 bg-base-100 p-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="rounded-lg bg-warning/10 p-2 text-warning">
                  <Lightbulb size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-base-content">
                    Give me a hint
                  </p>
                  <p className="mt-1 text-xs text-base-content/50">
                    Start with a clue
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSuggestion("Explain the optimal approach and its time and space complexity.")
                }
                className="group flex items-start gap-3 rounded-xl border border-base-300 bg-base-100 p-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="rounded-lg bg-info/10 p-2 text-info">
                  <Code2 size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-base-content">
                    Optimal approach
                  </p>
                  <p className="mt-1 text-xs text-base-content/50">
                    Learn the algorithm
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Conversation */}
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          const content = msg.parts?.[0]?.text ?? "";

          return (
            <div
              key={index}
              className={`flex w-full items-start gap-2.5 sm:gap-3 ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  isUser
                    ? "bg-primary text-primary-content"
                    : "border border-base-300 bg-base-200 text-primary"
                }`}
              >
                {isUser ? <User size={17} /> : <Bot size={18} />}
              </div>

              {/* Message */}
              <div
                className={`min-w-0 max-w-[88%] sm:max-w-[85%] ${
                  isUser ? "items-end" : "items-start"
                } flex flex-col`}
              >
                <p className="mb-1.5 px-1 text-[11px] font-semibold text-base-content/50">
                  {isUser ? "You" : "AI Assistant"}
                </p>

                <div
                  className={`min-w-0 max-w-full overflow-hidden rounded-2xl px-3.5 py-3 sm:px-4 ${
                    isUser
                      ? "rounded-tr-sm bg-primary text-primary-content"
                      : "rounded-tl-sm border border-base-300 bg-base-200/70 text-base-content"
                  }`}
                >
                  <div
                    className={`chat-markdown break-words text-sm leading-6 ${
                      isUser ? "[&_a]:underline" : ""
                    }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="mb-2 mt-3 text-xl font-bold leading-tight first:mt-0">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="mb-2 mt-3 text-lg font-bold leading-tight first:mt-0">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="mb-1.5 mt-3 text-base font-semibold first:mt-0">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="my-2 break-words first:mt-0 last:mb-0">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="my-2 list-disc space-y-1 pl-5 marker:text-primary">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="my-2 list-decimal space-y-1 pl-5 marker:font-semibold marker:text-primary">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="pl-1">{children}</li>
                        ),
                        pre: ({ children }) => (
                          <pre className="my-3 max-w-full overflow-x-auto rounded-xl border border-base-content/10 bg-neutral p-3 text-xs leading-5 text-neutral-content sm:p-4 sm:text-sm">
                            {children}
                          </pre>
                        ),
                        code: ({ children, className }) => (
                          <code
                            className={
                              className
                                ? `${className} font-mono text-xs sm:text-sm`
                                : "rounded-md border border-base-content/10 bg-base-300/80 px-1.5 py-0.5 font-mono text-[0.85em]"
                            }
                          >
                            {children}
                          </code>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="my-3 border-l-[3px] border-primary/60 py-1 pl-3 text-base-content/70">
                            {children}
                          </blockquote>
                        ),
                        table: ({ children }) => (
                          <div className="my-3 max-w-full overflow-x-auto rounded-lg border border-base-300">
                            <table className="w-full border-collapse text-left text-xs sm:text-sm">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-base-300/70">
                            {children}
                          </thead>
                        ),
                        th: ({ children }) => (
                          <th className="border-b border-base-300 px-3 py-2 font-semibold">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border-b border-base-300 px-3 py-2">
                            {children}
                          </td>
                        ),
                        a: ({ children, href }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline underline-offset-2"
                          >
                            {children}
                          </a>
                        ),
                        hr: () => (
                          <hr className="my-3 border-base-300" />
                        ),
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-base-300 bg-base-200 text-primary">
              <Bot size={18} />
            </div>

            <div className="flex flex-col items-start">
              <p className="mb-1.5 px-1 text-[11px] font-semibold text-base-content/50">
                AI Assistant
              </p>

              <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-base-300 bg-base-200/70 px-4 py-3">
                <LoaderCircle
                  size={16}
                  className="animate-spin text-primary"
                />
                <span className="text-sm text-base-content/60">
                  Thinking
                </span>
                <span className="flex gap-1">
                  <span className="h-1 w-1 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                  <span className="h-1 w-1 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                  <span className="h-1 w-1 animate-bounce rounded-full bg-primary" />
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-base-300 bg-base-100 p-3 sm:p-4">
        {errors.message && (
          <p className="mb-2 px-1 text-xs text-error">
            {errors.message.message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`flex items-end gap-2 rounded-2xl border bg-base-200/60 p-2 transition focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 ${
              errors.message ? "border-error/60" : "border-base-300"
            }`}
          >
            <textarea
              {...messageInputProps}
              name="message"
              ref={(element) => {
                registeredInputRef(element);
                inputRef.current = element;
              }}
              rows={1}
              maxLength={5000}
              placeholder="Ask about this problem..."
              disabled={isLoading}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
              className="max-h-32 min-h-10 flex-1 resize-y border-0 bg-transparent px-2 py-2 text-sm leading-5 text-base-content outline-none placeholder:text-base-content/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={
                isLoading ||
                !messageValue?.trim() ||
                messageValue.trim().length < 2
              }
              aria-label="Send message"
              title="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-content shadow-sm transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
            >
              {isLoading ? (
                <LoaderCircle size={19} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2 px-1">
            <p className="flex items-center gap-1 text-[10px] text-base-content/45 sm:text-xs">
              <MessageCircle size={12} />
              Shift + Enter for a new line
            </p>

            <p className="text-[10px] text-base-content/40 sm:text-xs">
              {messageValue?.length || 0}/5000
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatAi;
