import { useEffect } from "react";
import { pusher } from "@/lib/pusher";

export const usePusherChannel = (
    channelName: string,
    eventNames: string[],
    onEvents: ((message: Record<string,string>) => void)[]
) => {
    useEffect(() => {
        const channel = pusher.subscribe(channelName);

        eventNames.forEach((eventName, i) => {
            if (onEvents[i]) channel.bind(eventName, onEvents[i]);
        });

        return () => {
            eventNames.forEach((eventName, i) => {
                if (onEvents[i]) channel.unbind(eventName, onEvents[i]);
            });
            pusher.unsubscribe(channelName);
        };
    }, [channelName, eventNames, onEvents]);
};
