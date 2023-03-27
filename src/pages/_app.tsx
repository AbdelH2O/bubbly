import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "~/components/layouts/AuthGuard";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
