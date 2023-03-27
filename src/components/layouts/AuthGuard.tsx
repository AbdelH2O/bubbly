import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Lottie from "lottie-react";
import loadingAnimation from "~/assets/loading.json";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const session = useSession();
    const router = useRouter();
    // TODO: Add a loading and redirecting components 

    if (session.status === "loading") {
        // return <div>Loading...</div>;
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="rounded-full overflow-hidden">
                    <Lottie animationData={loadingAnimation} className="w-40"/>
                </div>
            </div>
        )
    }
    if(session.status === "unauthenticated" && !router.pathname.includes("/api/auth") && router.pathname !== "/login") {
        void router.push("/api/auth/login");
        return <div>Redirecting...</div>;
    }

    if(session.status === "authenticated" && router.pathname.includes("/api/auth")) {
        void router.push("/");
        return <div>Redirecting...</div>;
    }
    
    return <>{children}</>;
};

export default AuthGuard;