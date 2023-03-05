import Head from 'next/head';
import withAuth from '../src/components/Hoc/withAuth';
import CreateItemModule from '../src/modules/CreateItemModule/CreateItemModule';

function CreateItem() {
    return (
        <>
            <Head>
                <title>LooBr | Create Item</title>
            </Head>
            <CreateItemModule />;
        </>
    );
}

export default withAuth(CreateItem);
