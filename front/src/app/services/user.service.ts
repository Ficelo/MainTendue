import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Router} from '@angular/router';

export interface User {
  id? : number,
  username : string,
  email : string,
  password : string,
  role : string;
}

export interface Friend {
  username_init: string;
  username_friend: string;
  active: boolean;
}

export interface Interest {
  username: string;
  interest: string;
}

export interface Condition {
  username: string;
  condition: string;
}


@Injectable({
  providedIn: "root"
})
export class UserService {

  private baseUrl = 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());

  constructor(private http : HttpClient, private router : Router) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${username}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${user.username}`, user);
  }

  login(username: string, password: string): Observable<User> {
    return this.getUserByUsername(username).pipe(
      tap(user => {
        if (user.password === password) {
          this.setCurrentUser(user);
          this.router.navigate(['']);
        } else {
          throw new Error('Invalid password');
        }
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadUserFromStorage(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  getFriends(username: string): Observable<Friend[]> {
    return this.http.get<Friend[]>(`${this.baseUrl}/friends/${username}`);
  }

  addFriend(friend: Omit<Friend, 'active'>): Observable<Friend> {
    return this.http.post<Friend>(`${this.baseUrl}/friends`, friend);
  }

  approveFriend(username_init: string, username_friend: string): Observable<Friend> {
    return this.http.put<Friend>(`${this.baseUrl}/friends/activate`, {
      username_init,
      username_friend
    });
  }

  removeFriend(username_init: string, username_friend: string): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/friends`, {
      body: { username_init, username_friend }
    });
  }

  getInterests(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/interests/${username}`);
  }

  addInterest(interest: Interest): Observable<Interest> {
    return this.http.post<Interest>(`${this.baseUrl}/interests`, interest);
  }

  removeInterest(interest: Interest): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/interests`, {
      body: interest
    });
  }

  getConditions(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/conditions/${username}`);
  }

  addCondition(condition: Condition): Observable<Condition> {
    return this.http.post<Condition>(`${this.baseUrl}/conditions`, condition);
  }

  removeCondition(condition: Condition): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/conditions`, {
      body: condition
    });
  }

  filterUsers(filters: { condition?: string, friendCount?: string, interest?: string }): Observable<User[]> {
    return this.http.post<User[]>(`${this.baseUrl}/users/filter`, filters);
  }



}
