import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
  }
}
