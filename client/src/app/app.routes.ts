import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Groups } from './groups/groups';
import { AllMatches } from './all-matches/all-matches';
import { AllUsers } from './all-users/all-users';

export const routes: Routes = [
    { path: 'all-matches', title: 'ALL_MATCHES', component: AllMatches },
    { path: 'all-users', title: 'ALL_USERS', component: AllUsers },
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
