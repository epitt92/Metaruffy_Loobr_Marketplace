import { HttpService } from './base.service';

class ProposalService extends HttpService {
    private readonly prefix: string = 'dao';

    /**
     * feature List
     * @param data
     */
    getAllproposals = (params: any): Promise<any> => this.get(`${this.prefix}/proposals`, params);
    /**
     * feature List
     * @param data
     */
    getVotes = (id: number, params: any): Promise<any> => this.get(`${this.prefix}/votes/${id}`, params);
    /**
     * feature List
     * @param data
     */
    getProposalById = (id: any): Promise<any> => this.get(`${this.prefix}/proposals/${id}`);
}
export const service = new ProposalService();
