// custom.d.ts
declare namespace Express {
    export interface Request {
       headers: {
         authorization?: string;
       };
    }
   }