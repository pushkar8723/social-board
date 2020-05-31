import { User } from '../generated/types.d';

export interface ITokenBody {
    name: string;
    email: string;
    picture: string;
}

export interface IError {
    error: string;
    // eslint-disable-next-line camelcase
    error_description: string;
}

export interface IContext {
    user: User;
    idToken: string;
}
