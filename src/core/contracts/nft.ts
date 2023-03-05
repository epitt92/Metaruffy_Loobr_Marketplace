import { ethers, Signer } from "ethers";
// import NftAddress from "../../contractsData/NFT-address.json";
import NFT from "../../contractsData/NFT.json";

class NFTContract {
    private contract;
    static chain: any;
    constructor(signer: Signer) {
        this.contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_NFT_ADDRESS,
            NFT.abi,
            signer
        );
    }

    public async setRoyalties(
        tokenId: number,
        receiver: string,
        royalty: number
    ) {
        try {
            
        } catch (error) {
            
        }
    }
}

export default NFTContract;
