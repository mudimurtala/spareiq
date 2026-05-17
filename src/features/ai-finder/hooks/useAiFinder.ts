import { useState } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface UseAiFinderReturn {
  messages: ChatMessage[];
  loading: boolean;
  error: string;
  sendMessage: (userMessage: string) => Promise<void>;
  clearMessages: () => void;
}

export const useAiFinder = (): UseAiFinderReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const systemPrompt = `You are a spare parts identification assistant for a Nigerian auto parts store called SpareIQ. When a user describes a part in any language including Pidgin English, identify the correct technical name of the part and respond with: the part name in bold, a one line description of what it does, and suggest what category it belongs to from this list: Engine, Brakes, Electrical, Suspension, Body Parts, Cooling System. Keep responses short and helpful.`;

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Add user message to chat
    const userMsgId = Date.now().toString();
    const newUserMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: userMessage,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);
    setError('');

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error('OpenRouter API key not configured');
      }

      const url = 'https://openrouter.ai/api/v1/chat/completions';

      const body = {
        model: 'deepseek/deepseek-v4-flash:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      // Add assistant message to chat
      const aiMsgId = (Date.now() + 1).toString();
      const newAiMessage: ChatMessage = {
        id: aiMsgId,
        role: 'assistant',
        content: assistantMessage,
      };
      setMessages((prev) => [...prev, newAiMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('AI Finder error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError('');
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
};

// Helper: extract a primary part name from AI response and score parts
export function findMatchingParts<T extends { name: string; category: string }>(
  aiText: string,
  parts: T[],
): T[] {
  if (!aiText || !parts || parts.length === 0) return [];

  // Step 1: Extract part name
  // Try bold **Part Name** first
  const boldMatch = aiText.match(/\*\*(.*?)\*\*/);
  let primary = '';
  if (boldMatch && boldMatch[1]) {
    primary = boldMatch[1];
  } else {
    // Else take first line before a dash or newline
    const firstLine = aiText.split(/\r?\n/)[0];
    const beforeDash = firstLine.split('-')[0];
    primary = beforeDash.trim();
  }

  if (!primary) return [];

  // Split into keywords, remove punctuation and stop words
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'for', 'of', 'is', 'it']);
  const rawKeywords = primary
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((k) => k.trim())
    .filter((k) => k && !stopWords.has(k));

  const keywords = Array.from(new Set(rawKeywords));
  if (keywords.length === 0) return [];

  // Step 2: Score each part
  const scored = parts
    .map((part) => {
      let score = 0;
      const nameLower = part.name.toLowerCase();
      const categoryLower = (part.category || '').toLowerCase();

      for (const kw of keywords) {
        if (nameLower.includes(kw)) score += 3;
      }

      // Category match gives 1 point
      for (const kw of keywords) {
        if (categoryLower === kw || categoryLower.includes(kw)) {
          score += 1;
          break;
        }
      }

      return { part, score };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);

  // Step 3: Return parts with score > 0 sorted by score desc
  return scored.map((s) => s.part);
}
