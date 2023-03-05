import Head from 'next/head';
import Video from '../src/modules/calling/calling';

const socialfeedpage = () => {
    return (
        <div>
            <Head>
                <title>Calling</title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Video />
        </div>
    );
};

export default socialfeedpage;
