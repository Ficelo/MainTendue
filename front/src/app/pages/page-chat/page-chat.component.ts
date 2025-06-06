import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {User, UserService} from '../../services/user.service';
import {Message, MessageService} from '../../services/message.service';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-page-chat',
  imports: [
    FormsModule,
    NgForOf,
    NgClass,
    NgIf
  ],
  templateUrl: './page-chat.component.html',
  standalone: true,
  styleUrl: './page-chat.component.css'
})
export class PageChatComponent implements OnInit, OnDestroy{

  contacts : string[] = []
  currentUser! : User;
  selectedContact: any = null;
  messages: { text: string; fromMe: boolean }[] = [];
  newMessage = '';

  messageSub : Subscription = new Subscription();

  constructor(private userService : UserService, private messageService : MessageService) {
  }

  ngOnInit() {

    this.currentUser = this.userService.getCurrentUser() || {
      username : "",
      password : "",
      email : "",
      role : ""
    }

    this.userService.getFriends(this.currentUser.username).subscribe({
      next : (value) => {
        for(let friend of value) {

          if(friend.active) {
            if(friend.username_friend == this.currentUser.username){
              this.contacts.push(friend.username_init);
            } else {
              this.contacts.push(friend.username_friend);
            }
          }
        }
        console.log(this.contacts)
      }
    })

  }

  selectChat(contact: any) {
    this.selectedContact = contact;

    this.messageSub.unsubscribe();

    this.getMessages(contact);
    this.messageSub = interval(1000).subscribe(() => {
      this.getMessages(contact);
    });
  }


  getMessages(contact: string) {
    this.messageService.getMessagesByUsername(this.currentUser.username).subscribe({
      next: (allMessages) => {
        const filtered = allMessages.filter(msg =>
          (msg.sender_username === this.currentUser.username && msg.receiver_username === contact) ||
          (msg.sender_username === contact && msg.receiver_username === this.currentUser.username)
        );

        const formatted = filtered.map(msg => ({
          text: msg.message,
          fromMe: msg.sender_username === this.currentUser.username
        }));

        if (this.messages.length !== formatted.length ||
          !this.areMessagesEqual(this.messages, formatted)) {
          this.messages = [...formatted];
        }

        this.messages.reverse();

      }
    });
  }

  private areMessagesEqual(a: { text: string; fromMe: boolean }[], b: { text: string; fromMe: boolean }[]): boolean {
    return a.every((msg, i) => b[i] && msg.text === b[i].text && msg.fromMe === b[i].fromMe);
  }


  sendMessage() {
    if (this.newMessage.trim()) {
      let msg : Message = {
        sender_username : this.currentUser.username,
        receiver_username : this.selectedContact,
        message : this.newMessage
      }
      this.messageService.sendMessage(msg).subscribe();
      // this.messages.push({ text: , fromMe: true });
      this.newMessage = '';
    }
  }

  ngOnDestroy() {
    this.messageSub.unsubscribe();
  }

}
