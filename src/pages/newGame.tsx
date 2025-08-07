import Head from "next/head";
import { NewGame } from "@/components";

export default function NewGamePage() {
    return (
        <>
            <Head>
                <title>New game</title>
            </Head>
            <NewGame />
        </>
    );
}
