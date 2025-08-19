import Head from "next/head";
import { Header, JoinGame } from "@/components";

export default function JoinGamePage() {
    return (
        <>
            <Head>
                <title>Join game</title>
            </Head>
            <>
                <Header />
                <JoinGame />
            </>
        </>
    );
}
