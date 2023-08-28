import { IUser } from "./user.interface";

export interface IMessage {
    id: number;
    content: string;
    user: IUser;
    createdAt: string;
}