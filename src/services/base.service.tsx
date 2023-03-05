import axios, { CancelTokenStatic, CancelTokenSource } from "axios";
import { Console } from "console";
import { baseURL } from "../constants/env";

export class HttpService {
    CancelToken: CancelTokenStatic;
    source: CancelTokenSource;

    constructor() {
        this.CancelToken = axios.CancelToken;
        this.source = this.CancelToken.source();
    }

    /**
     * Set Token On Header
     * @param token
     */
    static setToken(token: any): void {
        //@ts-ignore
        axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    }

    /**
     * Fetch data from server
     * @param url Endpoint link
     * @return Promise
     */
    protected get = (url: string, params?: any): Promise<any> =>
        axios.get(`${baseURL}/${url}`, {
            params,
            cancelToken: this.source.token,
        });

    /**
     * Write data over server
     * @param url Endpoint link
     * @param body Data to send over server
     * @return Promise
     */
    protected post = (url: string, body: any, options = {}): Promise<any> =>
        axios.post(`${baseURL}/${url}`, body, {
            ...options,
            cancelToken: this.source.token,
        });

    /**
     * Delete Data From Server
     * @param url Endpoint link
     * @param params Embed as query params
     * @return Promise
     */
    protected delete = (url: string, params?: any, data?: any): Promise<any> =>
        axios.delete(`${baseURL}/${url}`, { params, data });

    /**
     * Update data on server
     * @param url Endpoint link
     * @param body Data to send over server
     * @param params Embed as query params
     * @return Promise
     */

    protected put = (url: string, body?: any, params?: any): Promise<any> => {
        return axios.put(`${baseURL}/${url}`, body, {
            ...params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
    };

    private updateCancelToken() {
        this.source = this.CancelToken.source();
    }

    cancel = () => {
        this.source.cancel("Explicitly cancelled HTTP request");
        this.updateCancelToken();
    };
}
