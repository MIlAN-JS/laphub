import crypto from "crypto";
import config from "../config/config.js";



// generates a new 6 digit code
    function generateCode() {
  return crypto.randomInt(100000, 1000000).toString(); // e.g. "482913"
}

// hashes the code
function hashCodeHMAC(code) {
  return crypto.createHmac('sha256', config.VERIFICATION_CODE_HASH_SECRET)
    .update(code)
    .digest('hex');
}

// it will use both fucntions and set expiry date
async function createVerificationCode() {

  const EXPIRY_MINUTES = 10;
const code =await  generateCode();
  const codeHash = await hashCodeHMAC(code);
  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

   return { code , codeHash, expiresAt};

}



async function verifyCode({submittedCode, storedHash}) {
  const submittedHash =await hashCodeHMAC(submittedCode);

  // Both buffers must be the same length for timingSafeEqual
  const a = Buffer.from(submittedHash, 'hex');
  const b = Buffer.from(storedHash, 'hex');

  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}


export { createVerificationCode , hashCodeHMAC , verifyCode}