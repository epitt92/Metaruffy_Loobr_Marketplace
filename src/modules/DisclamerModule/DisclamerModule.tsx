import React, { useEffect, useState } from 'react';
import { userService } from '../../services/user.service';
// import dompurify from 'dompurify';
import DOMPurify from 'isomorphic-dompurify';
const DisclamerModule = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setDate] = useState<any>();
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        let res = await userService.getContent();
        setLoading(false);
        setDate(res?.data?.data?.disclamer);
    };
    return (
        <div className="container mb-[35rem]">
            <h2 className="text-[3.5rem] text-white mt-12">Disclamer</h2>
            {loading ? (
                <div className=" text-center   ">
                    <figure className="mt-12">
                        <div className="loadingio-spinner-rolling-jz7efhw30v">
                            <div className="ldio-fcd0x3izul5">
                                <div></div>
                            </div>
                        </div>
                    </figure>
                </div>
            ) : (
                <p
                    className="AtContentText text-white Attext mt-12"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(data)
                    }}></p>
            )}
            {/* <p className="Attext mt-12">
                We do not guarantee, represent or warrant that your use of our Service will be uninterrupted, timely,
                secure, or error-free.
            </p>
            <p className="Attext mt-4">
                We do not warrant that the results that may be obtained from the use of the Service will be accurate or
                reliable.
            </p>
            <p className="Attext mt-8">
                You agree that from time to time, we may remove the Service for indefinite periods of time or cancel the
                Service at any time, without notice to you. You expressly agree that your use or inability to use the
                Service is at your sole risk. The Service and all products and services delivered to you through the
                website are (except as expressly stated by us) provided &apos;as is&apos; and &apos;as available for
                your use, without any representation, warranties, or conditions of any kind, either express or implied,
                including all implied warranties or conditions of merchantability, merchantable quality, fitness for a
                particular purpose, durability, title, and non-infringement.{' '}
                <span className="font-Proxima-Bold">
                    In no case shall LooBr, our directors, officers, employees, affiliates, agents, contractors,
                    interns, suppliers, service providers, or licensors be liable for any injury, loss, claim, or any
                    direct, indirect, incidental, punitive, special, or consequential damages of any kind, including,
                    without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any
                    similar damages, whether based in contract, tort (including negligence), strict liability or
                    otherwise, arising from your use of any of the Service or any products procured using the Service,
                    or for any other claim related in any way to your use of the Service or any product, including, but
                    not limited to, any errors or omissions in any content, or any loss or damage of any kind incurred
                    as a result of the use of the Service or any content (or product) posted, transmitted, or otherwise
                    made available via the Service, even if advised of their possibility.
                </span>
            </p>
            <p className="Attext mt-4">
                Because some jurisdictions do not allow the exclusion or the limitation of liability for consequential
                or incidental damages, in such jurisdictions, our liability shall be limited to the maximum extent
                permitted by law.
            </p>
            <p className="Attext font-Proxima-Bold mt-4">
                You agree to indemnify, defend and hold harmless LooBr and our parent, subsidiaries, affiliates,
                partners, officers, directors, agents, contractors, licensors, service providers, subcontractors,
                suppliers, interns, and employees harmless from any claim or demand, including reasonable
                attorneys&apos; fees, made by any third party due to or arising out of your breach of these Terms of
                Service or the documents they incorporate by reference or your violation of any law or the rights of a
                third-party.
            </p> */}
        </div>
    );
};

export default DisclamerModule;
