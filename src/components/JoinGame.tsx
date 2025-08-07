import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import uid from "uid2"

const JoinGame=()=> {
    const router = useRouter()
    const [channels, setChannels] = useState({});
    useEffect(() => {
        (async () => {
            const response = await fetch("http://localhost:3000/pusher/channels");
            const data = await response.json();
            setChannels(data.channels);
        })();
    }, []);
    const handleClick = (channel : string) =>{
        router.push(`game/${channel.substring(9)}/${uid(10)}`);
    }
    console.log("channels :", channels);
    const Serveurs = Object.keys(channels).map((serveur: string) => <button key={serveur} onClick={()=>handleClick(serveur)}>{serveur}</button>);

    return <div>{Serveurs}</div>;
}

export {JoinGame}
