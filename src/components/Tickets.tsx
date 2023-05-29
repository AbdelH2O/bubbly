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

const Tickets = ({
    bubble_id,
    supabase
}: {
    bubble_id: string;
    supabase: ReturnType<typeof useCLient>;
}) => {
    const [loading, setLoading] = useState(false);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);

    const getTickets = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("ticket")
            .select("*")
            .eq("bubble", bubble_id)
            .order("created_at", { ascending: true })
            .range(page*10, page*10 + 9);
        
        if (error) {
            toast.error(error.message);
        } else {
            setTickets(data);
        }
        const { count, error: countError } = await supabase
            .from("ticket")
            .select("id", { count: "exact" })
            .eq("bubble", bubble_id);
        if (countError || count === null) {            
            toast.error(countError ? countError.message : "Error fetching tickets");
        } else {
            setTotal(count);
        }
        setLoading(false);
    };

    useEffect(() => {
        void getTickets();
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
                        Tickets
                    </h3>
                    <p
                        className={
                            "mt-1 max-w-2xl text-sm text-gray-200 " +
                            lato.className
                        }
                    >
                        View all tickets
                    </p>
                </div>
            </div>
            <div className="flex flex-col w-full h-full bg-white rounded-b-lg py-4">
                <div className="flex flex-col w-full h-fit min-h-[14rem] rounded-b-lg">
                    {loading ? (
                        <div className="flex flex-col w-full h-fit justify-center items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-r-0 border-red-800"></div>
                        </div>
                    ) : (
                        <div className="flex flex-col w-full h-fit">
                            {tickets.length > 0 ? (
                                <div className="flex flex-col w-full h-fit">
                                    {tickets.map((ticket, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col w-full h-fit"
                                        >
                                            <div className="flex flex-row w-full h-fit border-b border-gray-200 py-4">
                                                <div className="flex flex-col h-full justify-center pl-6">
                                                    <p
                                                        className={
                                                            "text-xl font-semibold leading-6 text-gray-900 " +
                                                            poppins.className
                                                        }
                                                    >
                                                        {ticket.email}
                                                    </p>
                                                </div>
                                                <div className="flex min-w-0 break-words flex-col flex-grow h-full justify-center pl-6">
                                                    <p
                                                        className={
                                                            "text-xl min-w-0 font-normal leading-6 text-gray-900 " +
                                                            lato.className
                                                        }
                                                    >
                                                        {ticket.message}
                                                    </p>
                                                </div>
                                                {
                                                    ticket.chat && (
                                                        <div className="flex flex-col h-full justify-center px-12 my-auto">
                                                            <button
                                                                className={
                                                                    "text-xl font-semibold leading-6 text-red-800 " +
                                                                    poppins.className
                                                                }
                                                                onClick={() => {
                                                                    if(!navigator.clipboard || ticket.chat === undefined) return;
                                                                    void navigator.clipboard.writeText(ticket.chat);
                                                                    toast.success("Copied to clipboard");
                                                                }}
                                                            >
                                                                Copy chat ID
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ))}
                                    {/* Pagination using the total number of pages */}
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
                            ) : (
                                <div className="flex flex-col w-full h-full justify-center items-center">
                                    <Lottie
                                        animationData={
                                            emptyAnimation
                                        }
                                        className="w-40"
                                    />
                                    <h3
                                        className={
                                            "text-2xl font-medium leading-6 text-black " +
                                            poppins.className
                                        }
                                    >
                                        No Tickets
                                    </h3>
                                    <p
                                        className={
                                            "mt-1 max-w-2xl text-sm text-gray-800 " +
                                            lato.className
                                        }
                                    >
                                        You don&apos;t have any tickets yet
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tickets;