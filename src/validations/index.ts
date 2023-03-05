export const auth = {
    password: {
        presence: true,
        format: {
            pattern:
                /(?=^.{8,}$)(?=.*\d)(?=.*[!$%^&()_+|~=`{}\[\]:";'<>?,.#@*-\/\\]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
            message:
                '^Password should be at least 8 characters and should contain lower case letter, upper case letter, number, special symbol.'
        }
    },
    confirmPassword: {
        equality: 'password'
    }
};

export const resetPassword = {
    email: {
        presence: { allowEmpty: false, message: 'is required' },
        email: true
    },
    code: {
        presence: { allowEmpty: false, message: 'is required' },
        length: { is: 6 }
    },
    password: {
        presence: true,
        format: {
            pattern: /(?=^.{8,}$)(?=.*\d)(?![.\n])(?=.*[A-Z]).*$/,
            message: '^Password should be at least 8 characters and should contain upper case letter, number.'
        }
    },
    confirmPassword: {
        equality: 'password'
    }
};

export const auctionSchema = {
    price: {
        presence: { allowEmpty: false, message: 'is required' }
    },
    duration: function (value: any) {
        if (value >= 86400 && value <= 604800) return null;
        return {
            presence: { message: 'is required' },
            length: { min: 1 }
        };
    }
};

export const registerSchema = {
    firstName: {
        presence: { allowEmpty: false, message: 'is required' }
    },
    lastName: {
        presence: { allowEmpty: false, message: 'is required' }
    },
    userName: {
        presence: true,
        format: {
            // pattern: /^[a-z0-9]*$/,
            pattern: /(?=.*[a-z])(?!^.*[A-Z])(^[a-z0-9].*$)/,
            message: '^Username should contain atleast one lower case letter and numbers only'
        },
        length: { minimum: 3, maximum: 14 }
    },
    email: {
        presence: { allowEmpty: false, message: 'is required' },
        email: true
    },
    password: {
        presence: true,
        format: {
            pattern:
                /(?=^.{8,}$)(?=.*\d)(?![.\n])(?=.*[A-Z])(?=.*[a-z]*)(?=^\S*$).*$/,
            message:
                '^Password should be at least 8 characters and should contain lower case letter, upper case letter, number, special symbol.'
        }
    },
    // confirmPassword: {
    //     presence: true,
    //     equality: "password",
    // },
    // phoneNumber: {
    //     presence: { allowEmpty: false, message: "^Phone number is required" },
    // },
    terms: function (value: any) {
        if (value) return null;
        return {
            presence: { message: '^Select terms and conditions' },
            length: { min: 1 }
        };
    }
    //
};

export const changePassword = {
    // password: {
    //     presence: true,
    //     format: {
    //         pattern:
    //             /(?=^.{8,}$)(?=.*\d)(?=.*[!$%^&()_+|~=`{}\[\]:";'<>?,.#@*-\/\\]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    //         message:
    //             "^Password should be at least 8 characters and should contain lower case letter, upper case letter, number, special symbol.",
    //     },
    // },
    newPassword: {
        presence: true,
        format: {
            pattern: /(?=^.{8,}$)(?=.*\d)(?=.*[A-Z]).*$/,
            message: '^Password should be at least 8 characters and should contain upper case letter, number.'
        }
    },
    confirmPassword: {
        equality: 'newPassword'
    }
};

export const updateUsers = {
    firstName: {
        presence: { allowEmpty: false, message: 'is required' }
    },
    lastName: {
        presence: { allowEmpty: false, message: 'is required' }
    }
};

export const royaltiesSchema = {
    checked: {
        presence: { allowEmpty: true }
    },
    royalties: function (value: any, attributes: any) {
        if (!attributes.checked) return null;
        return {
            presence: { allowEmpty: false },
            format: {
                pattern: /\b([1-9]|10)\b/,
                message: '^Royalty should be between 1% to 10%'
            }
        };
    }
};

export const createNftSchema = {
    files: function (value: any, attributes: any) {
        if (value?.length > 1 && value?.length < 101) return null;
        return {
            presence: {
                allowEmpty: false,
                message: '^Files should be between 2 to 100 and should not be empty'
            }
        };
    },
    name: {
        presence: { allowEmpty: false, message: "^Title can't be blank" }
    },
    categories: function (value: any, attributes: any) {
        if (value?.length > 0) return null;
        return {
            presence: { allowEmpty: false }
        };
    },
    collectionId: {
        presence: { allowEmpty: false, message: "^Collection can't be blank" }
    },
    terms: {
        presence: { allowEmpty: false, message: '^Please accept the terms & conditions to proceed' }
    },
    declare: {
        presence: { allowEmpty: false, message: '^Please accept the decleration to proceed' }
    }
};

export const createSingleNftSchema = {
    image: {
        presence: { allowEmpty: false, message: "^Image can't be blank" }
    },
    // chainId: {
    //     presence: { allowEmpty: false, message: "^Chain can't be blank" }
    // },
    name: {
        presence: { allowEmpty: false, message: "^Title can't be blank" }
    },
    categories: function (value: any, attributes: any) {
        if (value?.length > 0) return null;
        return {
            presence: { allowEmpty: false }
        };
    },
    thumbnail: function (value: any, attributes: any) {
        if (attributes?.image === 'glb') {
            return {
                presence: { allowEmpty: false }
            };
        } else return null;
    },
    collectionId: {
        presence: { allowEmpty: false, message: "^Collection can't be blank" }
    },
    terms: {
        presence: { allowEmpty: false, message: '^Please accept the terms & conditions to proceed' }
    },
    declare: {
        presence: { allowEmpty: false, message: '^Please accept the decleration to proceed' }
    }
};

export const creatPetitionSchema = {
    image: {
        presence: { allowEmpty: false, message: "^Image can't be blank" }
    },
    title: {
        presence: { allowEmpty: false, message: "^Title can't be blank" }
    },
    description: {
        presence: { allowEmpty: false, message: "^Description can't be blank" }
    }
};
