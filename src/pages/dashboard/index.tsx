import Layout from "~/components/layouts/HomeLayout";
import { Poppins, Lato } from "next/font/google";
import emptyAnimation from "~/assets/empty.json";
import Lottie from "lottie-react";
import { useState } from "react";
import Image from "next/image";

const poppins = Poppins({ subsets: ['latin'], weight: ["400", "500", "600", "700"] });
const lato = Lato({ subsets: ['latin'], weight: ["400", "700", "900"] });

type Bubble = {
    name: string;
    description: string;
    urls: number;
    createdAt: string;
}

const Dashboard = () => {
    const [bubbles, setBubbles] = useState<Bubble[]>([
        {
            name: "Steve",
            description: "Google Bot",
            urls: 3,
            createdAt: "2021-08-01T00:00:00.000Z"
        }
    ]);
    return (
        <Layout>
            <header className="bg-red-50 shadow">
                <div className="mx-auto flex max-w-7xl flex-row justify-between py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className={"text-3xl font-normal tracking-tight text-black " + poppins.className}>
                        Your Bubbles
                    </h1>
                    {/* Add new bubble button */}
                    <button className={"rounded bg-red-800 p-2 pr-4 font-bold text-white transition-colors hover:bg-red-700 " + poppins.className}>
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
            <main className="grow">
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    {
                        bubbles.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4">
                                {bubbles.map((bubble, i) => (
                                    <div key={i} className="bg-red-800 shadow overflow-hidden rounded-lg group hover:-translate-y-2 hover:scale-105 hover:shadow-md cursor-pointer transition-transform">
                                        <div className="px-4 py-5 sm:px-6 flex flex-row justify-start gap-4">
                                            <Image className="bg-white rounded-full aspect-square shadow-md" src={"https://avatars.dicebear.com/api/micah/9.svg"} alt="bubble image" width={64} height={24} />
                                            <div className="flex flex-col">
                                                <h3 className={"text-xl leading-6 font-semibold text-white " + poppins.className}>
                                                    {bubble.name}
                                                </h3>
                                                <p className={"mt-1 max-w-2xl text-sm bg-red-700 shadow rounded px-1 text-white " + lato.className}>
                                                    {bubble.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-200">
                                            <dl>
                                                <div className="bg-gray-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        URLs
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        {bubble.urls}
                                                    </dd>
                                                </div>
                                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Created At
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        {new Date(bubble.createdAt).toLocaleDateString()}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="rounded-full overflow-hidden">
                                    <Lottie animationData={emptyAnimation} className="w-40"/>
                                </div>
                                <h1 className={"text-3xl text-center font-normal tracking-tight text-black " + lato.className}>
                                    You don&apos;t have any bubbles yet
                                </h1>
                            </div>
                        )
                    }
                </div>
            </main>
        </Layout>
    );
};

export default Dashboard;
