import { toast } from 'react-toastify';
import { HttpService } from './base.service';

class OfferService extends HttpService {
    private readonly prefix: string = 'offers';

    /**
     * Get ALL Offers
     * @param tab
     */
    getAllOffers = (address: string, params: any): Promise<any> => {
        return this.get(`${this.prefix}/sent/${address}`, params);
    };

    /**
     * Get ALL Offers
     * @param tab
     */
    getAllOffersReceived = (address: string, params: any): Promise<any> => {
        return this.get(`${this.prefix}/received/${address}`, params);
    };

    /**
     * Get ALL Offers
     * @param tab
     */
    getAllOffersReceivedByAddress = (address: string, params: any): Promise<any> => {
        return this.get(`${this.prefix}/received/${address}`, params);
    };

    /**
     * Get ALL Offers
     * @param tab
     */
    getAllOffersByNFTId = (id: string, params: any): Promise<any> => {
        return this.get(`${this.prefix}/nft/${id}`, params);
    };

    /**
     * Make Offer
     * @param tab
     */
    makeOffer = (body: any): Promise<any> => {
        return this.post(`${this.prefix}/`, body);
    };

    /**
     * Cancel Offer
     * @param tab
     */
    cancelOffer = (id: any): Promise<any> => {
        return this.post(`${this.prefix}/cancel/${id}`, {});
    };

    /**
     * Reject Offer
     * @param tab
     */
    rejectOffer = (id: any): Promise<any> => {
        return this.post(`${this.prefix}/reject/${id}`, {});
    };

    /**
     * Accept Offer
     * @param tab
     */
    acceptOffer = (id: any): Promise<any> => {
        return this.post(`${this.prefix}/accept/${id}`, {});
    };
}
export const offerService = new OfferService();
