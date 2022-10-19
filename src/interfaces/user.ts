import { Document } from 'mongoose';

export default interface IUser extends Document {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}
