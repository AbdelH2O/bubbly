import { Poppins, Lato } from "next/font/google";
import { useEffect, useState } from "react";
import type useCLient from "~/utils/sbClient";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import emptyAnimation from "~/assets/empty.json";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"] });

const Chats = ({
    bubble_id,
    supabase
}: {
    bubble_id: string;
    supabase: ReturnType<typeof useCLient>;
}) => {
    const [loading, setLoading] = useState(false);
    const [chats, setChats] = useState<Chat[]>([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [selected, setSelected] = useState<Chat | null>(null);


    const getChats = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("chat")
            .select(`
                *,
                messages: message (*)
            `)
            .eq("bubble", bubble_id)
            .order("created_at", { ascending: true })
            .range(page*10, page*10 + 9);

        if (error) {
            toast.error(error.message);
        } else {
            setChats(data);
            // setSelected(data[0]);
        }
        const { count, error: countError } = await supabase
            .from("chat")
            .select("fingerprint", { count: "exact" })
            .eq("bubble", bubble_id);
        if (countError || !count) {
            toast.error(countError ? countError.message : "Error fetching chats");
        } else {
            setTotal(count);
        }
        setLoading(false);
    };

    useEffect(() => {
        void getChats();
    }, [page]);

    return (
        <div className="flex flex-col w-full h-full shadow-lg rounded-lg">
            <div className="flex h-24 w-full flex-row justify-between bg-red-800 text-white rounded-t-lg">
                <div className="flex flex-col justify-center pl-6">
                    <h3
                        className={
                            "text-3xl font-semibold leading-6 text-white " +
                            poppins.className
                        }
                    >
                        Chats
                    </h3>
                    <p
                        className={
                            "mt-1 max-w-2xl text-sm text-gray-200 " +
                            lato.className
                        }
                    >
                        View all chats
                    </p>
                </div>
            </div>
            <div className="flex flex-col w-full h-full bg-red-100 rounded-b-lg">
                <div className="flex flex-col w-full h-fit min-h-[14rem] rounded-b-lg">
                    {loading ? (
                        <div className="flex flex-col w-full h-fit justify-center items-center my-auto">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-r-0 border-red-800"></div>
                        </div>
                    ) : (
                        <div className="flex flex-col w-full h-fit justify-center items-center">
                            {chats.length === 0 ? (
                                <div className="flex flex-col w-full h-fit justify-center items-center">
                                    <Lottie
                                        animationData={
                                            emptyAnimation
                                        }
                                        className="w-40"
                                    />
                                    <p
                                        className={
                                            "text-lg font-semibold leading-6 text-gray-600 " +
                                            poppins.className
                                        }
                                    >
                                        No chats yet...
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col w-full h-fit justify-center items-center p-4 pl-0 pt-0">
                                    {/* Input field to filter chats via id */}
                                    <div className="grid grid-cols-5 w-full h-fit">
                                        <div className="flex col-span-1 flex-col w-full h-full justify-start items-center">
                                            {chats.map((chat, i) => (
                                                <div
                                                    key={i}
                                                    className={"flex flex-col w-full h-fit justify-center items-center bg-white shadow-lg border cursor-pointer hover:bg-gray-50 " + (selected?.fingerprint === chat.fingerprint ? "translate-x-1 transition-transform duration-300 ease-in-out" : "")}
                                                    onClick={() => setSelected(chat)}
                                                >
                                                    <div
                                                        className={
                                                            "text-lg w-full my-auto flex flex-col items-start p-2 font-semibold leading-6 text-black " +
                                                            poppins.className
                                                        }
                                                    >
                                                        {chat.fingerprint.slice(0, 6) + "..." + chat.fingerprint.slice(-4)}
                                                        {/* <p className="p-1">
                                                            
                                                        </p> */}
                                                    </div>
                                                    <div
                                                        className={
                                                            "text-md w-full my-auto flex flex-col items-end font-normal leading-6 text-gray-500 " +
                                                            poppins.className
                                                        }
                                                    >
                                                        <p className="p-1">
                                                            {new Date(chat.created_at || "").toLocaleString()}
                                                        </p>
                                                    </div>

                                                </div>
                                            ))}
                                            
                                        </div>
                                        <div className="flex col-span-4 flex-col w-full h-fit justify-center items-center">
                                            {selected ? (
                                                <div className="flex flex-col w-full h-fit justify-center items-center">
                                                    <div className="flex flex-col w-full h-fit px-2">
                                                        {selected.messages && Array.isArray(selected.messages) && selected.messages.map((message, i) => {
                                                            return (
                                                                <div key={i} className={`flex mt-2 flex-row w-full h-fit justify-${message.sender === "user" ? "end" : "start"} items-center`}>
                                                                    <div
                                                                        className={
                                                                            "flex flex-col gap-2 px-4 py-2 rounded-lg shadow-md " +
                                                                            (message.sender === "user"
                                                                                ? "bg-white"
                                                                                : "bg-red-700 text-white")
                                                                        }
                                                                    >
                                                                        <div className={poppins.className}>
                                                                            {message.content}
                                                                        </div>
                                                                        <div className={lato.className}>
                                                                            {new Date(message.created_at || "").toLocaleString()}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        )}
                                                        {selected.messages && Array.isArray(selected.messages) && selected.messages.map((message, i) => {
                                                            return (
                                                                <div key={i} className={`flex mt-2 flex-row w-full h-fit justify-${message.sender === "user" ? "end" : "start"} items-center`}>
                                                                    <div
                                                                        className={
                                                                            "flex flex-col gap-2 px-4 py-2 rounded-lg shadow-md " +
                                                                            (message.sender === "user"
                                                                                ? "bg-white"
                                                                                : "bg-red-700 text-white")
                                                                        }
                                                                    >
                                                                        <div className={poppins.className}>
                                                                            {message.content}
                                                                        </div>
                                                                        <div className={lato.className}>
                                                                            {new Date(message.created_at || "").toLocaleString()}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col w-full h-fit justify-center items-center">
                                                    <p
                                                        className={
                                                            "text-2xl font-semibold leading-6 text-gray-500 " +
                                                            poppins.className
                                                        }
                                                    >
                                                        Select a chat to view messages
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Pagination of chat heads */}
                                    <div className="flex flex-row w-full h-fit justify-center items-center py-4">
                                        {Array.from(Array(Math.ceil(total / 10)).keys()).map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setPage(index)}
                                                className={
                                                    "mx-1 px-2 py-1 rounded-lg " +
                                                    (page === index
                                                        ? "bg-red-800 text-white"
                                                        : "bg-white text-red-800")
                                                }
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chats;