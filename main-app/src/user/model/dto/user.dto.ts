export class UserDTO {
  constructor(username: string, email: string, id: string) {
    this.username = username;
    this.email = email;
    this.id = id;
  }

  username: string;
  email: string;
  id: string;
}
