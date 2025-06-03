import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { io, Socket } from 'socket.io-client';

export let socket: Socket;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'bg']);
    const storedLang = sessionStorage.getItem('currentLang') || "bg";
    this.translate.setDefaultLang(storedLang);

    // Socket.IO client initialization
    const isDev = window.location.hostname === 'localhost';
    const url = isDev ? 'http://localhost:8080' : 'https://dworld.onrender.com/';
    socket = io(url);
    socket.on('connect', () => { });
    socket.on('disconnect', () => { });
  }
}
