import { Component } from '@angular/core';
import { IMessage } from '../../interfaces/message.interface';
import { IUser } from '../../interfaces/user.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  isOnline: boolean = true;
  chatTitle: string = 'Chapter Integración';

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

  messages: IMessage[] = [
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
  ];
}
