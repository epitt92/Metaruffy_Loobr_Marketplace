import { toast } from 'react-toastify';
import { HttpService } from './base.service';

class CollectionService extends HttpService {
    private readonly prefix: string = 'collections';

    /**
     * Get ALL trends
     * @param tab
     */
    getTrends = (params: any): Promise<any> => {
        return this.get(`${this.prefix}/trends`, params);
    };
    /**
     * Update External Collection profilepic
     * @param tab
     */

    /**
     * Get ALL trends
     * @param tab
     */
    getTrendingCollections = (params: any): Promise<any> => {
        return this.get(`${this.prefix}/trending-collections`, params);
    };
    /**
     * Update External Collection profilepic
     * @param tab
     */
    UpdateProfile = (id: any, image: any): Promise<any> => {
        return this.put(`${this.prefix}/updateProfile/${id}`, { logoPicture: image });
    };

    /**
     * Update External Collection profilepic
     * @param tab
     */
    followCollection = (id: any): Promise<any> => {
        return this.put(`${this.prefix}/follow/${id}`, {});
    };

    /**
     * Update External Collection profilepic
     * @param tab
     */
    getExtNFTs = (address: any, params: any): Promise<any> => {
        return this.get(`${this.prefix}/external/nfts/${address}`, params);
    };

    /**
     * Update External Collection profilepic
     * @param tab
     */
    getAllCollections = (params: any): Promise<any> => {
        return this.get(`${this.prefix}/all`, params);
    };

    /**
     * Update External Collection profilepic
     * @param tab
     */
    updateLikeCollection = (data: any): Promise<any> => {
        return this.put(`${this.prefix}/external/like`, data);
    };
}
export const collectionService = new CollectionService();
