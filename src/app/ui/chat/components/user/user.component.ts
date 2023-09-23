import { Component } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  users: IUser[] = [];

  constructor(private userService: UserService,
    ) { }

  ngOnInit(): void {
    // Suscribirse a la secuencia de mensajes en tiempo real
    this.userService.getUserStream().subscribe((user) => {
      this.users.push(user);
    });
  }
}
