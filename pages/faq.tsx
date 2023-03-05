import Head from 'next/head';
import FaqModule from '../src/modules/FaqModule/FaqModule';

const Faqs = () => {
    return (
        <div>
            <Head>
                <title>LooBr | Faqs</title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <FaqModule />
        </div>
    );
};

export default Faqs;
