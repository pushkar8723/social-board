import { User } from '../generated/types.d';
import FaunaDB from './datasource/FaunaDB';
import GoogelOauth from './datasource/GoogleOauth';

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
    dataSources: {
        faunaDB: FaunaDB,
        googleOauth: GoogelOauth
    }
}
