import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { IMessageSend, IMessageReceived } from '../../interfaces/message.interface';
import { IUser } from '../../interfaces/user.interface';
import { Router } from '@angular/router';
import { MessageService } from '../../shared/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  connection!: any;
  isOnline: string = 'warn';
  chatTitle: string = 'Chapter Integración';
  messageContent: string = '';
  
  myUser: IUser = {
    id: localStorage.getItem("userId"),
    nickname: localStorage.getItem("userNickname"),
    profileImage: localStorage.getItem("userProfileImage"),
  }
  
  messages: IMessageReceived[] = [];

  constructor(private messageService: MessageService,
    private el: ElementRef, 
    private renderer: Renderer2,
    private router: Router) {}

  ngOnInit(): void {
    this.messageService.connectRsocketServer().finally(() => {
        this.isOnline = 'primary';
    });
  
    this.messages = [];

    this.messageService.getMessageStream().subscribe((message: IMessageReceived[]) => {
        console.log('Nuevo mensaje en tiempo real:', message);
        this.messages.push(...message);
    });
  }

  async sendMessage() {
    if (this.messageContent.trim() !== '') {
      let message: IMessageSend = {
        body: this.messageContent,
        sender: this.myUser.nickname
      };

      console.log("sending message:" + this.messageContent);

      await this.messageService.createMessage(message);
      await new Promise((resolve) => setTimeout(resolve, 100));

      this.messages = [];
      await this.messageService.setupMessageStream().subscribe();

      this.messageContent = '';
    } else {
      console.log('Campo de entrada vacío, el mensaje no se enviará.');
    }
  }

  async onScroll(event: Event) {
    const container = this.el.nativeElement.querySelector('.body');

    if (this.isScrolledToBottom(container)) {
      this.messages = [];
      await this.messageService.setupMessageStream().subscribe();
    }
  }

  isScrolledToBottom(element: HTMLElement): boolean {
    if (element.scrollTop == 0 || element.scrollTop == 1) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("userNickname");
    localStorage.removeItem("userProfileImage");
    this.router.navigate(['']);
  }
}