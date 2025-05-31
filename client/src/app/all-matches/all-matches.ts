import { Component, OnDestroy, OnInit } from '@angular/core';
import { socket } from '../app.component';

@Component({
  selector: 'app-all-matches',
  imports: [],
  templateUrl: './all-matches.html',
  styleUrl: './all-matches.scss'
})
export class AllMatches implements OnInit, OnDestroy {
  matches: any[] = [];
  constructor() {
    console.log('AllMatches component initialized');
  }

  async ngOnInit() {
    socket.on('matches', (matches) => {
      console.log('Получени мачове от сървъра:', matches);
    });
    let res: any = await fetch('api/db/matches')
      .then(response => response.json())
      .catch(error => {
        console.error('Error:', error);
        return [];
      });
    // const response = await fetch('api/db/matches');
    // response.then((res) => {
    //   debugger;
    // })
    // const res: any = await response.json();
    // this.matches = res;
    // console.log('AllMatches component onInit');
  }

  ngOnDestroy() {
    socket.off('matches');
    console.log('AllMatches component destroyed');
  }
}
