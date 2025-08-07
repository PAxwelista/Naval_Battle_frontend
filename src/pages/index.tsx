import Head from "next/head";
import { Home } from "@/components";

export default function Index() {
    return (
        <>
            <Head>
                <title>Naval Battle</title>
            </Head>
            <Home />
        </>
    );
}
