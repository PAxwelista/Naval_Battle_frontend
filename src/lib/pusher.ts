import Pusher from "pusher-js";
import pusherJs from "pusher-js";

const pusherApiKey = process.env.NEXT_PUBLIC_PUSHER_API_KEY || "";

let pusher: Pusher | null = null;

export const getPusher = () => {
    console.log("ehre")
    if (!pusher) {
        pusher = new pusherJs(pusherApiKey, { cluster: "eu" });
    }

    return pusher;
};
