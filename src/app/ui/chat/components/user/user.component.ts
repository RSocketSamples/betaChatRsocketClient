import { Component } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  users: IUser[] = [
    {
      id: "1",
      nickname: "brayan.herrera",
      profileImage: "assets/perfil-image.jpg"
    },
    {
      id: "2",
      nickname: "jhoan.gonzalez",
      profileImage: "assets/perfil-sender.jpg"
    },
  ];
}
