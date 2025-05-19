const bcrypt = require("bcrypt");

const encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);
    return hashPassword;
}

const comparePassword = async(password,hashPassword) => {
    const isMatch = await bcrypt.compare(password,hashPassword);
    return isMatch;
}

module.exports = {
    encryptPassword,
    comparePassword
}