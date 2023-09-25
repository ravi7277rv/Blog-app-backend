import bcrypt from 'bcrypt';

export const HashPassowrd = (passowrd) => {
    
    let saltRound = 10;
    
    let salt = bcrypt.genSaltSync(saltRound);

    let hashedPass = bcrypt.hashSync(passowrd,salt);

    return hashedPass;
}