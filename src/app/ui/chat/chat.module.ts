import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { UserComponent } from './components/user/user.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    ChatComponent,
    UserComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MatGridListModule,
  ]
})
export class ChatModule { }
