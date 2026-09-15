/**
 * E2E - Skenario Pengujian Alur Login (Wacana / Dicoding Forum App)
 *
 * Tujuan:
 *   Memastikan fitur login bekerja dari antarmuka pengguna sampai ke
 *   pemanggilan API Dicoding Forum (https://forum-api.dicoding.dev/v1).
 *
 * Skenario:
 *   1. Happy path - Mendaftarkan pengguna baru lewat API publik, lalu masuk
 *      melalui halaman '/login'. Setelah submit, aplikasi harus mengalihkan
 *      pengguna ke beranda (pathname menjadi '/') dan menampilkan nama serta
 *      avatar pengguna pada navbar.
 *   2. Negative path - Mencoba masuk dengan email valid namun kata sandi
 *      salah. Aplikasi harus menampilkan modal berjudul 'Gagal Masuk'
 *      (dialog dengan role="dialog") dan pengguna tetap berada di '/login'.
 *
 * Akun dibuat saat runtime melalui `cy.request` sehingga tidak memerlukan
 * kredensial keras apa pun dan tidak berbenturan dengan akun yang sudah ada.
 */

let email;
const password = 'password123';

before(() => {
  // Daftarkan akun unik lewat API publik agar skenario login selalu memakai
  // akun baru dan tidak menabrak akun yang sudah terdaftar.
  email = `forum-e2e-${Date.now()}@example.com`;
  cy.request({
    method: 'POST',
    url: 'https://forum-api.dicoding.dev/v1/register',
    body: { name: 'E2E Tester', email, password },
  })
    .its('body.status')
    .should('eq', 'success');
});

describe('Alur Login', () => {
  it('berhasil masuk dan dialihkan ke beranda ketika kredensial benar', () => {
    cy.visit('/login');

    cy.get('#login-email').type(email);
    cy.get('#login-password').type(password);
    cy.get('button[type="submit"]').click();

    // Login memanggil dua API berurutan (login lalu getOwnProfile),
    // sehingga beri waktu tunggu yang longgar.
    cy.location('pathname', { timeout: 20000 }).should('eq', '/');

    cy.get('img[alt="Avatar E2E Tester"]').should('be.visible');
    cy.contains('E2E Tester').should('be.visible');
  });

  it('menampilkan modal "Gagal Masuk" dan tetap di /login ketika kata sandi salah', () => {
    cy.visit('/login');

    cy.get('#login-email').type(email);
    cy.get('#login-password').type('kata-sandi-salah');
    cy.get('button[type="submit"]').click();

    cy.get('[role="dialog"]', { timeout: 20000 }).should('be.visible');
    cy.get('#modal-title').should('have.text', 'Gagal Masuk');
    cy.location('pathname').should('eq', '/login');
  });
});
