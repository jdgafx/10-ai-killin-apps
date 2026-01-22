import { useState } from "react";
import { Send, Loader2, Zap, Moon, Bot, Sparkles } from "lucide-react";

const PROVIDERS = [
  { id: "minimax", name: "MiniMax", color: "from-cyan-500 to-blue-600" },
  { id: "claude", name: "Claude", color: "from-orange-500 to-red-600" },
  { id: "gemini", name: "Gemini", color: "from-purple-500 to-pink-600" },
  { id: "deepseek", name: "DeepSeek", color: "from-green-500 to-emerald-600" },
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState("minimax");
  const [lastProvider, setLastProvider] = useState(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const currentInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          provider,
          messages: messages.filter((m) => m.role !== "system"),
        }),
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setLastProvider(data.provider || provider);
      const aiMessage = {
        role: "assistant",
        content: data.response || data.content,
        provider: data.provider || provider,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const aiMessage = {
        role: "assistant",
        content: `Error: ${error.message}. Please try again or switch providers.`,
        error: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  const getProviderBadge = (providerId) => {
    const p = PROVIDERS.find((pr) => pr.id === providerId);
    if (!p) return null;
    return (
      <span
        className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${p.color} text-white font-mono`}
      >
        {p.name}
      </span>
    );
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      <div className="bg-slate-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              RAG CHAT
            </h1>
            <p className="text-xs text-slate-400">Multi-Provider AI Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400 font-mono">DARK MODE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-lg animate-in fade-in duration-500">
                <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-cyan-500/50 transition-all duration-300 hover:scale-110">
                  <Bot className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  Multi-AI Chat
                </h2>
                <p className="text-slate-300 text-lg mb-2">
                  Powered by MiniMax, Claude, Gemini & DeepSeek
                </p>
                <p className="text-slate-500 text-sm mb-6">
                  Select a provider and start chatting
                </p>
                <div className="mt-8 flex gap-3 justify-center flex-wrap">
                  {PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setProvider(p.id)}
                      className={`px-4 py-2 backdrop-blur-lg border rounded-full text-xs font-mono transition-all duration-300 hover:scale-105 ${
                        provider === p.id
                          ? `bg-gradient-to-r ${p.color} text-white border-transparent shadow-lg`
                          : "bg-white/10 text-slate-300 border-slate-600 hover:bg-white/20"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-300`}
              >
                <div
                  className={`max-w-[75%] ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/30"
                      : msg.error
                        ? "backdrop-blur-lg bg-red-500/20 text-red-200 border border-red-500/30"
                        : "backdrop-blur-lg bg-white/10 text-slate-100 border border-slate-700 shadow-lg"
                  } px-6 py-4 rounded-2xl transition-all duration-300`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-2 h-2 rounded-full ${msg.role === "user" ? "bg-cyan-200" : msg.error ? "bg-red-400" : "bg-indigo-400"} animate-pulse`}
                    />
                    <span
                      className={`text-xs font-mono font-semibold ${msg.role === "user" ? "text-cyan-100" : msg.error ? "text-red-300" : "text-indigo-300"}`}
                    >
                      {msg.role === "user" ? "YOU" : "AI AGENT"}
                    </span>
                    {msg.role === "assistant" &&
                      msg.provider &&
                      getProviderBadge(msg.provider)}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start animate-in fade-in duration-200">
              <div className="backdrop-blur-lg bg-white/10 border border-indigo-500/30 px-6 py-4 rounded-2xl shadow-lg shadow-indigo-500/20">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                  <span className="text-sm text-slate-300 font-mono">
                    {PROVIDERS.find((p) => p.id === provider)?.name} is
                    thinking...
                  </span>
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-800 backdrop-blur-lg bg-slate-900/80 px-6 py-4 shadow-xl">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !loading && handleSend()
                }
                placeholder="Type your message... (Press Enter to send)"
                className="w-full backdrop-blur-lg bg-white/10 text-white px-6 py-4 pr-16 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500 font-mono text-sm transition-all duration-300 hover:bg-white/15"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-slate-500 font-mono">
                {messages.length} messages • Provider:{" "}
                {PROVIDERS.find((p) => p.id === provider)?.name}
              </span>
              <div className="flex gap-2">
                <span className="px-3 py-1 backdrop-blur-lg bg-green-500/20 text-green-400 rounded-full font-mono border border-green-500/30">
                  ● ONLINE
                </span>
                <span className="px-3 py-1 backdrop-blur-lg bg-cyan-500/20 text-cyan-400 rounded-full font-mono border border-cyan-500/30">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  MULTI-AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
