import { Component } from '@angular/core';
import { ChatService } from '../../shared/chat.service';
import { IUser } from '../../interfaces/user.interface';
import { Router } from '@angular/router';
import { IAvatar, avatars } from '../../interfaces/avatars';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showRegister: boolean = false;
  userExists: boolean = false;
  userCreated: boolean = false;
  connection!: any;
  username: string = '';
  userRegister!: IUser;
  imagePath: string | null = null;
  avatars: IAvatar[] = [];
  userId!: number;

  constructor(private chatService: ChatService,
    private router: Router,
    ) {
      this.avatars = avatars;
    }

  ngOnInit(): void {
    this.connectRsocketServer();
  }

  async connectRsocketServer() {
    const clientRsocket = await this.chatService.rsocketServer();
    clientRsocket.connect()
    .subscribe({
      onComplete: (socket) => {
          this.connection = socket;
      },
      onError: error => {
        console.log("Connection has been refused due to:: " + error);
      },
    });
  }

  async loginUser() {
    const login = {
      nickname: this.username
    };

    await this.connection.requestResponse({
      data: login,
      metadata: String.fromCharCode('find.user'.length) + 'find.user',
    }).subscribe({
      onComplete: (payload: any) => {
        this.userId = payload.data.id;

        localStorage.setItem("userId", payload.data.id);
        localStorage.setItem("userNickname", payload.data.nickname);
        localStorage.setItem("userProfileImage", payload.data.profileImage);
        this.router.navigate(['home']);
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (this.userId == undefined) {
      this.userExists = true;
      setTimeout(() => {
        this.userExists = false;
      }, 2000);
    }
  }

  userNotExists(data: any) {
    
    
  }

  selectAvatar(avatarPath: string) {
    this.imagePath = avatarPath;
  }

  async registerUser() {
    this.userRegister = {
      nickname: this.username,
      profileImage: this.imagePath
    };

    if (this.userRegister.nickname != '' && this.userRegister.profileImage != '') {
      await this.connection.requestResponse({
        data: this.userRegister,
        metadata: String.fromCharCode('create.user'.length) + 'create.user',
        }).subscribe({
          onComplete: (payload: any) => {
            this.userCreated = true;
            setTimeout(() => {
              this.userCreated = false;
              this.showRegister = false;
            }, 2000);
        },
      });
    } else {
      console.log('Campo de entrada vacío, el usuario no se creará.');
    }
  }

  displayRegister() {
    this.showRegister = true;
  }

  closeRegister() {
    this.showRegister = false;
  }
}
