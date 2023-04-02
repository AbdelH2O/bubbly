import { Tab } from "@headlessui/react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const Navigation = ({ headers, children }: { headers: string[], children: JSX.Element[] }) => {
    return (
        <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-red-800/90 p-1">
                {/* {Object.keys(categories).map((category) => (
                    <Tab
                        key={category}
                        className={({ selected }) =>
                            classNames(
                                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-red-700",
                                "ring-white ring-opacity-60 ring-offset-2 ring-offset-red-400 focus:outline-none focus:ring-2",
                                selected
                                    ? "bg-white shadow"
                                    : "text-red-100 hover:bg-white/[0.12] hover:text-white"
                            )
                        }
                    >
                        {category}
                    </Tab>
                ))} */}
                {headers.map((header) => (
                    <Tab
                        key={header}
                        className={({ selected }) =>
                            classNames(
                                "w-full rounded-lg py-2.5 text-md font-semibold leading-5 text-red-700",
                                "ring-white ring-opacity-60 ring-offset ring-offset-red-400 focus:outline-none focus:ring-2",
                                selected
                                    ? "bg-white shadow"
                                    : "!text-red-50 hover:bg-white/[0.12] hover:text-white",
                                poppins.className
                            )
                        }
                    >
                        {header}
                    </Tab>
                ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
                {
                    children.map((child, idx) => (
                        <Tab.Panel
                            key={idx}
                            className={classNames(
                                "rounded-xl bg-white p-3"
                            )}
                        >
                            {child}
                        </Tab.Panel>
                    ))
                }
                {/* {Object.values(categories).map((posts, idx) => (
                    <Tab.Panel
                        key={idx}
                        className={classNames(
                            "rounded-xl bg-white p-3",
                            "ring-white ring-opacity-60 ring-offset-2 ring-offset-red-400 focus:outline-none focus:ring-2"
                        )}
                    >
                        <ul>
                            {posts.map((post) => (
                                <li
                                    key={post.id}
                                    className="relative rounded-md p-3 hover:bg-gray-100"
                                >
                                    <h3 className="text-sm font-medium leading-5">
                                        {post.title}
                                    </h3>

                                    <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                                        <li>{post.date}</li>
                                        <li>&middot;</li>
                                        <li>{post.commentCount} comments</li>
                                        <li>&middot;</li>
                                        <li>{post.shareCount} shares</li>
                                    </ul>

                                    <a
                                        href="#"
                                        className={classNames(
                                            "absolute inset-0 rounded-md",
                                            "ring-red-400 focus:z-10 focus:outline-none focus:ring-2"
                                        )}
                                    />
                                </li>
                            ))}
                        </ul>
                    </Tab.Panel>
                ))} */}
            </Tab.Panels>
        </Tab.Group>
    );
};

export default Navigation;
