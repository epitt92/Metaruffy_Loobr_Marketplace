import { HttpService } from './base.service';

class RefferalService extends HttpService {
    private readonly prefix: string = 'referral';
    private readonly prefix1: string = 'referralvideo';

    /**
     * feature List
     * @param data
     */
    getRefferalData = (params: any): Promise<any> =>
        this.get(`${this.prefix}/get-refferal`, { params: { time: params } });
    /**
     * feature List
     * @param data
     */
    getRefferalVideo = (): Promise<any> => this.get(`${this.prefix1}/userrefrralvideo`);
    /**
     * feature List
     * @param data
     */
    addlink = (data: any): Promise<any> => this.post(`${this.prefix1}/addlink`, data);
}
export const referralService = new RefferalService();
