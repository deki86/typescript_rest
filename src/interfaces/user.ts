import { Document } from 'mongoose';

export default interface IUser extends Document {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}
