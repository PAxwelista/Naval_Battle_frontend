import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "../../i18next"

function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default App;
