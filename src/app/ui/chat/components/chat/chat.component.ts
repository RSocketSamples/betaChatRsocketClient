import { Component, OnInit } from '@angular/core';
import { IMessageSend, IMessageReceived } from '../../interfaces/message.interface';
import { IUser } from '../../interfaces/user.interface';
import { Subscription  } from 'rxjs';
import { ChatService } from '../../shared/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  connection!: any;
  messageSubscription!: Subscription;
  isOnline: string = 'warn';
  chatTitle: string = 'Chapter Integración';
  messageContent: string = '';

  myUser: IUser = {
    id: localStorage.getItem("userId"),
    nickname: localStorage.getItem("userNickname"),
    profileImage: localStorage.getItem("userProfileImage"),
  }

  messages: IMessageReceived[] = [];

  received_messages = new Map();


  constructor(private chatService: ChatService,
    private router: Router) { }

  ngOnInit(): void {
    this.connectRsocketServer();
  }


  async connectRsocketServer() {

      function sleep(ms: number | undefined) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const clientRsocket = await this.chatService.rsocketServer();
    clientRsocket.connect()
    .subscribe({
      onComplete: async (socket) => {
          this.connection = socket;
          this.isOnline = 'primary';
          while (true) {
            this.setupMessageStream();
            await sleep(500);
          }
      },
      onError: error => {
        console.log("Connection has been refused due to:: " + error);
      },
    });
  }

  private setupMessageStream() {

    // this.messages = [];

    this.messageSubscription = this.connection.requestStream({
      metadata: String.fromCharCode('list.messages'.length)+ 'list.messages'
    }).subscribe({
      onComplete: () => console.log('complete'),
      onError: (error: string) => {
        console.log("Connection has been closed due to:: " + error);
      },
      onNext: (payload: { data: IMessageReceived; }) => {

        if (!this.received_messages.has(payload.data.id)) {
          this.addMessage(payload.data);
        }

        },
        onSubscribe: (subscription: { request: (arg0: number) => void; }) => {
          subscription.request(1);
        },
    });
  }

  async sendMessage() {
    if (this.messageContent.trim() !== '') {
      let message: IMessageSend = {
        body: this.messageContent,
        sender: this.myUser.nickname
      };

      console.log("sending message:" + this.messageContent);
      await this.createMessage(message);
      this.messageContent = '';
    } else {
      console.log('Campo de entrada vacío, el mensaje no se enviará.');
    }
  }

  async createMessage(data: IMessageSend) {
    await this.connection.requestResponse({
      data: data,
      metadata: String.fromCharCode('create.message'.length) + 'create.message',
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.setupMessageStream();
  }

  addMessage(newMessage: IMessageReceived) {
    this.messages = [...this.messages, newMessage];
    this.received_messages.set(newMessage.id, newMessage);
  }

  logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("userNickname");
    localStorage.removeItem("userProfileImage");
    this.router.navigate(['']);
  }
}
