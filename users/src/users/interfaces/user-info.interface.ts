import { User } from "../entities/user.entity";

export type IUserInfo = User & { avatar: string, followers?: number, subscribtions?: number };