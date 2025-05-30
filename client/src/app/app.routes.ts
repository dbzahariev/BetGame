import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Groups } from './groups/groups';
import { AllMatches } from './all-matches/all-matches';

export const routes: Routes = [
    { path: 'all-matches', title: 'ALL_MATCHES', component: AllMatches },
    { path: 'groups', title: 'GROUPS', component: Groups },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
    constructor() {
        console.log('AppRoutingModule initialized');
    }
}
