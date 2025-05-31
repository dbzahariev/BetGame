import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
  private socket: Socket;

  constructor(private translate: TranslateService) {
    console.log('AppComponent initialized');
    translate.addLangs(['en', 'bg']);
    const storedLang = sessionStorage.getItem('currentLang') || "bg";
    this.translate.setDefaultLang(storedLang);

    // Socket.IO client initialization
    let url = window.location.origin.split(':')[0] + ':' + window.location.origin.split(':')[1]+ ':8080';
    console.log('window.location.origin:', url);
    this.socket = io(url);
    this.socket.on('connect', () => {
      console.log('Socket.IO connected:', this.socket.id);
    });
    this.socket.on('matches', (matches) => {
      console.log('Получени мачове от сървъра:', matches);
      // Тук може да се добави логика за обновяване на UI
    });
    this.socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });
  }
}
