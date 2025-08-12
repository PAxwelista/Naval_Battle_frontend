export type ResultOrError<TSuccess = undefined> = { result: true; data: TSuccess } | { result: false; error: string };
export type ShootInfos = { shootSuccessfull: boolean; gameEnd: boolean };
export type PlayerId = { playerId: string };
type Player = { name: string; boardGame: {}; id: string };
export type Game = {
    gameName: string;
    firstPlayer: Player;
    secondPlayer: Player | undefined;
    isFirstPlayerTurn: boolean;
};
