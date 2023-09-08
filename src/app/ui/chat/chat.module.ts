import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { UserComponent } from './components/user/user.component';
import { HomeComponent } from './pages/home/home.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
  declarations: [
    ChatComponent,
    UserComponent,
    HomeComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MatIconModule,
    FormsModule,
  ],
})
export class ChatModule { }
