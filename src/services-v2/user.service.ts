import { HttpService } from './base.service';

class UserService extends HttpService {
    private readonly prefix: string = 'user';

    /**
     * user follow
     * @parma userId
     */
    followuser = (id: any): Promise<any> => this.put(`${this.prefix}/follow/${id}`);
    /**
     * user Block
     * @parma userId
     */
    blockUser = (id: any): Promise<any> => this.put(`${this.prefix}/block-user/${id}`);
    /**
     * user follower
     * @param userId
     */
    getfollowers = (id: any): Promise<any> => this.get(`${this.prefix}/get/followers/?userId=${id}`);
    /**
     * user follower
     * @param userId
     */
    getuser = (id: any): Promise<any> => this.get(`${this.prefix}/addressandid/${id}`);
    /**
     * user feeds
     * @params pagination detail and userId
     */
    getFeed = (params: any): Promise<any> => this.get(`feed/getfeeds`, params);
    /**
     * users for feed
     * @params pagination detail and userId
     */
    getFeedUser = (search: any): Promise<any> => this.get(`feed/getUsers/?search=${search}`);
    /**
     * Trending Hashtags
     */
    getTophashTags = (): Promise<any> => this.get(`feed/getTags`);

    /**
     *
     * @returns
     */
    getBannerImages = (): Promise<any> => this.get(`${this.prefix}/banner-images`);
    /**
     *
     * @returns
     */
    getContent = (): Promise<any> => this.get(`${this.prefix}/added-content`);
    /**
     *
     * @returns
     */
    getCallToken = (room: string, call: boolean, callId?: string): Promise<any> =>
        this.get(`${this.prefix}/video/generate-token/?room=${room}&&call=${call}&&callId=${callId}`);
    /**
     *
     * @returns
     */
    startCall = (receiver: string): Promise<any> => this.post(`call/start`, { receiver });
    /**
     *
     * @returns
     */
    updateCallStatus = (callId: string, status: string): Promise<any> => this.put(`call/status`, { callId, status });

    /**
     *
     * @returns
     */
    rejectCall = (room: string, callId: string): Promise<any> =>
        this.post(`${this.prefix}/rejectCall/?room=${room}&&callId=${callId}`, {});
    /**
     *
     * @returns
     */
    notPicking = (room: string, callId: string): Promise<any> =>
        this.post(`${this.prefix}/notpicking/?room=${room}&&callId=${callId}`, {});
    /**
     *
     * @returns
     */
    endCall = (room: string): Promise<any> => this.post(`${this.prefix}/endCall/?room=${room}`, {});
    /**
     *
     * @returns
     */
    getRecentSearches = (): Promise<any> => this.get(`${this.prefix}/searech-user`);
    /**
     *
     * @returns
     */
    addRecentSearch = (body: any): Promise<any> => this.post(`${this.prefix}/search-add`, body);
    /**
     *
     * @returns
     */
    removeSearch = (body: any): Promise<any> => this.post(`${this.prefix}/search-remove`, body);
    /**
     *
     * @returns
     */
    clearSearch = (): Promise<any> => this.post(`${this.prefix}/search-clear`, {});
}
export const userService = new UserService();
