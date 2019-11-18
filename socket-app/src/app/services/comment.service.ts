import { Injectable } from '@angular/core';

import { Socket } from 'ngx-socket-io';

import { Comment } from '../models/comments';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  currentComment = this.socket.fromEvent<Comment>('comment');
  comments = this.socket.fromEvent<any>('comments');
  typing = this.socket.fromEvent<any>('typing');
  
  constructor(private socket: Socket) { }

  getComment(id: string) {
    this.socket.emit('getComment', id);
  }

  newComment(comment) {
    const date = (new Date());
    const value = { id: this.commentId(), name: comment.name, comment: comment.comment };
    this.socket.emit('addComment', value);
  }

  editDocument(comment: Comment) {
    this.socket.emit('editComment', comment);
  }
  typingComment(flag) {
    this.socket.emit('typingComment', flag);
  }
  private commentId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
