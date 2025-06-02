import { Component, OnInit, OnDestroy } from '@angular/core';
import { socket } from '../app.component';

@Component({
    selector: 'app-all-users',
    templateUrl: './all-users.html',
    styleUrl: './all-users.scss'
})
export class AllUsers implements OnInit, OnDestroy {
    users: any[] = [];

    constructor() {
        console.log('AllUsers component initialized');
    }

    fetchUsers() {
        socket.emit('usersMethod', { action: 'fetch' });
        socket.emit('join', { room: 'users', userId: socket.id });
    }

    ngOnInit() {
        this.fetchUsers();
        socket.on('users', (users: any[]) => {
            this.users = users;
        });
    }

    ngOnDestroy() {
        socket.emit('leave', { room: 'users', userId: socket.id });
        socket.emit('usersMethod', { action: 'disfetch' });
        socket.off('users');
    }
}
