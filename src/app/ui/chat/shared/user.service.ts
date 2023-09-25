import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user.interface';
import { Subject } from 'rxjs';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  connection!: any;
  users: IUser[] = [];
  userSubject: Subject<IUser> = new Subject<IUser>();

  constructor(private chatService: ChatService,
    ) {
      this.connectRsocketServer();
    }

  async connectRsocketServer() {
    const clientRsocket = await this.chatService.rsocketServer();
    clientRsocket.connect()
    .subscribe({
      onComplete: (socket) => {
          this.connection = socket;
          this.setupUserStream();
      },
      onError: error => {
        console.log("Connection has been refused due to:: " + error);
      },
    });
  }

  public getUserStream() {
    return this.userSubject.asObservable();
  }

  private setupUserStream() {
    this.connection.requestStream({
      metadata: String.fromCharCode('list.user'.length)+ 'list.user'
    }).subscribe({
        onError: (error: string) => {
          console.log("Connection has been closed due to:: " + error);
        },
        onNext: (payload: { data: IUser }) => {
          this.addUser(payload.data);
          this.userSubject.next(payload.data);
        },
        onSubscribe: (subscription: { request: (arg0: number) => void; }) => {
          subscription.request(1000000);
        },
    });
  }

  private addUser(user: IUser) {
    this.users.push(user);
  }
}
