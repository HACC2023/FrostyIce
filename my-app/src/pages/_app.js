import SideNavbar from "@/components/navbar/SideNavbar";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import DialogflowChatWidget from "@/components/chatbot/DialogflowChatWidget";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <>
      <SessionProvider session={session}>
        <div
          className="flex flex-col lg:flex-row min-h-screen text-primary bg-gradient-to-br from-slate-800 via-cyan-900 to-sky-950"
        >
          {<SideNavbar />}
          <div className="flex-1">
            <Component {...pageProps} />
          </div>
          <ToastContainer />
          <DialogflowChatWidget />
        </div>
      </SessionProvider>
    </>
  );
};

export default App;
