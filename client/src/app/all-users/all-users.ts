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
        console.log('fetch user from FE')
        socket.emit('usersMethod', { action: 'fetch' });
        socket.emit('join', { room: 'users', userId: socket.id });
        socket.emit('getUsersFromDb')
        // socket.on('getUsersFromDb', (data) => {
        //     console.log('new users', data)
        // })

        socket.on('usersFromDb', (users: any[]) => {
            console.log('Users from DB:', users);
            if (!users || !Array.isArray(users)) {
            } else {
                this.users = users;
            }
        });
    }

    ngOnInit() {
        setTimeout(() => {
            this.fetchUsers();
        }, 1)
        // socket.on('users', (users: any[]) => {
        //     this.users = users;
        // });
    }

    ngOnDestroy() {
        socket.emit('leave', { room: 'users', userId: socket.id });
        socket.emit('usersMethod', { action: 'disfetch' });
        socket.off('users');
    }
}
