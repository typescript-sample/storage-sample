export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  image?: string;
}
export interface UserAvatar {
  id: string;
  image: string;
}
