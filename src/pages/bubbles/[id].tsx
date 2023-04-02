import Layout from "~/components/layouts/HomeLayout";
import { Poppins, Lato } from "next/font/google";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import useCLient from "~/utils/sbClient";
import { toast } from "react-toastify";
import Image from "next/image";
import Navigation from "~/components/Navigation";
import Lottie from "lottie-react";
import emptyAnimation from "~/assets/empty.json";
import loadingAnimation from "~/assets/sloading.json";
import { Transition, Dialog } from "@headlessui/react";
import x from "~/assets/x.svg";
import check from "~/assets/check.svg";
import nProgress from "nprogress";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});
const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"] });

type Bubble = {
    id: string;
    name: string;
    description: string;
    created_at: string;
    info_entity:
        | {
              id: string;
              type: string;
              data: string;
              created_at: string;
              // 0: not processed, 1: getting processed, 2: processed
              processed: number;
          }[]
        | null;
};

type InfoEntity = {
    id?: string;
    type: string;
    data: string;
    created_at?: string;
    // 0: not processed, 1: getting processed, 2: processed
    processed: number;
};

const headers = ["Info", "URLs/texts", "Integration", "Try now!", "Settings"];

const BubblePage = () => {
    const router = useRouter();
    const supabase = useCLient();
    const { id } = router.query;
    const [bubble, setBubble] = useState<Bubble>({
        id: "",
        name: "",
        description: "",
        created_at: "",
        info_entity: null,
    });
    const [info, setInfo] = useState<InfoEntity>({
        type: "text",
        data: "",
        processed: 0,
    });
    const [modal, setModal] = useState<boolean>(false);

    const getBubble = async () => {
        nProgress.set(0.3);
        nProgress.start();
        const { data, error } = await supabase
            .from("bubble")
            .select(
                `
                *,
                info_entity (
                    *
                )
            `
            )
            .eq("id", id)
            .single();
        console.log(data);
        if (error) {
            toast.error(error.message);
        }
        if (data && !Array.isArray(data)) {
            const bubble = data;
            if (
                !data.info_entity ||
                (Array.isArray(data.info_entity) &&
                    data.info_entity.length === 0)
            ) {
                bubble.info_entity = [];
            }
            setBubble(bubble as Bubble);
            console.log(bubble);
        }
        nProgress.done();
    };

    useEffect(() => {
        if (id) {
            void getBubble();
        }
    }, [id]);

    const openModal = () => {
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
    };

    const addInfo = () => {
        void (
            async () => {
                nProgress.set(0.3);
                nProgress.start();
                const { data, error } = await supabase
                    .from("info_entity")
                    .insert({
                        type: info.type,
                        data: info.data,
                        bubble: bubble.id,
                    })
                    .select();
                    
                if (error) {
                    toast.error(error.message);
                }
                if (data && data.length > 0) {
                    toast.success("Info added successfully");
                    setInfo({
                        type: "text",
                        data: "",
                        processed: 0,
                    });
                    const entities = bubble.info_entity ? bubble.info_entity : [];
                    setBubble({
                        ...bubble,
                        info_entity: [...entities, data[0]!],
                    });
                    closeModal();
                }
                nProgress.done();
            }
        )();
    };

    return (
        <Layout>
            <header className="bg-red-50 shadow">
                <div className="mx-auto flex max-w-7xl flex-col items-start justify-start py-6 px-4 sm:px-6 lg:px-8">
                    <h1
                        className={
                            "text-3xl font-normal tracking-tight text-black " +
                            poppins.className
                        }
                    >
                        Bubble:{" "}
                        <span className="font-semibold text-red-700">
                            {bubble?.name}
                        </span>
                    </h1>
                    {/* <h4 className={"text-lg font-normal ml-4 tracking-tight text-gray-800 " + lato.className}>
                        {
                    </h4> */}
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="py-4">
                    <Navigation headers={headers}>
                        <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
                            <div className="flex flex-row gap-6 bg-red-800 px-4 py-5 sm:px-6">
                                <Image
                                    className="aspect-square rounded-full bg-white shadow-md"
                                    src={`https://avatars.dicebear.com/api/micah/${bubble?.name}.svg`}
                                    width={100}
                                    height={100}
                                    alt="Bubble"
                                />
                                <div className="flex flex-col justify-end">
                                    <h3
                                        className={
                                            "text-2xl font-medium leading-6 text-white " +
                                            poppins.className
                                        }
                                    >
                                        Bubble Info
                                    </h3>
                                    <p
                                        className={
                                            "mt-1 max-w-2xl text-sm text-gray-200 " +
                                            lato.className
                                        }
                                    >
                                        Personal details and application.
                                    </p>
                                </div>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt
                                            className={
                                                "text-md font-medium text-gray-500 " +
                                                lato.className
                                            }
                                        >
                                            Name
                                        </dt>
                                        <dd
                                            className={
                                                "mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 " +
                                                lato.className
                                            }
                                        >
                                            {bubble?.name}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt
                                            className={
                                                "text-md font-medium text-gray-500 " +
                                                lato.className
                                            }
                                        >
                                            Description
                                        </dt>
                                        <dd
                                            className={
                                                "mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 " +
                                                lato.className
                                            }
                                        >
                                            {bubble?.description}
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt
                                            className={
                                                "text-md font-medium text-gray-500 " +
                                                lato.className
                                            }
                                        >
                                            Created At
                                        </dt>
                                        <dd
                                            className={
                                                "mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 " +
                                                lato.className
                                            }
                                        >
                                            {bubble?.created_at}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-md sm:rounded-lg">
                            <Transition appear show={modal} as={Fragment}>
                                <Dialog
                                    as="div"
                                    className="relative z-10"
                                    onClose={closeModal}
                                >
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
                                                        className={
                                                            "rounded-t-md bg-red-800 p-4 text-2xl font-bold leading-6 text-white " +
                                                            poppins.className
                                                        }
                                                    >
                                                        Add New Bubble
                                                        <span className="float-right">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="float-right inline-block h-5 w-5 cursor-pointer"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                                onClick={
                                                                    closeModal
                                                                }
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </span>
                                                        <p
                                                            className={
                                                                "mt-1 text-sm font-medium text-gray-200 " +
                                                                lato.className
                                                            }
                                                        >
                                                            Create a new bubble
                                                            to add content to.
                                                        </p>
                                                    </Dialog.Title>
                                                    <div className="mt-4 px-6">
                                                        <div className="mb-4">
                                                            <label
                                                                htmlFor="type"
                                                                className={
                                                                    "block w-fit px-2 py-1 text-sm font-medium text-gray-700 " +
                                                                    poppins.className
                                                                }
                                                            >
                                                                Type:
                                                            </label>
                                                            <div className="mt">
                                                                <select
                                                                    id="type"
                                                                    name="type"
                                                                    className={
                                                                        "block w-full rounded-md border border-gray-300 p-1 shadow-sm focus:border-red-500 focus:ring-red-500 " +
                                                                        lato.className
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setInfo(
                                                                            {
                                                                                ...info,
                                                                                type: e
                                                                                    .target
                                                                                    .value,
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    <option value="text">
                                                                        Text
                                                                    </option>
                                                                    <option value="URL">
                                                                        URL
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="mb-4">
                                                            <label
                                                                htmlFor="description"
                                                                className={
                                                                    "block w-fit px-2 py-1 text-sm font-medium text-gray-700 " +
                                                                    poppins.className
                                                                }
                                                            >
                                                                {info.type ===
                                                                "text"
                                                                    ? "Text:"
                                                                    : "URL:"}
                                                            </label>
                                                            <div className="mt-">
                                                                <input
                                                                    type="text"
                                                                    name="description"
                                                                    id="description"
                                                                    className={
                                                                        "block w-full rounded-md border border-gray-300 p-1 shadow-sm focus:border-red-500 focus:ring-red-500 " +
                                                                        lato.className
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setInfo(
                                                                            {
                                                                                ...info,
                                                                                data: e
                                                                                    .target
                                                                                    .value,
                                                                            }
                                                                        );
                                                                    }}
                                                                    placeholder="e.g. Google's bubble"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 px-6 pb-6">
                                                        <button
                                                            type="button"
                                                            className="mr-4 inline-flex justify-center rounded-md border border-transparent bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-red-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75"
                                                            onClick={addInfo}
                                                            disabled={
                                                                info.type ===
                                                                    "" ||
                                                                info.data === ""
                                                            }
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
                            <div className="flex h-24 w-full flex-row justify-between bg-red-800 text-white">
                                <div className="flex flex-col justify-center pl-6">
                                    <h3
                                        className={
                                            "text-3xl font-semibold leading-6 text-white " +
                                            poppins.className
                                        }
                                    >
                                        URLs/texts
                                    </h3>
                                    <p
                                        className={
                                            "mt-1 max-w-2xl text-sm text-gray-200 " +
                                            lato.className
                                        }
                                    >
                                        URLs and texts that you want to save.
                                    </p>
                                </div>
                                {/* Add new URL/text button */}
                                <button
                                    className={
                                        "my-auto mr-6 rounded bg-white py-2 px-4 font-bold text-red-800 hover:bg-red-50 " +
                                        poppins.className
                                    }
                                    onClick={openModal}
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
                                    Add new
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-4 p-4">
                                {!bubble?.info_entity ||
                                bubble.info_entity.length == 0 ? (
                                    <div className="col-span-4">
                                        <div className="sha dow-md mx-auto w-fit overflow-hidden bg-white sm:rounded-lg">
                                            <div className="flex flex-row gap-6 px-4 py-5 sm:px-6">
                                                <div className="mx-auto flex flex-col items-center justify-end">
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
                                                        No URLs/texts
                                                    </h3>
                                                    <p
                                                        className={
                                                            "mt-1 max-w-2xl text-sm text-gray-800 " +
                                                            lato.className
                                                        }
                                                    >
                                                        You haven&apos;t added
                                                        any URLs/texts yet.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    bubble?.info_entity.map((info, index) => (
                                        <div
                                            className="overflow-hidden bg-white shadow-md sm:rounded-lg"
                                            key={index}
                                        >
                                            <div className="flex flex-row gap-6 bg-red-800 px-2 py-5 sm:px-4">
                                                <div className="flex flex-row justify-between items-center w-full">
                                                    <h3
                                                        className={
                                                            "text-2xl font-medium leading-6 text-white " +
                                                            poppins.className
                                                        }
                                                    >
                                                        {info?.type.charAt(0).toUpperCase() + info?.type.slice(1)}
                                                    </h3>
                                                    {/* Process button */}
                                                    <button
                                                        className={
                                                            "my-auto disabled:brightness-90 disabled:cursor-not-allowed rounded bg-white py-2 px-4 font-bold text-red-800 hover:bg-red-50 " +
                                                            poppins.className
                                                        }
                                                        disabled={true}
                                                        // onClick={startProcessing}
                                                    >
                                                        Process
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="border-t border-gray-200">
                                                <dl>
                                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                        <dt
                                                            className={
                                                                "text-md font-medium text-gray-500 " +
                                                                lato.className
                                                            }
                                                        >
                                                            {
                                                                info?.type.charAt(0).toUpperCase() +
                                                                info?.type.slice(1)
                                                            }
                                                        </dt>
                                                        <dd
                                                            className={
                                                                "mt-1 mx-auto flex items-start text-sm text-gray-900 sm:col-span-2 sm:mt-0 " +
                                                                lato.className
                                                            }
                                                        >
                                                            {info?.data}
                                                        </dd>
                                                    </div>
                                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                        <dt
                                                            className={
                                                                "text-md font-medium text-gray-500 " +
                                                                lato.className
                                                            }
                                                        >
                                                            Processed
                                                        </dt>
                                                        <dd
                                                            className={
                                                                "mt-1 mx-auto text-sm text-gray-900 sm:col-span-2 sm:mt-0 " +
                                                                lato.className
                                                            }
                                                        >
                                                            {
                                                                info?.processed === 0 ? (
                                                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                                                    <Image src={x} width={20} height={20} alt="x mark" />
                                                                ) : (
                                                                    info?.processed === 2 ? (
                                                                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                                                        <Image src={check} width={20} height={20} alt="check mark" />
                                                                    ) : (
                                                                        <Lottie animationData={loadingAnimation} className="w-6" />
                                                                    )
                                                                )
                                                            }
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </Navigation>
                </div>
            </main>
        </Layout>
    );
};

export default BubblePage;
