import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Lottie from "lottie-react";
import loadingAnimation from "~/assets/loading.json";
import nProgress from "nprogress";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const session = useSession();
    const router = useRouter();
    // TODO: Add a loading and redirecting components 

    if (session.status === "loading") {
        // return <div>Loading...</div>;
        if(typeof window !== "undefined") {
            // nProgress.configure({ showSpinner: false });
            nProgress.set(0.3);
            nProgress.start();
        }
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="rounded-full overflow-hidden">
                    <Lottie animationData={loadingAnimation} className="w-40"/>
                </div>
            </div>
        )
    }
    if(session.status === "unauthenticated" && !router.pathname.includes("/api/auth") && router.pathname !== "/signin") {
        void router.push("/api/auth/signin");
        return <div>Redirecting...</div>;
    }

    if(session.status === "authenticated" && router.pathname.includes("/api/auth")) {
        void router.push("/");
        return <div>Redirecting...</div>;
    }
    if(typeof window !== "undefined"){
        nProgress.done();
    }
    return <>{children}</>;
};

export default AuthGuard;