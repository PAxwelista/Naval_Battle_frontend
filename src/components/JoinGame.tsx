import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { gameApiServices } from "@/services";
import { Channels } from "@/types";

const JoinGame = () => {
    const router = useRouter();
    const [channels, setChannels] = useState<Channels>({});
    const [message, setMessage] = useState<string>("");
console.log(channels)
    useEffect(() => {
        (async () => {
            const response = await gameApiServices.getChannels();
            if (!response.result) return setMessage(`Erreur : ${response.error}`);
            setChannels(response.data);
        })();
    }, []);
    const handleClick = async (channel: string) => {
        const response = await gameApiServices.joinGame(channel, "Axel");

        if (!response.result) return setMessage(`Erreur : ${response.error}`);
        router.push(`game/${channel}/${response.data.playerId};true`);
    };

    const Serveurs = Object.keys(channels).map((serveur: string) => (
        <button
            key={serveur}
            onClick={() => handleClick(serveur)}
        >
            {serveur}
        </button>
    ));

    return (
        <div>
            {message}
            <div>{Serveurs}</div>
        </div>
    );
};

export { JoinGame };
