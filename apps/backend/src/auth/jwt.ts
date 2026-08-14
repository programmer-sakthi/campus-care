import jwt from "jsonwebtoken";


const secret = process.env.JWT_SECRET!;


export function createToken(payload:{
    id:string;
    email:string;
    type:"STUDENT"|"COUNSELLOR"|"INSTITUTION";
}){

    return jwt.sign(
        payload,
        secret,
        {
            expiresIn:"7d"
        }
    );

}



export function verifyToken(token:string){

    return jwt.verify(
        token,
        secret
    );

}