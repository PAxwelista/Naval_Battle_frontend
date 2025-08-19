import pusherJs from "pusher-js";

const pusherApiKey = process.env.NEXT_PUBLIC_PUSHER_API_KEY || "";

export const pusher = new pusherJs(pusherApiKey, {
    cluster: "eu",
});
