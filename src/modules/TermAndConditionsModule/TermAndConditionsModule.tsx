import React, { useEffect, useState } from 'react';
import { userService } from '../../services/user.service';
// import dompurify from 'dompurify';
import DOMPurify from 'isomorphic-dompurify';
const TermAndConditionsModule = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setDate] = useState<any>();
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        let res = await userService.getContent();
        setLoading(false);
        setDate(res?.data?.data?.terms);
    };
    return (
        <div className="container mb-48">
            <h2 className="text-[3.5rem] text-white mt-12">Terms & Conditions</h2>
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
            {/* <h3 className="Athead">OVERVIEW</h3>
            <p className="Attext">
                LooBr and Metaruffy International FZCO operate this website. Throughout the site, the terms
                &quot;we,&quot; &quot;us,&quot; and &quot;our&quot; refer to LooBr. LooBr offers this website, including
                all information, tools, and services available from this site to you, the user, conditioned upon your
                acceptance of all terms, conditions, policies, and notices stated here.
            </p>
            <p className="Attext mt-8">
                By visiting our site or purchasing something from this site, you engage in our &quot;Service.&quot;
                Accordingly, you agree to be bound by the following terms and conditions (&quot;Terms of Service,&quot;
                &quot;Terms&quot;), including those additional terms and conditions and policies referenced herein or
                available by hyperlink. These Terms of Service apply to all users of the site, including without
                limitation users who are browsers, vendors, customers, merchants, or contributors of content.
            </p>
            <p className="Attext mt-8">
                Please read these Terms of Service carefully before accessing or using our website. You agree to be
                bound by these Terms of Service by accessing or using any part of the site. If you do not agree to all
                the terms and conditions of this agreement, then you may not access the website or use any services. If
                these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of
                Service.
            </p>
            <p className="Attext mt-8">
                Any new features or tools which are added to the current site shall also be subject to the Terms of
                Service. You can review the most current version of the Terms of Service at any time on this page. We
                reserve the right to update, change or replace any part of these Terms of Service by posting updates or
                changes to our website. It is your responsibility to check this page periodically for changes. Your
                continued use of or access to the website after posting any changes constitutes acceptance of those
                changes.
            </p>
            <h3 className="Athead">SECTION 1 - ONLINE STORE TERMS</h3>
            <p className="Attext mt-4">
                By agreeing to these Terms of Service, you represent that you are at least the majority age in your
                residence.
            </p>
            <p className="Attext mt-4">
                Or that you are the age of majority in your residence, and you have given us your consent to allow any
                of your minor dependents to use this site.
            </p>
            <p className="Attext mt-4">
                You may not use our products and services for any illegal or unauthorized purpose, nor may you, in using
                our platform and Services, violate any laws in your jurisdiction (including but not limited to copyright
                laws).
            </p>
            <p className="Attext mt-4">You must not transmit any worms, viruses, or code of a destructive nature.</p>
            <p className="Attext mt-4">
                A breach or violation of any of the Terms will result in an immediate termination of your account.
            </p>
            <h3 className="Athead">SECTION 2 - GENERAL CONDITIONS</h3>
            <p className="Attext ">
                We reserve the right to refuse access to LooBr or its services to anyone for any reason at any time.
            </p>
            <p className="Attext mt-4">
                You understand that your content (not including your crypto wallet information) may be transferred
                unencrypted and involve (a) transmissions over various networks, and (b) changes to conform and adapt to
                the technical requirements of connecting networks or devices. Crypto wallet information is always
                encrypted during transfer over blockchain networks.
            </p>
            <p className="Attext mt-4">
                You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the LooBr site, use
                of LooBr features and services, or access the LooBr features and services or any contact or user profile
                on the website through which the Service is provided, without express written permission by us.
            </p>
            <p className="Attext mt-4">
                The headings used in this agreement are included for convenience only and will not limit or otherwise
                affect these Terms.
            </p>
            <h3 className="Athead">SECTION 3 - ACCURACY, COMPLETENESS, AND TIMELINESS OF INFORMATION</h3>
            <p className="Attext ">
                We are not responsible if information made available on this site is not accurate, complete, or current.
                The material on this site is provided for general information only. It should not be relied upon or used
                as the sole basis for making decisions without consulting primary, more accurate, complete, or timely
                sources of information. Any reliance on the material on this site is at your own risk
            </p>
            <p className="Attext mt-4">
                This site may contain certain historical information. Historical information, necessarily, is not
                current and is provided for your reference only. We reserve the right to modify the contents of this
                site at any time, but we have no obligation to update any information on our site. You agree that it is
                your responsibility to monitor changes to our site.
            </p>
            <h3 className="Athead">SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES</h3>
            <p className="Attext ">
                Prices for the products or services on this site are subject to change without notice.
            </p>
            <p className="Attext mt-4">
                We reserve the right at any time to modify or discontinue any feature or Service (or any part or content
                thereof) without notice.
            </p>
            <p className="Attext mt-4">
                We shall not be liable to you or any third party for any modification, price change, suspension, or
                discontinuance of the features or services.
            </p>
            <h3 className="Athead">SECTION 5 - PRODUCTS OR SERVICES (if applicable)</h3>
            <p className="Attext ">
                Certain products or services may be available exclusively online through the website. These products or
                services may have limited quantities.
            </p>
            <p className="Attext mt-4">
                We have made every effort to display as accurately as possible the colors and images of the digital art
                products that appear on this site. We cannot guarantee that your computer monitor&apos;s display of any
                color will be accurate.
            </p>
            <p className="Attext mt-4">
                We reserve the right but are not obligated to limit the offering of our features or Services to any
                person, geographic region, or jurisdiction. We may exercise this right on a case-by-case basis. We
                reserve the right to limit the feature or services that we offer. All descriptions of digital art
                products or pricing are subject to change at any time without notice, at the sole discretion of the
                product owner. We reserve the right to remove any digital art product at any time. Any offer for any
                digital product or Service offered made on this site is void where prohibited.
            </p>
            <p className="Attext mt-4">
                We do not warrant that the quality of any digital products, services, information, or other material
                purchased or obtained by you will meet your expectations or that any errors in the features or Services
                will be corrected.
            </p>
            <h3 className="Athead">SECTION 6 - ACCURACY ACCOUNT INFORMATION</h3>
            <p className="Attext ">
                You agree to provide current, complete, and accurate account information for all transactions performed
                on our site. You agree to promptly update your account and other information, including your email
                address.
            </p>
            <h3 className="Athead">SECTION 7 - OPTIONAL TOOLS</h3>
            <p className="Attext ">
                We may provide you with access to third-party tools over which we neither monitor nor have any control
                nor input.
            </p>
            <p className="Attext mt-4">
                You acknowledge and agree that we provide access to such tools&quot; as is&quot; and &quot;as
                available&quot; without any warranties, representations, or conditions of any kind and without any
                endorsement. We shall have no liability whatsoever arising from or relating to your use of optional
                third-party tools.
            </p>
            <p className="Attext mt-4">
                Any use by you of optional tools offered through the site is entirely at your own risk and discretion,
                and you should ensure that you are familiar with and approve of the terms on which tools are provided by
                the relevant third-party provider(s).
            </p>
            <p className="Attext mt-4">
                We may also, in the future, offer new services or features through the website (including the release of
                new tools and resources). Such new features or services shall also be subject to these Terms of Service.
            </p>
            <h3 className="Athead">SECTION 8 - THIRD-PARTY LINKS</h3>
            <p className="Attext ">
                Certain content, products, and services available via our site may include third-party materials.
            </p>
            <p className="Attext mt-4">
                Third-party links on this site may direct you to third-party websites not affiliated with us. We are not
                responsible for examining or evaluating the content or accuracy, and we do not warrant it. We will not
                have any liability or responsibility for any third-party materials or websites or any other materials,
                products, or services of third parties.
            </p>
            <p className="Attext mt-4">
                We are not liable for any harm or damages related to the purchase or use of goods, services, resources,
                content, or any other transactions connected with any third-party websites. Please review the
                third-party&apos;s policies and practices carefully and ensure you understand them before engaging in
                any transaction. Complaints, claims, concerns, or questions regarding third-party products should be
                directed to the third party.
            </p>
            <h3 className="Athead">SECTION 9 - USER COMMENTS, FEEDBACK, AND OTHER SUBMISSIONS</h3>
            <p className="Attext ">
                Suppose, at our request, you send certain specific submissions (for example, contest entries) or without
                a request from us, you send creative ideas, suggestions, proposals, plans, or other materials, whether
                online, by email, by postal mail, or otherwise (collectively, &apos;comments&apos;).
            </p>
            <p className="Attext mt-4">
                In that case, you agree that we may, without restriction, edit, copy, publish, distribute, translate,
                and otherwise use any comments you forward to us in any medium. We are and shall be under no obligation:
            </p>
            <p className="Attext mt-4">To maintain any comments in confidence</p>
            <p className="Attext mt-4">To pay compensation for any comments</p>
            <p className="Attext mt-4">To respond to any comments</p>
            <p className="Attext mt-4">
                We may have no obligation to monitor, edit or remove content that we determine in our sole discretion
                are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene, or otherwise
                objectionable or violates any party&apos;s intellectual property or these Terms of Service.
            </p>
            <p className="Attext mt-4">
                You agree that your comments will not violate any third party&apos;s right, including copyright,
                trademark, privacy, personality, or other personal or proprietary rights. You further agree that your
                comments will not contain libelous or otherwise unlawful, abusive, or obscene material or any computer
                virus or other malware that could affect the operation of the Service or any related website. You may
                not use a false email address, pretend to be someone other than yourself, or otherwise mislead us or
                third parties as to the origin of any comments. You are solely responsible for any comments you make and
                their accuracy. We take no responsibility and assume no liability for any comments posted by you or any
                third party.
            </p>
            <h3 className="Athead">SECTION 10 - PERSONAL INFORMATION</h3>
            <p className="Attext ">
                Our Privacy Policy governs your submission of personal information through the site. To view our Privacy
                Policy.
            </p>
            <h3 className="Athead">SECTION 11 - ERRORS, INACCURACIES, AND OMISSIONS</h3>
            <p className="Attext ">
                Occasionally there may be information on our site or in the Service that contains typographical errors,
                inaccuracies, or omissions that may relate to product descriptions, pricing, promotions, offers, and
                availability. We reserve the right to correct any errors, inaccuracies, or omissions and to change or
                update information if any information in the Service or on any related website is inaccurate without
                prior notice.
            </p>
            <p className="Attext mt-4">
                We undertake no obligation to update, amend or clarify information in the Service or on any related
                website, including, without limitation, transactions fee information, except as required by law. No
                specified update or refresh date applied in the Service or on any related website should be taken to
                indicate that all information in the Service or related website has been modified or updated.
            </p>
            <h3 className="Athead">SECTION 12 - PROHIBITED USES</h3>
            <p className="Attext ">
                In addition to other prohibitions as outlined in the Terms of Service, you are prohibited from using the
                site or its content:
            </p>
            <p className="Attext mt-4">
                (a) for any unlawful purpose; (b) to solicit others to perform or participate in any unlawful acts; (c)
                to violate any international, federal, provincial, or state regulations, rules, laws, or local
                ordinances; (d) to infringe upon or violate our intellectual property rights or the intellectual
                property rights of others; (e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate,
                or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or
                disability; (f) to submit false or misleading information;
            </p>
            <p className="Attext mt-4">
                (g) to upload or transmit viruses or any other type of malicious code that will or may be used in any
                way that will affect the functionality or operation of the Service or site or of any related website,
                other websites, or the Internet; (h) to collect or track the personal information of others; (i) to
                spam, phish, pharm, pretext, spider, crawl, or scrape; (j) for any obscene or immoral purpose; or (k) to
                interfere with or circumvent the security features of the Service or any related website, other
                websites, or the Internet. We reserve the right to terminate your account and the use of the Service or
                any related website for violating any prohibited uses.
            </p>
            <h3 className="Athead">SECTION 13 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY</h3>
            <p className="Attext ">
                We do not guarantee, represent or warrant that your use of our Service will be uninterrupted, timely,
                secure, or error-free.
            </p>
            <p className="Attext mt-4">
                We do not warrant that the results that may be obtained from the use of the Service will be accurate or
                reliable.
            </p>
            <p className="Attext mt-4">
                You agree that from time to time, we may remove the Service for indefinite periods of time or cancel the
                Service at any time, without notice to you.
            </p>
            <p className="Attext mt-4">
                You expressly agree that your use or inability to use the Service is at your sole risk. The Service and
                all products and services delivered to you through the website are (except as expressly stated by us)
                provided &apos;as is&apos; and &apos;as available for your use, without any representation, warranties,
                or conditions of any kind, either express or implied, including all implied warranties or conditions of
                merchantability, merchantable quality, fitness for a particular purpose, durability, title, and
                non-infringement.
            </p>
            <p className="Attext mt-4">
                In no case shall LooBr, our directors, officers, employees, affiliates, agents, contractors, interns,
                suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct,
                indirect, incidental, punitive, special, or consequential damages of any kind, including, without
                limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar
                damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising
                from your use of any of the Service or any products procured using the Service, or for any other claim
                related in any way to your use of the Service or any product, including, but not limited to, any errors
                or omissions in any content, or any loss or damage of any kind incurred as a result of the use of the
                Service or any content (or product) posted, transmitted, or otherwise made available via the Service,
                even if advised of their possibility.
            </p>
            <p className="Attext mt-4">
                Because some jurisdictions do not allow the exclusion or the limitation of liability for consequential
                or incidental damages, in such jurisdictions, our liability shall be limited to the maximum extent
                permitted by law.
            </p>
            <h3 className="Athead">SECTION 14 - INDEMNIFICATION</h3>
            <p className="Attext ">
                You agree to indemnify, defend and hold harmless LooBr and our parent, subsidiaries, affiliates,
                partners, officers, directors, agents, contractors, licensors, service providers, subcontractors,
                suppliers, interns, and employees harmless from any claim or demand, including reasonable
                attorneys&apos; fees, made by any third party due to or arising out of your breach of these Terms of
                Service or the documents they incorporate by reference or your violation of any law or the rights of a
                third-party.
            </p>
            <h3 className="Athead">SECTION 15 - SEVERABILITY</h3>
            <p className="Attext ">
                If any provision of these Terms of Service is determined to be unlawful, void, or unenforceable, such
                provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the
                unenforceable portion shall be deemed to be severed from these Terms of Service, such determination
                shall not affect the validity and enforceability of any other remaining provisions.
            </p>
            <h3 className="Athead">SECTION 16 - ENTIRE AGREEMENT</h3>
            <p className="Attext ">
                Our failure to exercise or enforce any right or provision of these Terms of Service shall not constitute
                a waiver of such right or provision.
            </p>
            <p className="Attext mt-4">
                These Terms of Service and any policies or operating rules posted by us on this site or in respect to
                The Service constitute the entire agreement and understanding between you and us. They govern your use
                of the Service, superseding any prior or contemporaneous agreements, communications, and proposals,
                whether oral or written, between you and us (including, but not limited to, any prior versions of the
                Terms of Service).
            </p>
            <p className="Attext mt-4">
                Any ambiguities in interpreting these Terms of Service shall not be construed against the drafting
                party.
            </p>
            <h3 className="Athead">SECTION 17 - GOVERNING LAW</h3>
            <p className="Attext ">
                These Terms of Service and any separate agreements whereby we provide you Services shall be governed by
                and construed in accordance with the laws of Dubai UAE.
            </p>
            <h3 className="Athead">SECTION 18 - CHANGES TO TERMS OF SERVICE</h3>
            <p className="Attext ">
                You can review the most current version of the Terms of Service at any time on this page.
            </p>
            <p className="Attext mt-4">
                At our sole discretion, we reserve the right to update, change or replace any part of these Terms of
                Service by posting updates and changes to our website. It is your responsibility to check our website
                periodically for changes. Your continued use of or access to our website or the Service following the
                posting of any changes to these Terms of Service constitutes acceptance of those changes.
            </p>
            <h3 className="Athead">SECTION 19 - CONTACT INFORMATION</h3>
            <p className="Attext ">Questions about the Terms of Service should be sent to us at info@metaruffy.io.</p> */}
        </div>
    );
};

export default TermAndConditionsModule;
