import React, { useEffect, useState } from 'react';
import { userService } from '../../services/user.service';
// import dompurify from 'dompurify';
import DOMPurify from 'isomorphic-dompurify';
const DataProtectionModule = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setDate] = useState<any>();
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        let res = await userService.getContent();
        setLoading(false);
        setDate(res?.data?.data?.protection);
    };
    return (
        <div className="container mb-48">
            <h2 className="text-[3.5rem] text-white my-12">Data protection</h2>
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
                    className="AtContentText list-disc text-white Attext mt-12"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(data)
                    }}></p>
            )}
            {/* <h3 className="Athead">Policy brief & purpose</h3>
            <p className="Attext">
                <span className="font-Proxima-Bold">The LooBr Data Protection Policy</span>
                refers to our commitment to treating the information of our platform users and other interested parties
                with the utmost care and confidentiality.
            </p>
            <p className="Attext mt-4">
                With this policy, we ensure that we gather, store and handle data reasonably, transparently, and respect
                individual rights.
            </p>
            <h3 className="Athead">Scope</h3>
            <p className="Attext">
                This policy refers to all parties (users, artists, players, traders, etc.) who provide us with any
                information.
            </p>
            <h3 className="Athead">Our Data Protection Policy covers?</h3>
            <p className="Attext">
                Employees of our company and its subsidiaries must follow this policy. Contractors, consultants,
                partners, and other external entities are also covered. Generally, our policy refers to anyone we
                collaborate with or acts on our behalf and may need occasional access to data.
            </p>
            <h3 className="Athead">Policy elements</h3>
            <p className="Attext">
                As part of our operations, we need to obtain and process information. This information includes any
                offline or online data that makes a person identifiable such as names, addresses, usernames and
                passwords, digital footprints, photographs, financial data, etc.
            </p>
            <p className="Attext mt-8">
                Our company transparently collects this information and only with the full cooperation and knowledge of
                interested parties. Once this information is available to us, the following rules apply.
            </p>
            <p className="Attext mt-8 mb-4">Our data will be:</p>
            <ul>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">Accurate and kept up-to-date</span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">Collected fairly and for lawful purposes only</span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">
                        Processed by the company within its legal and moral boundaries
                    </span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">
                        Protected against any unauthorized or illegal access by internal or external parties
                    </span>
                </li>
            </ul>
            <p className="Attext mt-8 mb-4">Our data will not be:</p>
            <ul>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">Communicated informally</span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">Stored for more than a specified amount of time</span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">
                        Transferred to organizations, states, or countries that do not have adequate data protection
                        policies
                    </span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">
                        Distributed to any party other than the ones agreed upon by the data’s owner (exempting
                        legitimate requests from law enforcement authorities)
                    </span>
                </li>
            </ul>
            <p className="Attext mt-4">
                In addition to handling the data, the company has direct obligations toward the people to whom the data
                belongs.
            </p>
            <p className="Attext mt-8 mb-4">Specifically, we must:</p>
            <ul>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8"> Let people know which of their data is collected</span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">Inform people about how we’ll process their data</span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">Inform people about who has access to their information</span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">
                        Have provisions in cases of lost, corrupted, or compromised data
                    </span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">
                        Allow people to request that we modify, erase, reduce, or correct data contained in our
                        databases
                    </span>
                </li>
            </ul>
            <h3 className="Athead">Actions</h3>
            <p className="Attext mt-8 mb-4">To exercise data protection, we&apos;re committed to:</p>
            <ul>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">Restrict and monitor access to sensitive data</span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">Develop transparent data collection procedures</span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">Train employees in online privacy and security measures</span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">
                        Build secure networks to protect online data from cyberattacks
                    </span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">
                        Establish clear procedures for reporting privacy breaches or data misuse
                    </span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">
                        Include contract clauses or communicate statements on how we handle data
                    </span>
                </li>
                <li className="Attext list-disc ml-4">
                    <span className="relative left-8">
                        Establish data protection practices (secure locks, data encryption, frequent backups, access
                        authorization etc.)
                    </span>
                </li>
            </ul>
            <p className="Attext mt-4">Our data protection provisions will be linked on our website.</p>
            <h3 className="Athead">Disciplinary Consequences</h3>
            <p className="Attext mt-8">
                All principles described in this policy must be strictly followed. A breach of data protection
                guidelines will invoke disciplinary and possibly legal action.
            </p> */}
        </div>
    );
};

export default DataProtectionModule;
