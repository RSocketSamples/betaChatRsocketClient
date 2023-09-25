import { Injectable } from '@angular/core';
import { IdentitySerializer, JsonSerializer, RSocketClient } from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  rsocketServer() {
    const clientRsocket = new RSocketClient({
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
      transport: new RSocketWebSocketClient({ url: 'ws://wss.notianimes.com' }),
    });

    return clientRsocket;
  }
}
