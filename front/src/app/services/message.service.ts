import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Message {
  id?: number;
  sender_username: string;
  receiver_username: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/messages`);
  }

  getMessagesByUsername(username: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/messages/${username}`);
  }

  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}/messages`, message);
  }
}
