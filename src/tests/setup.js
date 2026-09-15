import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/**
 * Setup global untuk seluruh pengujian (unit, thunk, dan komponen).
 *
 * Skenario:
 * - Setiap pengujian dijalankan dari kondisi lingkungan yang bersih, sehingga
 *   satu pengujian tidak memengaruhi hasil pengujian lainnya.
 * - DOM hasil render komponen sebelumnya dibersihkan (cleanup).
 * - localStorage dikosongkan, sebab access token hasil login disimpan di sana
 *   dan sisa token dari pengujian sebelumnya bisa membuat hasil test palsu.
 * - Seluruh mock/spy dipulihkan ke implementasi asli.
 */
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});
