import { memo } from 'react';
import { EditprofileModal } from '../../modules/editprofilemodule/editprofilemodule';
import { EditIslandprofileModal } from '../../modules/EditislandprofileModule/editIslandprofileModal';
import { AppPassword } from '../AppPassword/AppPassword';
import Members from '../Chat/Members';
import Comments from '../Comments/Comments';
import { EmailSendModule } from '../EmailSendModule/EmailSendModule';
import Followers from '../Followers/Followers';
import Following from '../Following/Following';
import { ForgotPasswordModule } from '../ForgotPasswordModule/ForgotPasswordModule';
import { LoginModule } from '../LoginModule/LoginModule';
import Modal from '../modal/Modal';
import { ResetPasswordModule } from '../ResetPasswordModule/ResetPasswordModule';
import Verifyemail from '../verifyemail/verifyemail';
import Acceptoffer from './Acceptoffer';
import AddProperties from './AddProperties';
import Block from './block';
import BuyLoading from './BuyLoading';
import Choosenft from './choosenft';
import Congratulation from './Congratulation';
import Connected from './Connected';
import Connectednft from './Connectednft';
import Connecting from './connecting';
import Connectingnft from './connectingnft';
import ConnectingProfile from './connectingProfile';
import Connectmetamask from './Connectmetamask';
import Connectmetamasknft from './Connectmetamasknft copy';
import CopyPostLink from './copypostlink';
import { Createcollection } from './Createcollection';
import CreatePost from './CreatePost';
import DeleteComment from './DeleteComment';
import DeletePost from './DeletePost';
import DeleteConfirm from './DeleteConfirm';
import DeleteNFT from './DeleteNFT';
import { EditCollection } from './EditCollection';
import Kyc from './kyc/Kyc';
import Loadingbid from './Loadingbid';
import Loadingcheckout from './Loadingcheckout';
import Makeanoffer from './Makeanoffer';
import MessageImagePreivew from './MessageImagePreivew';
import PasswordChangedone from './PasswordChangedone';
import Placebid from './Placebid';
import Purchasecheckout from './Purchasecheckout';
import Report from './report';
import ReportUser from './Reportuser';
import ReportComment from './reportComment';
import Reportnft from './Reportnft';
import Sellnow from './Sellnow';
import Selltime from './Selltime';
import { SignupModal } from './Signup';
import Successbid from './Successbid';
import Uploadimg from './Uploadimage';
import Uploadvideo from './Uploadvideo';
import VideoPreview from './VideoPreview';
import Changepassword from './Wanttosale/Changepassword';
import Congratulationnfts from './Wanttosale/Congratulationnfts';
import CropImage from './CropImage';
import Settingsdrop from './Settingsdrop';
import Converter from './Converter';
import Guidline from './Guidline';
import StayTuned from '../StayTuned/StayTuned';
import Removemessage from './Removemessage';
import { ResendVerificationEmail } from '../ResendVerificationEmail';
import { AuthanticationAccount } from './AuthanticationAccount';
import { ConfirmPassword } from './ConfirmPassword';
import GiftModal from './GiftModal';
import BurnNft from './Burnnft';
import SwitchNetwork from './SwitchNetwok';
import Scancode from './Scancode';
import Petetion from './dao-popups/petetion';
import TellStory from './dao-popups/tell-story';
import UploadCover from './dao-popups/upload-cover';
import PositivePopup from './dao-popups/positivevotes';
import NegativePopup from './dao-popups/negativevotes';
import Leaveloober from './Leaveloober';
import Calling from './calling';
import Callinguser from './calling/Callinguser';
import Mysterymodal from './calling/mysterymodal';
import JoinCalling from './calling/stage/joincalling';
import Addguests from './Addguests';
import Stagerequest from './Stagerequest';
import Stagechat from './Stagechat';
import CreateStage from './CreateStage';
import Privacy from './privacy';
import EditExternalCollection from '../Collections/EditExternalCollection';
import ImageView from './Imageview';
import CropVideo from './VideoCrop';
import AddAssets from './AddAssets';
import AddAssetsAll from './AddAssetsAll';
import NotVerified from '../makeanoffer/NotVerified';
import MakeOffer from '../makeanoffer/Makeoffer';
import SuccessfullyOffered from '../makeanoffer/SuccessfullyOffered';
import RedeemConfirm from './RedeemConfirm';
import Schedulepost from './Schedulepost';
import Poll from './Poll';
import ReferelGallery from './ReferelGallery';
import ReferralConfirmation from './ReferralConfirmation';
import PollVoters from './PollVoters';
import ScheduleCaleder from './ScheduleCalender/ScheduleCalender';
import SettingsNotifications from './Notifications';
import { EditLandprofileModal } from '../../modules/EditlandprofileModule/editlandprofileModal';
import TopLandownerComponent from '../../modules/LeaderboardModule/Landowner';
import TopLandownerModule from '../../modules/TopLandownerModule/TopLandownerModule';
import EditMyLands from '../../modules/MapModule/editMyLands';

interface Iprops {
    show?: any;
    hide?: any;
    state?: any;
    setstate: Function;
    data?: any;
    setPopup?: any;
    nftPropertiesHandler?: any;
    attributes?: any;
    setAttributes?: any;
    close?: string;
    setNft?: Function;
    nft?: any;
    otherUser?: boolean;
    singlefeed?: boolean;
    type?: string;
    setConfirmed?: Function;
    page?: number;
    confirmed?: boolean;
    setData?: Function;
    setImage?: Function;
    account?: any;
}
const Popups = ({
    show,
    hide,
    state,
    setstate,
    data,
    setPopup,
    nftPropertiesHandler,
    attributes,
    setAttributes,
    close,
    setNft,
    nft,
    otherUser,
    singlefeed,
    type,
    setConfirmed,
    page,
    confirmed,
    setData,
    setImage,
    account
}: Iprops) => {
    return (
        <div>
            {state > 0 && (
                <Modal show={show} hide={hide} state={state} close={close} className="my-16">
                    {(() => {
                        switch (state) {
                            case 1: {
                                return <LoginModule setstate={setstate} state={state} />;
                            }
                            case 2: {
                                return <ForgotPasswordModule setstate={setstate} state={state} />;
                            }
                            case 3: {
                                return <EmailSendModule setstate={setstate} />;
                            }
                            case 4: {
                                return <ResetPasswordModule setstate={setstate} />;
                            }
                            case 5: {
                                return <Congratulation setstate={setstate} />;
                            }
                            case 6: {
                                return <SignupModal setstate={setstate} setPopup={setPopup} />;
                            }
                            case 7: {
                                return <Connectmetamask setstate={setstate} data={data} />;
                            }
                            case 8: {
                                return <Connecting setstate={setstate} state={state} data={data} />;
                            }
                            case 9: {
                                return <Connected setstate={setstate} state={state} />;
                            }
                            case 10: {
                                return <Connectednft setstate={setstate} />;
                            }
                            case 11: {
                                return <Connectingnft setstate={setstate} />;
                            }
                            // case 12: {
                            //     return <Connectmetamasknft setstate={setstate} data={data} />;
                            // }
                            case 13: {
                                return <Placebid setstate={setstate} data={data} />;
                            }
                            case 14: {
                                return <Loadingcheckout setstate={setstate} data={data} />;
                            }
                            case 15: {
                                return <Purchasecheckout data={data} />;
                            }
                            case 16: {
                                return <Makeanoffer setstate={setstate} />;
                            }
                            case 17: {
                                return <Loadingbid setstate={setstate} data={data} />;
                            }
                            case 18: {
                                return <Successbid setstate={setstate} data={data} />;
                            }
                            case 19: {
                                return (
                                    <Uploadimg
                                        setstate={setstate}
                                        setPopup={setPopup}
                                        nft={nft}
                                        setConfirmed={setConfirmed}
                                        setNft={setNft}
                                    />
                                );
                            }
                            case 20: {
                                return <Uploadvideo setstate={setstate} setPopup={setPopup} />;
                            }
                            case 21: {
                                return <Createcollection setstate={setstate} data={data} />;
                            }
                            case 22: {
                                return <Followers />;
                            }
                            case 23: {
                                return (
                                    <Following
                                        type={type}
                                        data={data.id}
                                        otherUser={otherUser}
                                        setConfirmed={setConfirmed}
                                    />
                                );
                            }
                            case 24: {
                                return <Sellnow setstate={setstate} data={data} />;
                            }
                            case 25: {
                                return <Congratulationnfts />;
                            }
                            case 26: {
                                return (
                                    <Comments
                                        type={type}
                                        feed={data}
                                        setPopup={setPopup}
                                        setstate={setstate}
                                        setConfirmed={setConfirmed}
                                        page={page}
                                        confirmed={confirmed}
                                        otherUser={otherUser}
                                    />
                                );
                            }
                            case 27: {
                                return <Selltime setstate={setstate} data={data} />;
                            }
                            case 28: {
                                return <Acceptoffer setstate={setstate} />;
                            }
                            case 29: {
                                return (
                                    <AddProperties
                                        setstate={setstate}
                                        nftPropertiesHandler={nftPropertiesHandler}
                                        attributes={attributes}
                                        setAttributes={setAttributes}
                                    />
                                );
                            }
                            case 30: {
                                return (
                                    <CreatePost
                                        setstate={setstate}
                                        setPopup={setPopup}
                                        data={data}
                                        setConfirmed={setConfirmed}
                                    />
                                );
                            }
                            case 31: {
                                return <CopyPostLink data={data} />;
                            }
                            case 33: {
                                return <Report feed={data} setState={setstate} />;
                            }
                            case 32: {
                                return <Changepassword setstate={setstate} />;
                            }
                            case 34: {
                                return <PasswordChangedone setstate={setstate} />;
                            }
                            case 35: {
                                return <BuyLoading setstate={setstate} data={data} />;
                            }
                            case 36: {
                                return <Verifyemail setstate={setstate} data={data} />;
                            }
                            case 37: {
                                return <EditprofileModal setstate={setstate} />;
                            }
                            case 38: {
                                return <Reportnft setstate={setstate} data={data} />;
                            }

                            case 39: {
                                return (
                                    <Loadingbid
                                        text={'Unlisting'}
                                        text2={'Your NFT is being unlisted'}
                                        setstate={setstate}
                                        data={data}
                                    />
                                );
                            }
                            case 40: {
                                return <Choosenft setNft={setNft} setstate={setstate} setData={setData} />;
                            }
                            case 41: {
                                return <Kyc />;
                            }
                            case 42: {
                                return (
                                    <DeletePost
                                        data={data}
                                        setstate={setstate}
                                        singlefeed={singlefeed}
                                        page={page}
                                        setConfirmed={setConfirmed}
                                    />
                                );
                            }
                            case 43: {
                                return <EditCollection setstate={setstate} hide={hide} data={data} />;
                            }
                            case 44: {
                                return <VideoPreview data={data} />;
                            }
                            case 45: {
                                return <MessageImagePreivew setstate={setstate} data={data} />;
                            }
                            case 46: {
                                return <Block data={data} setState={setstate} setConfirmed={setConfirmed} />;
                            }
                            case 47: {
                                return <AppPassword data={data} setState={setstate} hide={hide} />;
                            }
                            case 48: {
                                return <DeleteComment data={data} setstate={setstate} setConfirmed={setConfirmed} />;
                            }
                            case 49: {
                                return <ReportComment data={data} setState={setstate} setConfirmed={setConfirmed} />;
                            }
                            case 50: {
                                return (
                                    <Members data1={data} setState={setstate} setPopup={setPopup} setChat={setData} />
                                );
                            }
                            case 51: {
                                return <DeleteConfirm data={data} setstate={setstate} account={account} />;
                            }
                            case 52: {
                                return (
                                    <CropImage
                                        setstate={setstate}
                                        hide={hide}
                                        data={data?.url}
                                        type={type}
                                        setImage={setImage}
                                    />
                                );
                            }
                            case 53: {
                                return <Settingsdrop setstate={setstate} hide={hide} setData={setData} data={data} />;
                            }
                            case 54: {
                                return <Converter setstate={setstate} hide={hide} />;
                            }
                            case 55: {
                                return <Guidline setstate={setstate} hide={hide} />;
                            }
                            case 56: {
                                return <StayTuned setstate={setstate} hide={hide} />;
                            }
                            case 57: {
                                return <Removemessage setstate={setstate} hide={hide} data={data} />;
                            }
                            case 58: {
                                return <ResendVerificationEmail setstate={setstate} hide={hide} data={data} />;
                            }
                            case 59: {
                                return <AuthanticationAccount setstate={setstate} state={state} />;
                            }
                            case 60: {
                                return <ConfirmPassword setstate={setstate} state={state} />;
                            }
                            case 61: {
                                return <GiftModal setstate={setstate} state={state} data={data} />;
                            }
                            case 62: {
                                return <ReportUser user={data} setState={setstate} />;
                            }
                            case 63: {
                                return <BurnNft setstate={setstate} state={state} data={data} />;
                            }
                            case 64: {
                                return <SwitchNetwork setstate={setstate} data={data} />;
                            }
                            case 65: {
                                return <Scancode setstate={setstate} data={data} />;
                            }
                            case 66: {
                                return <Petetion setstate={setstate} data={data} />;
                            }
                            case 67: {
                                return <TellStory setstate={setstate} data={data} />;
                            }
                            case 68: {
                                return <UploadCover setstate={setstate} data={data} />;
                            }
                            case 69: {
                                return <PositivePopup setstate={setstate} data={data} />;
                            }
                            case 70: {
                                return <NegativePopup setstate={setstate} data={data} />;
                            }
                            case 71: {
                                return <Leaveloober data={data} setstate={setstate} />;
                            }
                            case 72: {
                                return <Calling data={data} setstate={setstate} setData={setData} />;
                            }
                            case 73: {
                                return <Callinguser data={data} setstate={setstate} setData={setData} hide={hide} />;
                            }

                            case 74: {
                                return <Mysterymodal data={data} setstate={setstate} />;
                            }
                            case 75: {
                                return <JoinCalling setstate={setstate} />;
                            }
                            case 76: {
                                return <Addguests setstate={setstate} />;
                            }
                            case 77: {
                                return <Stagerequest setstate={setstate} />;
                            }
                            case 78: {
                                return <Stagechat />;
                            }
                            case 79: {
                                return <CreateStage />;
                            }
                            case 80: {
                                return <DeleteNFT data={data} setstate={setstate} />;
                            }
                            case 81: {
                                return <Privacy setstate={setstate} />;
                            }
                            case 82: {
                                return <EditExternalCollection setstate={setstate} hide={hide} data={data} />;
                            }
                            case 83: {
                                return <ImageView data={data} />;
                            }
                            case 83: {
                                return <ImageView data={data} />;
                            }
                            case 84: {
                                return <CropVideo data={data} />;
                            }
                            case 85: {
                                return <AddAssets />;
                            }
                            case 86: {
                                return <AddAssetsAll />;
                            }
                            case 87: {
                                return <NotVerified setstate={setstate} />;
                            }
                            case 88: {
                                return <MakeOffer setstate={setstate} data={data} />;
                            }
                            case 89: {
                                return <SuccessfullyOffered setstate={setstate} data={data} />;
                            }
                            case 90: {
                                return <RedeemConfirm setstate={setstate} data={data} />;
                            }
                            case 91: {
                                return <Schedulepost data={data} setstate={setstate} />;
                            }
                            case 92: {
                                return <Poll setConfirmed={setConfirmed} setstate={setstate} />;
                            }
                            case 93: {
                                return <ReferelGallery setstate={setstate} data={data} setConfirmed={setConfirmed} />;
                            }
                            case 94: {
                                return <ReferralConfirmation setstate={setstate} />;
                            }
                            case 95: {
                                return <PollVoters setstate={setstate} data={data} />;
                            }
                            case 96: {
                                return <ScheduleCaleder />;
                            }
                            case 97: {
                                return <SettingsNotifications setstate={setstate} hide={hide} data={data} />;
                            }
                            case 98: {
                                return <EditIslandprofileModal setstate={setstate} hide={hide} data={data} />;
                            }
                            case 99: {
                                return <EditLandprofileModal setstate={setstate} hide={hide} data={data} />;
                            }
                            case 100: {
                                return <TopLandownerComponent />;
                            }
                            case 101: {
                                return <TopLandownerModule />;
                            }
                            case 102: {
                                return <EditMyLands />;
                            }
                            default:
                                break;
                        }
                    })()}

                    {/* {children} */}
                </Modal>
            )}
        </div>
    );
};

export default memo(Popups);
