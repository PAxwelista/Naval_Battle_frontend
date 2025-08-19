import Head from "next/head";
import { Header, Home } from "@/components";

export default function Index() {
    return (
        <>
            <Head>
                <title>Naval Battle</title>
            </Head>
            <>
                <Header />
                <Home />
            </>
        </>
    );
}
