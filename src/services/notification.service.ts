import { HttpService } from "./base.service";

class NotificationService extends HttpService {
    private readonly prefix: string = "notification";

    /**
     * feature List
     * @param data
     */
    getAllNotifications = (params?: any): Promise<any> =>
        this.get(`${this.prefix}/`, params);
    /**
     * feature List
     * @param data
     */
    seenNotifications = (params?: any): Promise<any> =>
        this.put(`${this.prefix}/seen-notifications`, params);
    /**
     * feature List
     * @param data
     */
    countNotificatins = (params?: any): Promise<any> =>
        this.get(`${this.prefix}/unseen-notifications`, params);
}
export const notificationService = new NotificationService();
