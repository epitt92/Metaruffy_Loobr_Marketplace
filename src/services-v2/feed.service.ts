import { HttpService } from './base.service';

class FeedService extends HttpService {
    private readonly prefix: string = 'feed';

    /**
     * feature List
     * @param data
     */
    getAllschduleFeed = (): Promise<any> => this.get(`${this.prefix}/schduleposts`);
    /**
     * feature List
     * @param data
     */
    deletePostFeed = (id: string): Promise<any> => this.get(`${this.prefix}/deleteFeed?id=${id}`);
    /**
     * feature List
     * @param data
     */
    pollSelection = (data: any): Promise<any> => this.post(`${this.prefix}/selectpoll`, data);
    /**
     * feature List
     * @param data
     */
    getPollVoters = (id: string): Promise<any> => this.get(`${this.prefix}/getVoters/${id}`);
}
export const feedService = new FeedService();
