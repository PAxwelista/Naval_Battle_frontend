import Head from "next/head";
import { Header, NewGame } from "@/components";

export default function NewGamePage() {
    return (
        <>
            <Head>
                <title>New game</title>
            </Head>
            <>
                <Header />
                <NewGame />
            </>
        </>
    );
}
