import Image from "next/image";
import { Poppins, Lato } from "next/font/google";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import loadingAnimation from "~/assets/sloading.json";
import Lottie from "lottie-react";
import ReactMarkdown from 'react-markdown';

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});
const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"] });

const Try = ({ name, bubble }: { name: string, bubble: string }) => {
    const [messages, setMessages] = useState<{
        id: number;
        content: string;
        role: "user" | "assistant";
        timestamp?: string;
    }[]>([
        {
            id: 1,
            content: "Hello, how can I help you?",
            role: "assistant",
            timestamp: new Date().toLocaleTimeString(),
        }
    ]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const messageMutate = api.entity.sendMessage.useMutation();

    const sendMessage = () => {
        setMessages((prev) => [...prev,
            {
            id: prev.length + 1,
            content: message,
            role: "user",
            timestamp: new Date().toLocaleTimeString(),
        }]);
        setMessage("");
        void (async () => {
            setLoading(true);
            const resp = await messageMutate.mutateAsync({
                messages: [
                    ...messages,
                    {
                        id: messages.length + 1,
                        content: message,
                        role: "user",
                        timestamp: new Date().toLocaleTimeString(),
                    }
                ],
                bubble_id: bubble,
            });
            if(resp.message === "failed") {
                toast.error("Something went wrong");
            } else {
                setMessages((prev) => [...prev, 
                {
                    id: prev.length + 1,
                    content: resp.data?.message?.content || "Sorry, I don't understand",
                    role: "assistant",
                    timestamp: new Date().toLocaleTimeString(),
                }]);
            }
            setLoading(false);
        })();
    };
    // capture enter key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                sendMessage();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    });
    return (
        <div className="h-[50vh]">
            <div className="flex flex-row gap-6 bg-red-800 px-4 py-3 sm:px-6 rounded-t-lg">
                <Image
                    className="aspect-square rounded-full bg-white shadow-md"
                    src={`https://avatars.dicebear.com/api/micah/${name}.svg`}
                    width={80}
                    height={80}
                    alt="Bubble"
                />
                <div className="flex flex-col justify-end">
                    {/* Chatbot name */}
                    <div className="text-white font-bold text-3xl">
                        {name}
                    </div>
                    {/* Chatbot status */}
                    <div className="text-white text-sm">
                        <span className="text-green-600">● </span>
                        Online
                    </div>
                </div>
            </div>
            <div className="bg-red-100 px-4 py-5 sm:p-6 rounded-b-lg h-full">
                <div className="flex flex-col gap-4 md:h-full overflow-y-auto h-full">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={
                                "flex flex-row gap-4 " +
                                (message.role === "user"
                                    ? "justify-end"
                                    : "justify-start")
                            }
                        >
                            <div
                                className={
                                    "flex flex-col gap-2 px-4 py-2 rounded-lg shadow-md " +
                                    (message.role === "user"
                                        ? "bg-white"
                                        : "bg-red-700 text-white")
                                }
                            >
                                <div className={poppins.className}>
                                    <ReactMarkdown className="">
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                                <div className={lato.className}>
                                    {message.timestamp}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-row gap-4 mt-4">
                    <input
                        className={"flex-1 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent " + poppins.className}
                        type="text"
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        className={"px-4 py-2 rounded-lg shadow-md bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed " + poppins.className}
                        type="button"
                        disabled={loading}
                        onClick={sendMessage}
                    >
                        {
                            loading ? (
                                <Lottie
                                    animationData={
                                        loadingAnimation
                                    }
                                    className="w-8"
                                />
                            ) : "Send"
                        }
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Try;
