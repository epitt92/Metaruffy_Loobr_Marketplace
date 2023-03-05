import mongoose from 'mongoose';

const collectionschema = new mongoose.Schema(
    {
        role: { type: Number, default: 0 },
        chain: String,
        contract_address: String,
        contract_name: String,
        logo_url: String,
        banner_url: String,
        items_total: Number,
        owners_total: Number,
        sales_1d: Number,
        sales_7d: Number,
        sales_30d: Number,
        sales_total: Number,
        volume_1d: Number,
        volume_7d: Number,
        volume_30d: Number,
        volume_total: Number,
        floor_price: Number,
        average_price_1d: Number,
        average_price_7d: Number,
        average_price_30d: Number,
        average_price_total: Number,
        average_price_change_1d: Number,
        average_price_change_7d: Number,
        average_price_change_30d: Number,
        volume_change_1d: Number,
        volume_change_7d: Number,
        market_cap: Number
    },
    {
        timestamps: true
    }
);

export default mongoose.models.Nftcollectionbank || mongoose.model('Nftcollectionbank', collectionschema);
