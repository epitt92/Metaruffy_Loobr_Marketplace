import React from 'react';
import SocialfeedOnlyModule from '../../SocialFeedsOnlyModule/SocialfeedOnlyModule';

type Props = {
    collection: any;
};

const Feeds = ({ collection }: Props) => {
  console.log(collection,"collection");
  
    return (
        <div>
            <SocialfeedOnlyModule tag="" allowPost={true} setConfirmation={() => {}} collectionId={collection?._id} />
        </div>
    );
};

export default Feeds;
