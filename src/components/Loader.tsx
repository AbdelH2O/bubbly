import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useState } from "react";

const Loader = ({
    color = "#0e7490",
    startPosition = 0.3,
    stopDelayMs = 200,
    height = 5,
}: {
    color?: string,
    startPosition?: number,
    stopDelayMs?: number,
    height?: number,
}) => {
    const router = useRouter();
    const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);
    if(typeof window !== "undefined") {
        router.events.on("routeChangeStart", () => {
            NProgress.set(startPosition);
            NProgress.start();
        });
        router.events.on("routeChangeComplete", () => {
            NProgress.done(true);
            clearTimeout(timer);
            const tm = setTimeout(
                () => {
                    NProgress.done(true);
                },
                stopDelayMs
            );
            setTimer(tm);
        });
    }

    return (
        <style jsx global>{`
            #nprogress {
                pointer-events: none;
            }
            #nprogress .bar {
                background: ${color};
                position: fixed;
                z-index: 1031;
                top: 0;
                left: 0;
                width: 100%;
                height: ${height}px;
            }
            #nprogress .peg {
                display: block;
                position: absolute;
                right: 0px;
                width: 100px;
                height: 100%;
                box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
                opacity: 1;
                -webkit-transform: rotate(3deg) translate(0px, -4px);
                -ms-transform: rotate(3deg) translate(0px, -4px);
                transform: rotate(3deg) translate(0px, -4px);
            }
            #nprogress .spinner {
                display: "block";
                position: fixed;
                z-index: 1031;
                top: 15px;
                right: 15px;
            }
            #nprogress .spinner-icon {
                width: 18px;
                height: 18px;
                box-sizing: border-box;
                border: solid 2px transparent;
                border-top-color: ${color};
                border-left-color: ${color};
                border-radius: 50%;
                -webkit-animation: nprogresss-spinner 400ms linear infinite;
                animation: nprogress-spinner 400ms linear infinite;
            }
            .nprogress-custom-parent {
                overflow: hidden;
                position: relative;
            }
            .nprogress-custom-parent #nprogress .spinner,
            .nprogress-custom-parent #nprogress .bar {
                position: absolute;
            }
            @-webkit-keyframes nprogress-spinner {
                0% {
                    -webkit-transform: rotate(0deg);
                }
                100% {
                    -webkit-transform: rotate(360deg);
                }
            }
            @keyframes nprogress-spinner {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        `}</style>
    );
};

export default Loader;