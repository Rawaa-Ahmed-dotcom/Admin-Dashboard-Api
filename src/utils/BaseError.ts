export class BaseError extends Error {
    statusCode : number;
    status : string;

    constructor(message : string , statusCode : number) {
        super(message);
        this.statusCode = statusCode || 500;
        this.status = statusCode.toString().startsWith('4') ? "fail" : "error";
    }
}