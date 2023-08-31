import { IUser } from "./user.interface";

export interface IMessageReceived {
    id: number;
    content: string;
    user: IUser;
    createdAt: string;
}

export interface IMessageSend {
    body: string;
    sender: string;
}