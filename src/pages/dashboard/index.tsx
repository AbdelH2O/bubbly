import Layout from "~/components/layouts/HomeLayout";
import { Poppins, Lato } from "next/font/google";
import emptyAnimation from "~/assets/empty.json";
import Lottie from "lottie-react";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { Transition, Dialog } from "@headlessui/react";
import { useRouter } from "next/router";
import useCLient from "~/utils/sbClient";
import { toast } from "react-toastify";
import nProgress from "nprogress";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});
const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"] });

type Bubble = {
    name: string;
    id: string;
    description: string;
    // urls: number;
    created_at: string;
};

const Dashboard = () => {
    const router = useRouter();
    const supabase = useCLient();
    const [modal, setModal] = useState<boolean>(false);
    const [bubble, setBubble] = useState<Bubble>({
        name: "",
        id: "",
        description: "",
        created_at: new Date().toISOString(),
    });
    const [bubbles, setBubbles] = useState<Bubble[]>([]);

    const openModal = () => {
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
    };

    const addBubble = () => {
        void (async () => { 
            nProgress.set(0.3);
            nProgress.start();
            const {
                data,
                error,
            } = await supabase.from("bubble").insert({
                name: bubble.name,
                description: bubble.description,
            }).select();
            if (error) {
                toast.error("Something went wrong. Please try again later.");
            }
            if (data) {
                toast.success("Bubble added successfully");
                setBubbles([...bubbles, {
                    name: bubble.name,
                    description: bubble.description,
                    id: data[0]!.id,
                    created_at: data[0]!.created_at,
                }]);
                setBubble({
                    name: "",
                    description: "",
                    id: "",
                    created_at: "",
                });
                setModal(false);
            }
            nProgress.done();
        })();
    };

    const getBubbles = async () => {
        nProgress.set(0.3);
        nProgress.start();
        const { data, error } = await supabase
            .from("bubble")
            .select(`*`);
        if (error) {
            toast.error("Could not fetch bubbles. Please try again later.");
        }
        if (data) {
            const lis = Array.isArray(data) ? data : [data];
            console.log(lis);
            setBubbles(data);
        }
        nProgress.done();
    };

    useEffect(() => {
        void (
            async () => {
                await getBubbles();
            }
        )();
    }, []);

    return (
        <Layout>
            <header className="bg-red-50 shadow">
                <div className="mx-auto flex max-w-7xl flex-row justify-between py-6 px-4 sm:px-6 lg:px-8">
                    <h1
                        className={
                            "text-3xl font-normal tracking-tight text-black " +
                            poppins.className
                        }
                    >
                        Your Bubbles
                    </h1>
                    {/* Add new bubble button */}
                    <button
                        onClick={openModal}
                        className={
                            "rounded bg-red-800 p-2 pr-4 font-bold text-white transition-colors hover:bg-red-700 " +
                            poppins.className
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 inline-block h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 00-1 1v4H5a1 1 0 100 2h4v4a1 1 0 102 0v-4h4a1 1 0 100-2h-4V4a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Add New
                    </button>
                </div>
            </header>
            <Transition appear show={modal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className={"text-2xl font-bold leading-6 bg-red-800 text-white p-4 rounded-t-md " + poppins.className}
                                    >
                                        Add New Bubble
                                        <span className="float-right">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="inline-block h-5 w-5 float-right cursor-pointer"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                onClick={closeModal}
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                        <p className={"text-sm font-medium mt-1 text-gray-200 " + lato.className}>
                                            Create a new bubble to add content to.
                                        </p>
                                    </Dialog.Title>
                                    <div className="mt-4 px-6">
                                        <div className="mb-4">
                                            <label
                                                htmlFor="name"
                                                className={
                                                    "block text-sm font-medium text-gray-700 w-fit px-2 py-1 " +
                                                    poppins.className
                                                }
                                            >
                                                Name:
                                            </label>
                                            <div className="mt">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className={
                                                        "shadow-sm focus:ring-red-500 focus:border-red-500 block w-full border p-1 border-gray-300 rounded-md " +
                                                        lato.className
                                                    }
                                                    onChange={(e) => {
                                                        setBubble({
                                                            ...bubble,
                                                            name: e.target.value,
                                                        });
                                                    }}
                                                    placeholder="e.g. John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="description"
                                                className={
                                                    "block text-sm font-medium text-gray-700 w-fit px-2 py-1 " +
                                                    poppins.className
                                                }
                                            >
                                                Description:
                                            </label>
                                            <div className="mt-">
                                                <input
                                                    type="text"
                                                    name="description"
                                                    id="description"
                                                    className={
                                                        "shadow-sm focus:ring-red-500 focus:border-red-500 block w-full border p-1 border-gray-300 rounded-md " +
                                                        lato.className
                                                    }
                                                    onChange={(e) => {
                                                        setBubble({
                                                            ...bubble,
                                                            description: e.target.value,
                                                        });
                                                    }}
                                                    placeholder="e.g. Google's bubble"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 px-6 pb-6">
                                        <button
                                            type="button"
                                            className="inline-flex mr-4 justify-center rounded-md border border-transparent bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-red-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
                                            onClick={addBubble}
                                            disabled={bubble.name === "" || bubble.description === ""}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <main className="grow">
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    {bubbles.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {bubbles.map((bubble, i) => (
                                <div
                                    key={i}
                                    className="group cursor-pointer overflow-hidden rounded-lg bg-red-800 shadow transition-transform md:hover:-translate-y-2 md:hover:scale-105 md:hover:shadow-md"
                                    onClick={() => {
                                        void router.push(`/bubbles/${bubble.id}`);
                                    }}
                                >
                                    <div className="flex flex-row justify-start gap-4 px-4 py-5 sm:px-6">
                                        <Image
                                            className="aspect-square rounded-full bg-white shadow-md"
                                            src={
                                                `https://avatars.dicebear.com/api/micah/${bubble.name}.svg`
                                            }
                                            alt="bubble image"
                                            width={64}
                                            height={24}
                                        />
                                        <div className="flex flex-col">
                                            <h3
                                                className={
                                                    "text-xl font-semibold leading-6 text-white " +
                                                    poppins.className
                                                }
                                            >
                                                {bubble.name}
                                            </h3>
                                            <p
                                                className={
                                                    "mt-1 max-w-2xl rounded bg-red-700 px-1 text-sm text-white shadow " +
                                                    lato.className
                                                }
                                            >
                                                {bubble.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <dl>
                                            {/* <div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    URLs
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    {bubble.urls}
                                                </dd>
                                            </div> */}
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Created
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                    {new Date(
                                                        bubble.created_at
                                                    ).toLocaleDateString()}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center">
                            <div className="overflow-hidden rounded-full">
                                <Lottie
                                    animationData={emptyAnimation}
                                    className="w-40"
                                />
                            </div>
                            <h1
                                className={
                                    "text-center text-3xl font-normal tracking-tight text-black " +
                                    lato.className
                                }
                            >
                                You don&apos;t have any bubbles yet
                            </h1>
                        </div>
                    )}
                </div>
            </main>
        </Layout>
    );
};

export default Dashboard;
