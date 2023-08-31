import { Component, OnInit } from '@angular/core';
import { IMessageSend, IMessageReceived } from '../../interfaces/message.interface';
import { IUser } from '../../interfaces/user.interface';
import { IdentitySerializer, JsonSerializer, RSocketClient } from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  clientRsocket = new RSocketClient({
    serializers: {
      data: JsonSerializer,
      metadata: IdentitySerializer,
    },
    setup: {
      keepAlive: 60000,
      lifetime: 180000,
      dataMimeType: 'application/json',
      metadataMimeType: 'message/x.rsocket.routing.v0',
    },
    transport: new RSocketWebSocketClient({ url: 'ws://localhost:1409' }),
  });

  connection!: any;
  sub = new Subject();
  isOnline: boolean = false;
  chatTitle: string = 'Chapter Integración';
  messageContent: string = '';

  message = '';

  senderUser: IUser = {
    id: 1,
    name: 'Jhoan Gonzalez',
    nickname: "jhoan.gonzalez",
    profileImage: 'assets/perfil-sender.jpg',
  }

  receiverUser: IUser = {
    id: 2,
    name: 'Brayan Herrera',
    nickname: "brayan.herrera",
    profileImage: 'assets/perfil-image.jpg',
  }

  messages: IMessageReceived[] = [
    {
      id: 1,
      content: 'Hola, ¿Cómo estás?',
      user: this.senderUser,
      createdAt: '10:00 AM'
    },
    {
      id: 2,
      content: 'Hola Jhoan, muy bien y tú?',
      user: this.receiverUser,
      createdAt: '10:05 AM'
    },
    {
      id: 3,
      content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem veritatis mollitia, saepe enim quo, adipisci libero molestiae unde nostrum voluptas quas quidem facilis repellendus laborum iure! Rem id autem reiciendis?',
      user: this.receiverUser,
      createdAt: '10:07 AM'
    },
    {
      id: 4,
      content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem veritatis mollitia, saepe enim quo, adipisci libero molestiae unde nostrum voluptas quas quidem facilis repellendus laborum iure! Rem id autem reiciendis?',
      user: this.senderUser,
      createdAt: '10:10 AM'
    },
    {
      id: 5,
      content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem veritatis mollitia, saepe enim quo, adipisci libero molestiae unde nostrum voluptas quas quidem facilis repellendus laborum iure! Rem id autem reiciendis?',
      user: this.receiverUser,
      createdAt: '10:07 AM'
    },
    {
      id: 6,
      content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem veritatis mollitia, saepe enim quo, adipisci libero molestiae unde nostrum voluptas quas quidem facilis repellendus laborum iure! Rem id autem reiciendis?',
      user: this.senderUser,
      createdAt: '10:10 AM'
    },
    {
      id: 7,
      content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem veritatis mollitia, saepe enim quo, adipisci libero molestiae unde nostrum voluptas quas quidem facilis repellendus laborum iure! Rem id autem reiciendis?',
      user: this.senderUser,
      createdAt: '10:10 AM'
    },
    {
      id: 8,
      content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem veritatis mollitia, saepe enim quo, adipisci libero molestiae unde nostrum voluptas quas quidem facilis repellendus laborum iure! Rem id autem reiciendis?',
      user: this.receiverUser,
      createdAt: '10:07 AM'
    },
    {
      id: 9,
      content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem veritatis mollitia, saepe enim quo, adipisci libero molestiae unde nostrum voluptas quas quidem facilis repellendus laborum iure! Rem id autem reiciendis?',
      user: this.senderUser,
      createdAt: '10:10 AM'
    },
  ];

  ngOnInit(): void {
    this.connectRsocketServer();
  }

  async connectRsocketServer() { 
    this.connection = await this.clientRsocket.connect()
    .subscribe({
      onComplete: (socket) => {
          this.isOnline = true;

          socket.requestStream({
            metadata: String.fromCharCode('list.messages'.length)+ 'list.messages'
          }).subscribe({
              onComplete: () => console.log('complete'),
              onError: error => {
                console.log("Connection has been closed due to:: " + error);
              },
              onNext: payload => {
                console.log(payload);
                // this.addMessage(payload.data);
              },
              onSubscribe: subscription => {
                subscription.request(1000000);
              },
          });

          this.sub.subscribe({
            next: (data) => {
              socket.fireAndForget({
                data: data,
                metadata: String.fromCharCode('create.message'.length) + 'create.message',
              });
            }
          });
      },
      onError: error => {
        console.log("Connection has been refused due to:: " + error);
      },
    });
  }

  async sendMessage() {
    let message: IMessageSend = {
      body: this.messageContent,
      sender: 'jhoan.gonzalez'
    };
    console.log("sending message:" + this.messageContent);
    this.sub.next(message);
    this.message = '';
  }
}