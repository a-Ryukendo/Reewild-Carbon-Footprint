declare module 'express-basic-auth' {
  import { RequestHandler } from 'express';

  interface IAuthOptions {
    users: { [username: string]: string };
    challenge?: boolean;
    realm?: string;
    authorizer?: (username: string, password: string) => boolean;
    authorizeAsync?: boolean;
    unauthorizedResponse?: any;
  }

  function auth(options: IAuthOptions): RequestHandler;
  
  export = auth;
}
