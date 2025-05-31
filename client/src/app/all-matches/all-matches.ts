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
        console.error('Error:', error);
        return [];
      })
      .then(data2 => {
        console.log('Success:', data2);
        return data2;
      })
    // const response = await fetch('api/db/matches');
    // response.then((res) => {
    //   debugger;
    // })
    // const res: any = await response.json();
    // this.matches = res;
    // console.log('AllMatches component onInit');
  }
}
