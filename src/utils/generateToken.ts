import jwt from "jsonwebtoken";


export const generateToken = (payload : Record<string , unknown>, secretKey : string , expiresIn : number) => {
    return jwt.sign(payload, secretKey, {
        expiresIn,
    });
}