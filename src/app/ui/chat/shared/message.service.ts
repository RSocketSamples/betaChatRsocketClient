import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { ChatService } from './chat.service';
import { IMessageReceived, IMessageSend } from '../interfaces/message.interface';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  connection!: any;
  messages: IMessageReceived[] = [];
  messageSubject: BehaviorSubject<IMessageReceived[]> = new BehaviorSubject<IMessageReceived[]>([]);
  messageContent: string = '';

  myUser: IUser = {
    id: localStorage.getItem("userId"),
    nickname: localStorage.getItem("userNickname"),
    profileImage: localStorage.getItem("userProfileImage"),
  }

  constructor(private chatService: ChatService,
    ) {
      this.connectRsocketServer();
    }

  public getMessages() {
    return this.messages;
  }

  public getMessageStream(): Observable<IMessageReceived[]> {
    return this.messageSubject.asObservable();
  }

  async connectRsocketServer() {
    const clientRsocket = await this.chatService.rsocketServer();
    clientRsocket.connect()
    .subscribe({
      onComplete: (socket) => {
          this.connection = socket;
          this.setupMessageStream().subscribe(); // Suscribirse al observable aquí
      },
      onError: error => {
        console.log("Connection has been refused due to:: " + error);
      },
    });
  }

  public setupMessageStream(): Observable<IMessageReceived> {
    return new Observable<IMessageReceived>(observer => {
      this.connection.requestStream({
        metadata: String.fromCharCode('list.messages'.length) + 'list.messages'
      }).subscribe({
        onError: (error: string) => {
          console.log("Connection has been closed due to: " + error);
          observer.error(error); // Propagar error al observador
        },
        onNext: (payload: { data: IMessageReceived; }) => {
          console.log(payload.data);
          this.addMessage(payload.data);
          observer.next(payload.data); // Emitir el mensaje al observador
        },
        onSubscribe: (subscription: { request: (arg0: number) => void; }) => {
          subscription.request(1000000);
        },
      });
    });
  }

  addMessage(newMessage: IMessageReceived) {
    this.messages.push(newMessage);
    this.messageSubject.next([newMessage]);
  }

  async createMessage(data: IMessageSend) {
    await this.connection.fireAndForget({
      data: data,
      metadata: String.fromCharCode('create.message'.length) + 'create.message',
    });
  }
}
