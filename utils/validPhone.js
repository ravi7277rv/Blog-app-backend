

export const ValidPhone = (phone) => {

    let flag = true;
    const phoneString = phone.toString();
    const phoneLength = phoneString.length;

    if(phoneLength !== 10){
        flag = false
    }

    return flag;
}