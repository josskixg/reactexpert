import { describe, it, expect } from 'vitest';

/**
 * SKENARIO PENGUJIAN (SEMENTARA — hanya untuk demonstrasi CI)
 *
 * Berkas ini SENGAJA dibuat gagal untuk membuktikan bahwa Continuous
 * Integration di GitHub Actions benar-benar menangkap kegagalan pengujian
 * (CI check error). Berkas ini hanya hidup di branch demo `ci-demo-fail`
 * dan akan dihapus kembali sebelum pull request digabungkan.
 */
describe('demonstrasi CI menangkap kegagalan pengujian', () => {
  it('sengaja gagal: 1 + 1 seharusnya bukan 3', () => {
    expect(1 + 1).toBe(3);
  });
});