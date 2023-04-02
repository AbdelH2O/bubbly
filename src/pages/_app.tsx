import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "~/components/layouts/AuthGuard";
import { ToastContainer } from 'react-toastify';
import Loader from "~/components/Loader";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AuthGuard>
        <Loader />
        <Component {...pageProps} />
        <ToastContainer />
      </AuthGuard>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
