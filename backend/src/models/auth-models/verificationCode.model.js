import mongoose from "mongoose";


const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,        // one active code per email at a time (upsert overwrites it)
    lowercase: true,      // avoid case-mismatch bugs (User@x.com vs user@x.com)
    trim: true
  },
  codeHash: {
    type: String,
    required: true        // HMAC-SHA256 hash of the code — never store plaintext
  },
  expiresAt: {
    type: Date,
    required: true
  },
  attempts: {
    type: Number,
    default: 0            // incremented on each failed verify attempt
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// TTL index — MongoDB auto-deletes the doc once expiresAt passes
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);



export default VerificationCode