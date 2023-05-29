import { Poppins, Lato } from "next/font/google";
import { useState } from "react";
import type useCLient from "~/utils/sbClient";
import { toast } from "react-toastify";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"] });

const Settings = ({
    bubble,
    setBubble,
    supabase,
}: {
    bubble: Bubble;
    setBubble: React.Dispatch<React.SetStateAction<Bubble>>;
    supabase: ReturnType<typeof useCLient>;
}) => {
    const [ticketEmail, setTicketEmail] = useState(bubble.ticket_email);
    const [loading, setLoading] = useState(false);
    // const [isValid, setIsValid] = useState(false);
    const updateTicketEmail = async () => {
        setLoading(true);
        setBubble({
            ...bubble,
            ticket_email: ticketEmail,
        });
        const { error } = await supabase
            .from("bubble")
            .update({ ticket_email: ticketEmail })
            .eq("id", bubble.id);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Ticket email updated successfully");
        }
        setLoading(false);
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    return (
        <div className="flex flex-col w-full h-full shadow-lg">
            <div className="flex h-24 w-full flex-row justify-between bg-red-800 text-white rounded-t-lg">
                <div className="flex flex-col justify-center pl-6">
                    <h3
                        className={
                            "text-3xl font-semibold leading-6 text-white " +
                            poppins.className
                        }
                    >
                        Bubble Settings
                    </h3>
                    <p
                        className={
                            "mt-1 max-w-2xl text-sm text-gray-200 " +
                            lato.className
                        }
                    >
                        Change the settings of your bubble
                    </p>
                </div>
                
            </div>
            <div className="flex flex-col w-full h-full bg-white rounded-b-lg">
                {/* Update bubble's ticket email  */}
                <div className="flex flex-col w-full h-full p-4">
                    <label className={"text-xl font-medium text-gray-800 " + poppins.className}>
                        Ticket notification email:
                    </label>
                    <input
                        className={"w-full h-10 px-3 mt-2 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline focus:outline-red-800 " + poppins.className}
                        type="text"
                        placeholder="Enter your ticket email"
                        value={ticketEmail}
                        onChange={(e) => setTicketEmail(e.target.value)}
                    />
                    <button
                        className={"w-full h -10 px-4 py-2 mt-2 text-base text-white font-semibold bg-red-800 border rounded-lg focus:shadow-outline " + poppins.className + " disabled:opacity-80 disabled:cursor-not-allowed"}
                        onClick={() => !loading && isValidEmail(ticketEmail) && void updateTicketEmail()}
                        disabled={loading || ticketEmail === bubble.ticket_email || !isValidEmail(ticketEmail)}
                    >
                        {loading ? "Loading..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;