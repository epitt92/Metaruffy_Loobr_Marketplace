import { toast } from 'react-toastify';
import { HttpService } from './base.service';

class MarketPlaceService extends HttpService {
    private readonly prefix: string = 'marketplace';

    /**
     * Get ALL trends
     * @param tab
     */
    getTokenHistory = (tokenId: string, params: any): Promise<any> => {
        return this.get(`${this.prefix}/token/history/${tokenId}`, params);
    };

    /**
     * Get ALL trends
     * @param tab
     */
    getOwnedTokens = (address: string, params: any): Promise<any> => {
        return this.get(`${this.prefix}/owned/${address}`, params);
    };

    /**
     * Get ALL trends
     * @param params
     */
    getSuggestions = (params: any): Promise<any> => {
        return this.get(`${this.prefix}/suggestions`, params);
    };
}
export const marketPlaceService = new MarketPlaceService();
