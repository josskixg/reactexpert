import { describe, it, expect } from 'vitest';

/**
 * SKENARIO PENGUJIAN GAGAL UNTUK MENGUJI BRANCH PROTECTION & MERGING IS BLOCKED
 * 
 * Pengujian ini sengaja dibuat gagal agar status check 'Unit & Component Test'
 * berstatus merah/gagal, sehingga branch protection memblokir merge ('Merging is blocked')
 * dan menampilkan checkbox bypass branch protection untuk admin.
 */
describe('demonstrasi branch protection block', () => {
  it('sengaja gagal agar branch protection memblokir merge', () => {
    expect(1 + 1).toBe(3);
  });
});
