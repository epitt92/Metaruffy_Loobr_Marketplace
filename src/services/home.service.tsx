import { HttpService } from './base.service';

class HomeService extends HttpService {
    private readonly prefix: string = 'marketplace';

    /**
     * feature List
     * @param data
     */
    liveAuctions = (params: any): Promise<any> => this.get(`${this.prefix}/listings/live`, params);
    /**
     * feature List
     * @param data
     */
    featureListing = (params: any): Promise<any> => this.get(`${this.prefix}/listings/live`, params);
    /**
     * market place with filters
     * @param data
     */

    exploreMarketPlace = (params: any): Promise<any> => this.get(`${this.prefix}/explore`, params);
    /**
     * market place like
     * @param data
     */
    likeMarketPlace = (id: any): Promise<any> => this.put(`${this.prefix}/like/${id}`);
    /**
     * market place like
     * @body data
     */
    commentMarketPlace = (id: any, body: any): Promise<any> => this.post(`${this.prefix}/add-comments/${id}`, body);
    /**
     * market place like
     * @body data
     */
    getNft = (id: any): Promise<any> => this.get(`${this.prefix}/get-nft/${id}`);
    /**
     * market place view
     * @param data
     */
    viewMarketPlace = (id: any): Promise<any> => this.put(`${this.prefix}/view/${id}`);
    /**
     * market place view
     * @param data
     */
    getLikedNfts = (params?: any): Promise<any> => {
        return this.get(`${this.prefix}/likes-listings`, params);
    };
    /**
     * market place nft search external collection
     * @param data
     */
    searchExternalCollection = (params?: any): Promise<any> => {
        return this.get(`${this.prefix}/search-nft`, params);
    };

    /**
     * market place view
     * @param data
     */
    reportAfeed = (data: any): Promise<any> => this.post(`report/create`, data);
    /**
     * market place view
     * @param data
     */
    addListedContract = (data: any): Promise<any> => this.post(`${this.prefix}/listedContract`, data);
    /**
     * market place view
     * @param data
     */
    stageLogin = (): Promise<any> => this.get(`auth/stage-login`);
}
export const homeService = new HomeService();
