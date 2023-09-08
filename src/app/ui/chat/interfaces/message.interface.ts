import { IUser } from "./user.interface";

export interface IMessageReceived {
    id: string;
    body: string;
    sender: IUser;
    createdAt: string;
}

export interface IMessageSend {
    body: string;
    sender: string | null;
}