class CommentDTO {
  constructor(comment: string, id: string, user: User | string) {
    this.comment = comment;
    this.id = id;
    this.user = user;
  }

  id: string;
  comment: string;
  user: User | string;
}

interface User {
  username: string;
  email: string;
  id: string;
}

export { User, CommentDTO };
