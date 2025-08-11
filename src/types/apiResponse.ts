export type ResultOrError<TSuccess = undefined> = { result: true; data: TSuccess } | { result: false; error: string };
export type ShootInfos = { shootSuccessfull: boolean; gameEnd: boolean };
export type PlayerId = { playerId: string };
export type Channels = { [channelName: string]: {} };
