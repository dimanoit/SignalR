import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  nick = '';
  message = '';
  messages: string[] = [];
  hubConnection: HubConnection;
  private connectionUrl = 'http://localhost:5000/chat';

  ngOnInit() {
    this.nick = window.prompt('Your name', 'User' + this.getRandomInt(1));
    this.hubConnection = new HubConnectionBuilder().withUrl(this.connectionUrl).build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(error => {
        alert('Error while establishing connection :(');
        console.log(error);
      });


    this.hubConnection.on('sendToAll', (nick: string, receivedMessage: string) => {
      const text = `${nick}: ${receivedMessage}`;
      this.messages.push(text);
    });
  }

  public sendMessage(): void {
    this.hubConnection
      .invoke('sendToAll', this.nick, this.message)
      .catch(err => alert(err));
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
