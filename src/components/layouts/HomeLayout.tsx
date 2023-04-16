import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Link from "next/link";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const user = {
    name: "Tom Cook",
    email: "tom@example.com",
    imageUrl: "https://avatars.dicebear.com/api/micah/4.svg",
};
// const userNavigation = [
    //     { name: "Your Profile", href: "#" },
    //     { name: "Settings", href: "#" },
    //     { name: "Sign out", href: "#" },
    // ];
    
    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(" ");
    }
    
    export default function Layout({ children }: { children: React.ReactNode }) {
        const router = useRouter();
        const navigation = [
            { name: "Dashboard", href: "/dashboard", current: router.route === "/dashboard" },
            // { name: "Team", href: "#", current: false },
            // { name: "Projects", href: "#", current: false },
            // { name: "Calendar", href: "#", current: false },
            // { name: "Reports", href: "#", current: false },
        ];
    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-red-100">
        <body class="h-full">
        ```
      */}
            <div className="h-screen">
                <Disclosure as="nav" className="bg-red-800">
                    {({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 items-center justify-between">
                                    <div className="flex items-center">
                                        <div
                                            className={
                                                "flex-shrink-0 cursor-pointer select-none text-3xl font-bold text-white " +
                                                poppins.className
                                            }
                                            onClick={() =>
                                                void router.push("/")
                                            }
                                        >
                                            {/* <Image
                                                className="h-8 w-8"
                                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                                alt="Your Company"
                                            /> */}
                                            BBLY
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="ml-10 flex items-baseline space-x-4">
                                                {navigation.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className={classNames(
                                                            item.current
                                                                ? "bg-red-900 text-white"
                                                                : "text-red-300 hover:bg-red-700 hover:text-white",
                                                            "rounded-md px-3 py-2 text-sm font-medium"
                                                        )}
                                                        aria-current={
                                                            item.current
                                                                ? "page"
                                                                : undefined
                                                        }
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            {/* <button
                                                type="button"
                                                className="rounded-full bg-red-800 p-1 text-red-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-800"
                                            >
                                                <span className="sr-only">
                                                    View notifications
                                                </span>
                                                <BellIcon
                                                    className="h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            </button> */}

                                            {/* Profile dropdown */}
                                            <Menu
                                                as="div"
                                                className="relative ml-3"
                                            >
                                                <div>
                                                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-red-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-800">
                                                        <span className="sr-only">
                                                            Open user menu
                                                        </span>
                                                        <Image
                                                            className="h-8 w-8 rounded-full"
                                                            height={32}
                                                            width={32}
                                                            src={user.imageUrl}
                                                            alt=""
                                                        />
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    className={classNames(
                                                                        active
                                                                            ? "bg-red-100"
                                                                            : "",
                                                                        "block px-4 py-2 text-sm text-red-700"
                                                                    )}
                                                                    href="mailto:support@getbubblyai.com"
                                                                >
                                                                    Support
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    className={classNames(
                                                                        active
                                                                            ? "bg-red-100"
                                                                            : "",
                                                                        "block px-4 py-2 text-sm text-red-700"
                                                                    )}
                                                                    onClick={() => {
                                                                        void signOut();
                                                                    }}
                                                                >
                                                                    Signout
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                        {/* {userNavigation.map(
                                                            (item) => (
                                                                <Menu.Item
                                                                    key={
                                                                        item.name
                                                                    }
                                                                    onClick={}
                                                                >
                                                                    {({
                                                                        active,
                                                                    }) => (
                                                                        <a
                                                                            href={
                                                                                item.href
                                                                            }
                                                                            className={classNames(
                                                                                active
                                                                                    ? "bg-red-100"
                                                                                    : "",
                                                                                "block px-4 py-2 text-sm text-red-700"
                                                                            )}
                                                                        >
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </a>
                                                                    )}
                                                                </Menu.Item>
                                                            )
                                                        )} */}
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </div>
                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-red-800 p-2 text-red-400 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-800">
                                            <span className="sr-only">
                                                Open main menu
                                            </span>
                                            {open ? (
                                                <XMarkIcon
                                                    className="block h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <Bars3Icon
                                                    className="block h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>

                            <Disclosure.Panel className="md:hidden">
                                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                                    {navigation.map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            className={classNames(
                                                item.current
                                                    ? "bg-red-900 text-white"
                                                    : "text-red-300 hover:bg-red-700 hover:text-white",
                                                "block rounded-md px-3 py-2 text-base font-medium"
                                            )}
                                            aria-current={
                                                item.current
                                                    ? "page"
                                                    : undefined
                                            }
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))}
                                </div>
                                <div className="border-t border-red-700 pt-4 pb-3">
                                    <div className="flex items-center px-5">
                                        <div className="flex-shrink-0">
                                            <Image
                                                className="h-10 w-10 rounded-full"
                                                height={40}
                                                width={40}
                                                src={user.imageUrl}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium leading-none text-white">
                                                {user.name}
                                            </div>
                                            <div className="text-sm font-medium leading-none text-red-400">
                                                {user.email}
                                            </div>
                                        </div>
                                        {/* <button
                                            type="button"
                                            className="ml-auto flex-shrink-0 rounded-full bg-red-800 p-1 text-red-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-800"
                                        >
                                            <span className="sr-only">
                                                View notifications
                                            </span>
                                            <BellIcon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        </button> */}
                                    </div>
                                    <div className="mt-3 space-y-1 px-2">
                                        <Disclosure.Button
                                            as="a"
                                            className="block rounded-md px-3 py-2 text-base font-medium text-red-400 hover:bg-red-700 hover:text-white"
                                            onClick={() => {
                                                void signOut();
                                            }}
                                        >
                                            Signout
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
                {children}
            </div>
        </>
    );
}
