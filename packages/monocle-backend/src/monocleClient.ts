import { MonocleAssessment } from '@spur.us/types';
import * as jose from 'jose';
import { API_URL, USER_AGENT } from './constants';
import { MonocleOptions } from './types';

/**
 * Options for decrypting an assessment
 */
interface DecryptOptions {
  /** If provided, will use local decryption with the given private key */
  privateKeyPem?: string;
}

/**
 * Client for interacting with the Monocle API and handling assessment decryption
 */
export class MonocleClient {
  /** The secret key used for API authentication */
  private secretKey: string;
  /** The base URL for API requests */
  private baseUrl: string;

  /**
   * Creates a new MonocleClient instance
   * @param options - Configuration options for the client
   */
  constructor(options: MonocleOptions) {
    this.secretKey = options.secretKey;
    this.baseUrl = options.baseUrl || API_URL;
  }

  /**
   * Decrypts an encrypted assessment
   * @param encryptedAssessment - The encrypted assessment string to decrypt
   * @param options - Optional decryption options
   * @returns A promise that resolves to the decrypted MonocleAssessment
   * @throws Error if decryption fails
   */
  async decryptAssessment(
    encryptedAssessment: string,
    options: DecryptOptions = {}
  ): Promise<MonocleAssessment> {
    if (options.privateKeyPem) {
      return this.decryptLocally(encryptedAssessment, options.privateKeyPem);
    }
    return this.decryptViaApi(encryptedAssessment);
  }

  /**
   * Decrypts an assessment using the Monocle API
   * @param encryptedAssessment - The encrypted assessment string to decrypt
   * @returns A promise that resolves to the decrypted MonocleAssessment
   * @throws Error if the API request fails
   */
  private async decryptViaApi(
    encryptedAssessment: string
  ): Promise<MonocleAssessment> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'User-Agent': USER_AGENT,
          TOKEN: this.secretKey,
        },
        body: encryptedAssessment,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to decrypt assessment: HTTP ${response.status} ${response.statusText}`
        );
      }

      const assessment: MonocleAssessment = await response.json();
      return assessment;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  /**
   * Decrypts an assessment locally using a provided private key
   * @param encryptedAssessment - The encrypted assessment string to decrypt
   * @param privateKeyPem - The PEM-encoded private key for decryption
   * @returns A promise that resolves to the decrypted MonocleAssessment
   * @throws Error if local decryption fails
   */
  private async decryptLocally(
    encryptedAssessment: string,
    privateKeyPem: string
  ): Promise<MonocleAssessment> {
    try {
      // Load private key into a KeyLike type as jose expects
      const privateKey = await jose.importPKCS8(privateKeyPem, 'ECDH-ES');

      // Decrypt the assessment
      const decryptResult = await jose.compactDecrypt(
        encryptedAssessment,
        privateKey
      );

      // Decode the plaintext Buffer and parse back to JSON
      const decoder = new TextDecoder();
      const assessment: MonocleAssessment = JSON.parse(
        decoder.decode(decryptResult.plaintext)
      );

      return assessment;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to decrypt assessment via private key'
      );
    }
  }
}
