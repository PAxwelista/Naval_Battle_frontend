import { useEffect } from "react";
import { pusher } from "@/lib/pusher";

export const usePusherChannel = (channelName: string , eventName : string , onEvent : (message :string)=>void) => {
    console.log(channelName)
    useEffect(() => {
        const channel = pusher.subscribe("" + channelName);

        channel.bind(eventName, onEvent);

        return () => {
            
            channel.unbind(eventName, onEvent);
            pusher.unsubscribe("" + channelName);
            channel.disconnect();
        };
    }, [channelName, eventName, onEvent]);

};
