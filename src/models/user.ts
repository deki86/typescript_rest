import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';

const UserSchema: Schema = new Schema(
    {
        email: {
            type: mongoose.SchemaTypes.String,
            required: true,
            unique: true
        },
        firstName: {
            type: mongoose.SchemaTypes.String,
            required: true
        },
        lastName: {
            type: mongoose.SchemaTypes.String,
            required: true
        },
        password: {
            type: mongoose.SchemaTypes.String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>('User', UserSchema);
