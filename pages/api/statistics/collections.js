// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from '../../../utils/dbConnect';
import NftCollectionBank from '../../../models/Collection';
export default async function handler(req, res) {
    const { method } = req;
    const { sort_field, sort_direction, limit, chain } = req.query;
    await dbConnect();
    switch (method) {
        case 'GET':
            try {
                let result = null;
                if (chain) {
                    result = await NftCollectionBank.find({ chain }).sort({ volume_1d: -1 }).limit(parseInt(limit));
                } else {
                    result = await NftCollectionBank.find({}).sort({ volume_1d: -1 }).limit(parseInt(limit));
                }
                res.status(200).json({ success: true, data: result });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            res.status(400).json({ success: false });
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
