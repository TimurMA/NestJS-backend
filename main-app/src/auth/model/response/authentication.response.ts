export class AuthenticationResponse {
  constructor(id: string, username: string, email: string, token: string) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.token = token;
  }
  id: string;
  username: string;
  email: string;
  token: string;
}
