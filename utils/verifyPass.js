import bcrypt from 'bcrypt';

export const VerifyPassword = ( newPass, oldPass) => {

    let valid = bcrypt.compareSync(newPass,oldPass);

    return valid;
}