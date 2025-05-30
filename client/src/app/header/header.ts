import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from '../app.routes';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  navLinks: {
    path: string;
    title: string;
  }[] = [];

  constructor(public translate: TranslateService) {
    this.navLinks = [
      ...routes
        .filter(route => typeof route.path === 'string' && typeof route.title === 'string')
        .map(route => ({ path: route.path as string, title: route.title as string }))
    ];
  }

  switchLang(event: any) {
    const lang = event.target.value || 'bg';
    this.translate.use(lang);
    sessionStorage.setItem('currentLang', lang);
  }

  ngOnInit() {
    
  }
}
