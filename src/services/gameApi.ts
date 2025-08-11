import { apiUrl } from "@/config";
import { ResultOrError, Grid, Pos, ShootInfos, PlayerId, Channels } from "@/types";

const endGame = async (gameName: string): Promise<ResultOrError> => {
    const response = await fetch(`${apiUrl}/pusher/endGame`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameName }),
    });
    
    const data = (await response.json()) as ResultOrError;
    console.log(data)
    return data;
};

const initialiseBoard = async (gameName: string, playerId: string, board: Grid): Promise<ResultOrError> => {
    const response = await fetch(`${apiUrl}/pusher/initialiseBoard`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameName, playerId, board }),
    });
    const data = (await response.json()) as ResultOrError;
    return data;
};

const shoot = async (gameName: string, playerId: string, shootPos: Pos): Promise<ResultOrError<ShootInfos>> => {
    const response = await fetch(`${apiUrl}/pusher/shoot`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameName, playerId, shootPos }),
    });
    const data = (await response.json()) as ResultOrError<ShootInfos>;
    return data;
};

const getChannels = async (): Promise<ResultOrError<Channels>> => {
    const response = await fetch(`${apiUrl}/pusher/channels`);
    const data = (await response.json()) as ResultOrError<Channels>;
    return data;
};

const joinGame = async (gameName: string, playerName: string): Promise<ResultOrError<PlayerId>> => {
    const response = await fetch(`${apiUrl}/pusher/joinGame`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameName, playerName }),
    });
    const data = (await response.json()) as ResultOrError<PlayerId>;

    return data;
};

const newGame = async (gameName: string, playerName: string): Promise<ResultOrError<PlayerId>> => {
    const response = await fetch(`${apiUrl}/pusher/newGame`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameName, playerName }),
    });
    const data = (await response.json()) as Promise<ResultOrError<PlayerId>>;
    return data;
};

export const gameApiServices = { endGame, initialiseBoard, shoot, getChannels, joinGame, newGame };
