import Head from "next/head";
import { Game } from "@/components";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function GamePage() {
    const router = useRouter();
    const game = router.query.game as string;
    const playerIdAndIsJoining = router.query.playerIdAndIsJoining as string;
    return (
        <>
            <Head>
                <title>Game</title>
            </Head>
            {game ? (
                <Game
                    gameName={game}
                    playerId={playerIdAndIsJoining.split(";")[0]}
                    isJoining={playerIdAndIsJoining.split(";")[1]}
                />
            ) : (
                <div>Chargement de la page impossible</div>
            )}
        </>
    );
}
