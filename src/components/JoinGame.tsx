import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiUrl } from "@/config";

const JoinGame=()=> {
    const router = useRouter()
    const [channels, setChannels] = useState({});
    useEffect(() => {
        (async () => {
            const response = await fetch(`${apiUrl}/pusher/channels`);
            const data = await response.json();
            setChannels(data.channels);
        })();
    }, []);
    const handleClick = async (channel : string) =>{
        console.log("channel :",channel)
        const response = await fetch(`${apiUrl}/pusher/joinGame`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({gameName :channel , playerName:"Axel"}),
        })
        const data :  {playerId : string} = await response.json()
        console.log(data)
        router.push(`game/${channel}/${data.playerId};true`);
    }
    console.log("channels :", channels);
    const Serveurs = Object.keys(channels).map((serveur: string) => <button key={serveur} onClick={()=>handleClick(serveur)}>{serveur}</button>);

    return <div>{Serveurs}</div>;
}

export {JoinGame}
