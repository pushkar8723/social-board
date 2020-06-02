import { DataSource } from 'apollo-datasource';
import fetch from 'cross-fetch';
import { ITokenBody, IError } from '../types.d';

class GoogelOauth extends DataSource {
    private baseURL: string;

    constructor() {
        super();
        this.baseURL = 'https://oauth2.googleapis.com/tokeninfo';
    }

    async getUser(idToken: string): Promise<ITokenBody & IError> {
        const resp = await fetch(`${this.baseURL}?id_token=${idToken}`);
        if (resp.ok) {
            return resp.json();
        }
        return Promise.resolve(null);
    }
}

export default new GoogelOauth();
