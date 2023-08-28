import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { UserComponent } from './components/user/user.component';
import { HomeComponent } from './pages/home/home.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ChatComponent,
    UserComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MatIconModule,
  ],
})
export class ChatModule { }
