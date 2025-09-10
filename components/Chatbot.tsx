import React, { useState, useEffect, useRef, FC } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";

// SVG Icon Components
const ChatIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
  </svg>
);

const CloseIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const BotIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 2.454 1.135 4.685 2.94 6.258 1.148.976 2.023 2.228 2.023 3.51V21.75a.75.75 0 001.5 0v-.222c0-1.282.875-2.534 2.023-3.51 1.805-1.573 2.94-3.804 2.94-6.258 0-5.385-4.365-9.75-9.75-9.75z" />
  </svg>
);


const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userInput, setUserInput] = useState('');
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const initializeChat = () => {
        if (isInitialized || !process.env.API_KEY) return;
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'You are Aqua, a friendly and knowledgeable AI assistant for the AquaTrack application. Your goal is to help users understand water footprints, water conservation, and sustainability. Be helpful, encouraging, and provide clear, concise answers. Do not answer questions outside of this scope.',
                },
            });
            setMessages([{ role: 'model', content: "Hi! I'm Aqua, your personal water conservation assistant. Ask me anything about water footprints or how you can save water!" }]);
            setIsInitialized(true);
        } catch (e) {
            console.error("Failed to initialize chat:", e);
            setMessages([{role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later."}]);
        }
    };
    
    useEffect(() => {
        if (isOpen) {
            initializeChat();
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chatRef.current || isLoading) return;

        const userMessage = { role: 'user' as const, content: userInput.trim() };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: currentInput });
            setIsLoading(false);
            let text = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of stream) {
                text += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = text;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', content: "Oops! Something went wrong. Please try asking again." }]);
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-dark-blue text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-teal-800 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-blue z-50"
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? <CloseIcon className="w-8 h-8"/> : <ChatIcon className="w-8 h-8"/>}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-full max-h-[calc(100vh-8rem)] sm:max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-fade-in-up" role="dialog" aria-modal="true">
                    <header className="flex items-center justify-between p-4 bg-medium-blue text-white rounded-t-2xl flex-shrink-0">
                        <div className="flex items-center">
                            <BotIcon className="w-8 h-8 mr-2"/>
                            <h3 className="text-lg font-bold">Aqua Helper</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-black/20" aria-label="Close chat">
                            <CloseIcon className="w-6 h-6"/>
                        </button>
                    </header>

                    <main className="flex-1 p-4 overflow-y-auto bg-light-blue/50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-accent-blue text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none shadow-sm'}`}>
                                    <p className="text-sm break-words">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="p-3 rounded-2xl bg-white text-slate-700 rounded-bl-none shadow-sm">
                                    <div className="flex items-center space-x-1.5">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0s]"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </main>

                    <footer className="p-3 border-t border-slate-200 bg-white rounded-b-2xl flex-shrink-0">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Ask a question..."
                                className="w-full px-4 py-2 text-md border border-slate-300 rounded-full focus:ring-2 focus:ring-accent-blue focus:border-transparent transition"
                                autoComplete="off"
                            />
                            <button type="submit" disabled={isLoading || !userInput.trim()} className="p-3 bg-dark-blue text-white rounded-full hover:bg-teal-800 disabled:bg-slate-400 transition flex-shrink-0">
                                <SendIcon className="w-5 h-5"/>
                            </button>
                        </form>
                    </footer>
                </div>
            )}
        </>
    );
};

export default Chatbot;
