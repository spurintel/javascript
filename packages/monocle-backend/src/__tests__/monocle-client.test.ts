import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MonocleClient } from '../index';
import { MonocleAssessment } from '@spur.us/types';
import * as jose from 'jose';

// Mock fetch
global.fetch = vi.fn();

// Mock jose module
vi.mock('jose', () => ({
  importPKCS8: vi.fn(),
  compactDecrypt: vi.fn(),
}));

describe('MonocleClient', () => {
  const mockSecretKey = 'test-secret-key';
  const mockBaseUrl = 'https://api.test.com';
  const mockEncryptedAssessment = 'encrypted-data';
  const mockDecryptedAssessment: MonocleAssessment = {
    vpn: false,
    proxied: false,
    anon: false,
    rdp: false,
    dch: false,
    cc: 'US',
    ip: '192.168.1.1',
    ipv6: '2001:db8::1',
    ts: new Date().toISOString(),
    complete: true,
    id: 'test-id',
    sid: 'test-app',
    service: 'test-service',
  };

  let client: MonocleClient;

  beforeEach(() => {
    client = new MonocleClient({
      secretKey: mockSecretKey,
      baseUrl: mockBaseUrl,
    });
    vi.clearAllMocks();
  });

  describe('decryptAssessment', () => {
    describe('via API', () => {
      it('should successfully decrypt assessment via API', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockDecryptedAssessment),
        } as Response);

        const result = await client.decryptAssessment(mockEncryptedAssessment);

        expect(global.fetch).toHaveBeenCalledWith(
          `${mockBaseUrl}/api/v1/assessment`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              TOKEN: mockSecretKey,
            },
            body: mockEncryptedAssessment,
          }
        );
        expect(result).toEqual(mockDecryptedAssessment);
      });

      it('should throw error when API request fails', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        } as Response);

        await expect(
          client.decryptAssessment(mockEncryptedAssessment)
        ).rejects.toThrow(
          'Failed to decrypt assessment: HTTP 500 Internal Server Error'
        );
      });
    });

    describe('local decryption', () => {
      const mockPrivateKeyPem =
        '-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----';

      it('should successfully decrypt assessment locally', async () => {
        // Mock jose functions
        const mockPrivateKey = { type: 'private' } as jose.KeyLike;
        const mockDecryptResult = {
          plaintext: new TextEncoder().encode(
            JSON.stringify(mockDecryptedAssessment)
          ),
          key: mockPrivateKey,
        } as jose.CompactDecryptResult & jose.ResolvedKey<jose.KeyLike>;

        vi.mocked(jose.importPKCS8).mockResolvedValueOnce(mockPrivateKey);
        vi.mocked(jose.compactDecrypt).mockResolvedValueOnce(mockDecryptResult);

        const result = await client.decryptAssessment(mockEncryptedAssessment, {
          privateKeyPem: mockPrivateKeyPem,
        });

        expect(jose.importPKCS8).toHaveBeenCalledWith(
          mockPrivateKeyPem,
          'ECDH-ES'
        );
        expect(jose.compactDecrypt).toHaveBeenCalledWith(
          mockEncryptedAssessment,
          mockPrivateKey
        );
        expect(result).toEqual(mockDecryptedAssessment);
      });

      it('should throw error when local decryption fails', async () => {
        vi.mocked(jose.importPKCS8).mockRejectedValueOnce(
          new Error('Invalid key')
        );

        await expect(
          client.decryptAssessment(mockEncryptedAssessment, {
            privateKeyPem: mockPrivateKeyPem,
          })
        ).rejects.toThrow('Invalid key');
      });
    });
  });
});
