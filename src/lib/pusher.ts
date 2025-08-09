import pusherJs from "pusher-js";

export const pusher = new pusherJs("1efb5cc2be2496875fb4", {
    cluster: "eu",
    channelAuthorization: { transport: "ajax", endpoint: "http://localhost:3000/pusher/auth" },
});