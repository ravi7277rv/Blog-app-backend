import myConfig from "../configs/config.js";
import jwt from 'jsonwebtoken';

export const GeneratorOfToken = (user) => {


  const options = {
    expiresIn: "7d",
  };

  const token = jwt.sign({ user: user }, myConfig.key.jwt_secret, options);

  return token;
}






// const options = {
// Token expiration time (e.g., 1 hour)
// algorithm: 'HS256', // Signing algorithm (default is HS256)
// issuer: 'your_issuer', // Issuer of the token
// audience: 'your_audience', // Audience of the token
// subject: 'your_subject', // Subject of the token
// notBefore: '30s', // Token is not valid before this time (e.g., 30 seconds from now)
// jwtid: 'unique_token_id', // Unique ID for the token
// header: {
//   typ: 'JWT', // Token type
// },
//}



// expiresIn: Specifies when the token should expire. You can use values like '1h' (1 hour), '7d' (7 days), '30m' (30 minutes), etc.

// algorithm: Specifies the signing algorithm. The default is 'HS256', but you can choose other algorithms like 'HS512', 'RS256', etc., based on your security requirements.

// issuer: Specifies the issuer of the token, which can be your application's name or identity.

// audience: Specifies the audience for the token, typically identifying the intended recipient.

// subject: Specifies the subject of the token, usually representing the user or entity the token is about.

// notBefore: Specifies that the token is not valid before a certain time. You can use values like '30s' (30 seconds from now), '10m' (10 minutes from now), etc.

// jwtid: Provides a unique identifier for the token, which can be useful for tracking or revoking tokens.

// header: Allows you to customize the JWT header. In this example, we set the token type (typ) to 'JWT'.