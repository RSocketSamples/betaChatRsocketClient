import { Component } from '@angular/core';
import { ChatService } from '../../shared/chat.service';
import { IUser } from '../../interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showRegister: boolean = false;
  connection!: any;
  username: string = '';
  userNickname: string = '';
  userRegister!: IUser;
  userProfileImage: File | null = null;

  constructor(private chatService: ChatService,
    private router: Router) { }

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
        localStorage.setItem("userId", payload.data.id);
        localStorage.setItem("userNickname", payload.data.nickname);
        localStorage.setItem("userProfileImage", payload.data.profileImage);
        this.router.navigate(['home']);
    },
    });
  }

  onFileSelected(event: any): void {
    console.log(event);
    
    const file = event.target.files[0];
    if (file) {
      // Puedes generar una URL para la imagen seleccionada (nota que esto no sube la imagen al servidor)
      this.userRegister.profileImage = URL.createObjectURL(file);
    }
  }

  onSubmit(): void {
    // Aquí puedes implementar el código para guardar la imagen en la carpeta "assets"
    // y guardar la ruta en la variable "profileImage"
    // Esto generalmente requeriría una lógica de servidor para manejar la carga y almacenamiento de imágenes.
    console.log('Ruta de la imagen:', this.userRegister.profileImage);
  }

  displayRegister() {
    this.showRegister = true;
  }

  closeRegister() {
    this.showRegister = false;
  }
}
