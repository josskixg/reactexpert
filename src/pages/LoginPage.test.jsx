import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from './LoginPage';
import { asyncSetAuthUser } from '../states/authUser/action';

vi.mock('../states/authUser/action', () => ({
  asyncSetAuthUser: vi.fn(() => () => Promise.resolve({ error: false })),
}));

/**
 * Skenario Pengujian: LoginPage
 *
 * Menguji halaman login yang memakai react-redux (useSelector/useDispatch) dan
 * react-router-dom. Thunk asyncSetAuthUser di-mock agar tidak ada permintaan
 * jaringan sungguhan.
 *
 * 1. Halaman menampilkan judul "Masuk ke Akun", input Email, input Kata Sandi,
 *    dan tombol submit "Masuk".
 * 2. Submit dengan field kosong tidak memanggil thunk login (validasi atribut
 *    required dan guard early return pada handleSubmit).
 * 3. Mengetik kredensial yang valid lalu submit memanggil thunk login sekali
 *    dengan email yang sudah di-trim beserta password.
 * 4. Selama proses submit berjalan, label tombol berubah menjadi "Memproses..."
 *    dan tombol menjadi disabled.
 */
const renderLoginPage = () => {
  const store = configureStore({
    reducer: {
      authUser: (state = null) => state,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    asyncSetAuthUser.mockImplementation(() => () => Promise.resolve({ error: false }));
  });

  it('menampilkan judul, input email, input kata sandi, dan tombol submit', () => {
    renderLoginPage();

    expect(screen.getByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Kata Sandi')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument();
  });

  it('tidak memanggil thunk login saat submit dengan field kosong', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    expect(asyncSetAuthUser).not.toHaveBeenCalled();
  });

  it('memanggil thunk login sekali dengan email yang di-trim dan password saat kredensial valid', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText('Email'), '  user@example.com  ');
    await user.type(screen.getByLabelText('Kata Sandi'), 'rahasia123');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    await waitFor(() => expect(asyncSetAuthUser).toHaveBeenCalledTimes(1));
    expect(asyncSetAuthUser).toHaveBeenCalledWith({ email: 'user@example.com', password: 'rahasia123' });
  });

  it('menampilkan label "Memproses..." dan menonaktifkan tombol selama submit', async () => {
    const user = userEvent.setup();
    let resolveLogin;
    asyncSetAuthUser.mockImplementation(
      () => () =>
        new Promise((resolve) => {
          resolveLogin = resolve;
        })
    );
    renderLoginPage();

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Kata Sandi'), 'rahasia123');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));

    const submittingButton = await screen.findByRole('button', { name: 'Memproses...' });
    expect(submittingButton).toBeDisabled();

    resolveLogin({ error: false });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Masuk' })).not.toBeDisabled());
  });
});
