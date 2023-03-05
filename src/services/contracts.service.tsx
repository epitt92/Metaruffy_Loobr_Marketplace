import { Provider } from '@ethersproject/abstract-provider';
import { ethers, Signer } from 'ethers';
import { erc721ABI, offerABI, tokenABI } from '../contractsData/abis';
import { HttpService } from './base.service';

class ContractsService extends HttpService {
    private readonly prefix: string = 'collections';

    /**
     * Make Offer
     * @param  {stirng} offerAddress Offer contract address
     * @param {stirng} contractAddress NFT token conrtract address
     * @param {stirng} tokenAddress USDT token conrtract address
     * @param {stirng} tokenId Token Id of NFT
     * @param {string} price Amount which id being offered
     * @param {number} duration Duration of offer
     * @param {string} owner Owner of NFT token
     * @param {Signer} signer Signer
     */
    makeAnOffer = async (
        offerAddress: string,
        contractAddress: string,
        tokenAddress: string,
        tokenId: string,
        price: string,
        duration: number,
        owner: string,
        signer?: Signer | Provider | any
    ): Promise<any> => {
        console.log(offerAddress, contractAddress, tokenAddress, tokenId, price, duration, owner);
        const token = new ethers.Contract(tokenAddress, tokenABI, signer);
        const approvedAmmount = await token.allowance(owner, offerAddress);
        const allowance = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
        if (approvedAmmount.toString() !== allowance) {
            const apr = await token.approve(offerAddress, allowance);
            await apr.wait();
        }

        const contract = new ethers.Contract(offerAddress, offerABI, signer);
        const bidPrice = ethers.utils.parseUnits(price.toString(), 'ether');
        const transaction = await contract.placeBid(contractAddress, tokenId, bidPrice, duration, tokenAddress);
        let tx = await transaction.wait();
        return tx;
    };

    /**
     * Cancel Offer
     * @param  {stirng} offerAddress Offer contract address
     * @param {stirng} tokenAddress NFT token conrtract address
     * @param {stirng} tokenId Token Id of NFT
     * @param {Signer} signer Signer
     */
    cancelOffer = async (
        offerAddress: string,
        tokenAddress: string,
        tokenId: string,
        signer?: Signer | Provider | any
    ): Promise<any> => {
        const contract = new ethers.Contract(offerAddress, offerABI, signer);
        const transaction = await contract.cancelBid(tokenAddress, tokenId);
        let tx = await transaction.wait();
        return tx;
    };

    /**
     * Accept Offer
     * @param  {stirng} offerAddress Offer contract address
     * @param {stirng} tokenAddress NFT token conrtract address
     * @param {stirng} tokenId Token Id of NFT
     * @param {stirng} biddingId Bidding Id of NFT
     * @param {Signer} signer Signer
     */
    acceptOffer = async (
        offerAddress: string,
        tokenAddress: string,
        tokenId: string,
        biddingId: string,
        signer?: Signer | Provider | any
    ): Promise<any> => {
        const nftContract = new ethers.Contract(tokenAddress, erc721ABI, signer);
        const contract = new ethers.Contract(offerAddress, offerABI, signer);
        const approved = await nftContract.getApproved(tokenId);
        const isApproved = approved == offerAddress;
        if (!isApproved) {
            const approve = await nftContract.approve(offerAddress, tokenId);
            await approve.wait();
        }
        const transaction = await contract.acceptBid(tokenAddress, tokenId, biddingId);
        const tx = await transaction.wait();
        return tx;
    };
}
export const contractsService = new ContractsService();
