import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-matches',
  imports: [],
  templateUrl: './all-matches.html',
  styleUrl: './all-matches.scss'
})
export class AllMatches implements OnInit {
  matches: any[] = [];
  constructor() {
    console.log('AllMatches component initialized');
  }

  async ngOnInit() {

    let res: any = await fetch('api/db/matches')
      .then(response => response.json()).catch(error => {
        debugger
        return console.error('Error:', error)
      })
      .then(data2 => {
        debugger;
      })
    debugger;
    // const response = await fetch('api/db/matches');
    // response.then((res) => {
    //   debugger;
    // })
    // const res: any = await response.json();
    // this.matches = res;
    // console.log('AllMatches component onInit');
  }
}
