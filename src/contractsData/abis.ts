export const tokenABI = [
    {
        inputs: [
            { internalType: 'string', name: 'name', type: 'string' },
            {
                internalType: 'string',
                name: 'symbol',
                type: 'string'
            },
            {
                internalType: 'uint256',
                name: 'initialSupply',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address'
            }
        ],
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'Approval',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address'
            }
        ],
        name: 'OwnershipTransferred',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'Transfer',
        type: 'event'
    },
    {
        inputs: [],
        name: 'BP',
        outputs: [
            {
                internalType: 'contract BPContract',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'BPDisabledForever',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'DEAD_ADDRESS',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address'
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address'
            }
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'bpEnabled',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        name: 'burn',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'subtractedValue',
                type: 'uint256'
            }
        ],
        name: 'decreaseAllowance',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'addedValue',
                type: 'uint256'
            }
        ],
        name: 'increaseAllowance',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        name: 'lockTokens',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: '_bp', type: 'address' }],
        name: 'setBPAddress',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'setBotProtectionDisableForever',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'bool', name: '_enabled', type: 'bool' }],
        name: 'setBpEnabled',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address'
            },
            { internalType: 'address', name: 'to', type: 'address' },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address'
            }
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
];

export const daoAbi = [
    {
        inputs: [
            { internalType: 'contract IERC20', name: '_mrToken', type: 'address' },
            { internalType: 'uint256', name: '_votePower', type: 'uint256' },
            { internalType: 'uint256', name: '_proposalPower', type: 'uint256' }
        ],
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'proposalId', type: 'uint256' },
            { indexed: false, internalType: 'address', name: 'applicantAddress', type: 'address' }
        ],
        name: 'CancelProposal',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
        ],
        name: 'OwnershipTransferred',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'proposer', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'paymentRequested', type: 'uint256' },
            { indexed: false, internalType: 'string', name: 'details', type: 'string' },
            { indexed: false, internalType: 'bool[6]', name: 'flags', type: 'bool[6]' },
            { indexed: false, internalType: 'uint256', name: 'proposalId', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'senderAddress', type: 'address' }
        ],
        name: 'ProcessedProposal',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'address', name: 'proposer', type: 'address' },
            { indexed: false, internalType: 'string', name: 'details', type: 'string' },
            { indexed: false, internalType: 'uint256', name: 'proposalId', type: 'uint256' }
        ],
        name: 'SubmitProposal',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'proposalIndex', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'memberAddress', type: 'address' },
            { indexed: false, internalType: 'uint8', name: 'uintVote', type: 'uint8' }
        ],
        name: 'SubmitVote',
        type: 'event'
    },
    {
        inputs: [],
        name: 'mrToken',
        outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'proposalCount',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'proposalQueue',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'proposals',
        outputs: [
            { internalType: 'address', name: 'proposer', type: 'address' },
            { internalType: 'uint256', name: 'startingTime', type: 'uint256' },
            { internalType: 'uint256', name: 'yesVotes', type: 'uint256' },
            { internalType: 'uint256', name: 'noVotes', type: 'uint256' },
            { internalType: 'string', name: 'details', type: 'string' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
        inputs: [{ internalType: 'address', name: '_newToken', type: 'address' }],
        name: 'setMRToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: '_newValue', type: 'uint256' }],
        name: 'setProposalPower',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: '_newValue', type: 'uint256' }],
        name: 'setVotepower',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'string', name: 'details', type: 'string' }],
        name: 'submitProposal',
        outputs: [{ internalType: 'uint256', name: 'proposalId', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'proposalId', type: 'uint256' },
            { internalType: 'uint8', name: 'uintVote', type: 'uint8' }
        ],
        name: 'submitVote',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    { stateMutability: 'payable', type: 'receive' }
];

export const collectionABI = [
    {
        inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'qty', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' }
        ],
        name: 'AdminMinted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'approved', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
        ],
        name: 'Approval',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'operator', type: 'address' },
            { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' }
        ],
        name: 'ApprovalForAll',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'minter', type: 'address' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'string', name: 'uri', type: 'string' },
            { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
        ],
        name: 'Minted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'minter', type: 'address' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' },
            { indexed: false, internalType: 'string[]', name: 'URIs', type: 'string[]' }
        ],
        name: 'MultiMinted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
        ],
        name: 'OwnershipTransferred',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, internalType: 'uint256', name: 'maxSupply', type: 'uint256' }],
        name: 'SetMaxSupply',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
            { indexed: false, internalType: 'address', name: 'receiver', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'rate', type: 'uint256' }
        ],
        name: 'SetRoyalty',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'from', type: 'address' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
        ],
        name: 'Transfer',
        type: 'event'
    },
    {
        inputs: [],
        name: 'MAX_ROYALTY',
        outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
        ],
        name: 'approve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'contract IERC20', name: 'erc20', type: 'address' }],
        name: 'clearStuckTokens',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'creators',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: '_id', type: 'uint256' }],
        name: 'exists',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'getApproved',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'address', name: 'operator', type: 'address' }
        ],
        name: 'isApprovedForAll',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'maxSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: '_to', type: 'address' },
            { internalType: 'string', name: 'uri', type: 'string' }
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'string[]', name: 'URIs', type: 'string[]' },
            { internalType: 'address', name: '_to', type: 'address' }
        ],
        name: 'multiMint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'ownerOf',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
            { internalType: 'uint256', name: '_salePrice', type: 'uint256' }
        ],
        name: 'royaltyInfo',
        outputs: [
            { internalType: 'address', name: 'receiver', type: 'address' },
            { internalType: 'uint256', name: 'royaltyAmount', type: 'uint256' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'from', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'from', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
            { internalType: 'bytes', name: '_data', type: 'bytes' }
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'operator', type: 'address' },
            { internalType: 'bool', name: 'approved', type: 'bool' }
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: '_maxSupply', type: 'uint256' }],
        name: 'setMaxSupply',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
            { internalType: 'address', name: '_receiver', type: 'address' },
            { internalType: 'uint16', name: '_royalty', type: 'uint16' }
        ],
        name: 'setRoyalty',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
        name: 'supportsInterface',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
        name: 'tokenByIndex',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'uint256', name: 'index', type: 'uint256' }
        ],
        name: 'tokenOfOwnerByIndex',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'tokenURI',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
        name: 'tokensOfOwner',
        outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'from', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
];

export const offerABI = [
    {
        inputs: [
            { internalType: 'address', name: '_owner', type: 'address' },
            { internalType: 'uint256', name: '_feeRate', type: 'uint256' },
            { internalType: 'address', name: '_revenueAddress', type: 'address' }
        ],
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'bytes32', name: '_id', type: 'bytes32' },
            { indexed: true, internalType: 'address', name: '_tokenAddress', type: 'address' },
            { indexed: true, internalType: 'uint256', name: '_tokenId', type: 'uint256' },
            { indexed: false, internalType: 'address', name: '_bidder', type: 'address' },
            { indexed: true, internalType: 'address', name: '_seller', type: 'address' },
            { indexed: false, internalType: 'uint256', name: '_price', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: '_fee', type: 'uint256' }
        ],
        name: 'BidAccepted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'bytes32', name: '_id', type: 'bytes32' },
            { indexed: true, internalType: 'address', name: '_tokenAddress', type: 'address' },
            { indexed: true, internalType: 'uint256', name: '_tokenId', type: 'uint256' },
            { indexed: true, internalType: 'address', name: '_bidder', type: 'address' }
        ],
        name: 'BidCancelled',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'bytes32', name: '_id', type: 'bytes32' },
            { indexed: true, internalType: 'address', name: '_tokenAddress', type: 'address' },
            { indexed: true, internalType: 'uint256', name: '_tokenId', type: 'uint256' },
            { indexed: true, internalType: 'address', name: '_bidder', type: 'address' },
            { indexed: false, internalType: 'uint256', name: '_price', type: 'uint256' },
            { indexed: false, internalType: 'uint256', name: '_expiresAt', type: 'uint256' },
            { indexed: false, internalType: 'address', name: 'erc20Address', type: 'address' }
        ],
        name: 'BidCreated',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
        ],
        name: 'OwnershipTransferred',
        type: 'event'
    },
    {
        inputs: [],
        name: 'ERC721Composable_ValidateFingerprint',
        outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'ERC721_Interface',
        outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'ERC721_Received',
        outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'FEE_RATE_BASE',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'MAX_BID_DURATION',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'MIN_BID_DURATION',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'ONE_MILLION',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: '_tokenAddress', type: 'address' },
            { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
            { internalType: 'bytes32', name: '_bidId', type: 'bytes32' }
        ],
        name: 'acceptBid',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'uint256', name: '', type: 'uint256' }
        ],
        name: 'bidCounterByToken',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'uint256', name: '', type: 'uint256' },
            { internalType: 'address', name: '', type: 'address' }
        ],
        name: 'bidIdByTokenAndBidder',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        name: 'bidIndexByBidId',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: '_tokenAddress', type: 'address' },
            { internalType: 'uint256', name: '_tokenId', type: 'uint256' }
        ],
        name: 'cancelBid',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'feeRate',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: '_tokenAddress', type: 'address' },
            { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
            { internalType: 'address', name: '_bidder', type: 'address' }
        ],
        name: 'getBidByBidder',
        outputs: [
            { internalType: 'uint256', name: 'bidIndex', type: 'uint256' },
            { internalType: 'bytes32', name: 'bidId', type: 'bytes32' },
            { internalType: 'address', name: 'bidder', type: 'address' },
            { internalType: 'uint256', name: 'price', type: 'uint256' },
            { internalType: 'uint256', name: 'expiresAt', type: 'uint256' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: '_tokenAddress', type: 'address' },
            { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
            { internalType: 'uint256', name: '_index', type: 'uint256' }
        ],
        name: 'getBidByToken',
        outputs: [
            { internalType: 'bytes32', name: '', type: 'bytes32' },
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'uint256', name: '', type: 'uint256' },
            { internalType: 'uint256', name: '', type: 'uint256' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: '_tokenAddress', type: 'address' },
            { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
            { internalType: 'uint256', name: '_price', type: 'uint256' },
            { internalType: 'uint256', name: '_duration', type: 'uint256' },
            { internalType: 'address', name: '_erc20Address', type: 'address' }
        ],
        name: 'placeBid',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address[]', name: '_tokenAddresses', type: 'address[]' },
            { internalType: 'uint256[]', name: '_tokenIds', type: 'uint256[]' },
            { internalType: 'address[]', name: '_bidders', type: 'address[]' }
        ],
        name: 'removeExpiredBids',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
        inputs: [
            { internalType: 'address', name: '_erc20ContractAddress', type: 'address' },
            { internalType: 'bool', name: '_toggler', type: 'bool' }
        ],
        name: 'toggleContractWhitelist',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
];

export const erc721ABI = [
    {
        inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'qty', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' }
        ],
        name: 'AdminMinted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'approved', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
        ],
        name: 'Approval',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'operator', type: 'address' },
            { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' }
        ],
        name: 'ApprovalForAll',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'minter', type: 'address' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'string', name: 'uri', type: 'string' },
            { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
        ],
        name: 'Minted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'minter', type: 'address' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' },
            { indexed: false, internalType: 'string[]', name: 'URIs', type: 'string[]' }
        ],
        name: 'MultiMinted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
            { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
        ],
        name: 'OwnershipTransferred',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [{ indexed: false, internalType: 'uint256', name: 'maxSupply', type: 'uint256' }],
        name: 'SetMaxSupply',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
            { indexed: false, internalType: 'address', name: 'receiver', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'rate', type: 'uint256' }
        ],
        name: 'SetRoyalty',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'from', type: 'address' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }
        ],
        name: 'Transfer',
        type: 'event'
    },
    {
        inputs: [],
        name: 'MAX_ROYALTY',
        outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
        ],
        name: 'approve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'contract IERC20', name: 'erc20', type: 'address' }],
        name: 'clearStuckTokens',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'creators',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: '_id', type: 'uint256' }],
        name: 'exists',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'getApproved',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'address', name: 'operator', type: 'address' }
        ],
        name: 'isApprovedForAll',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'maxSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: '_to', type: 'address' },
            { internalType: 'string', name: 'uri', type: 'string' }
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'string[]', name: 'URIs', type: 'string[]' },
            { internalType: 'address', name: '_to', type: 'address' }
        ],
        name: 'multiMint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'ownerOf',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
    {
        inputs: [
            { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
            { internalType: 'uint256', name: '_salePrice', type: 'uint256' }
        ],
        name: 'royaltyInfo',
        outputs: [
            { internalType: 'address', name: 'receiver', type: 'address' },
            { internalType: 'uint256', name: 'royaltyAmount', type: 'uint256' }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'from', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'from', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
            { internalType: 'bytes', name: '_data', type: 'bytes' }
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'operator', type: 'address' },
            { internalType: 'bool', name: 'approved', type: 'bool' }
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: '_maxSupply', type: 'uint256' }],
        name: 'setMaxSupply',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
            { internalType: 'address', name: '_receiver', type: 'address' },
            { internalType: 'uint16', name: '_royalty', type: 'uint16' }
        ],
        name: 'setRoyalty',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
        name: 'supportsInterface',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
        name: 'tokenByIndex',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'uint256', name: 'index', type: 'uint256' }
        ],
        name: 'tokenOfOwnerByIndex',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'tokenURI',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
        name: 'tokensOfOwner',
        outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'from', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
];
