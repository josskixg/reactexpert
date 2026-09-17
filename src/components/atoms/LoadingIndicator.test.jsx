import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoadingIndicator from './LoadingIndicator';

/**
 * SKENARIO PENGUJIAN KOMPONEN ATOM: LoadingIndicator
 *
 * Menguji rendering status indikator pemuatan data (loading bar):
 * 1. Tidak menampilkan elemen apapun (return null) ketika state loading bernilai 0.
 * 2. Menampilkan elemen role progressbar dengan atribut aria-busy="true" ketika state loading > 0.
 */

describe('LoadingIndicator component', () => {
  it('seharusnya tidak merender elemen apapun ketika loading bernilai 0', () => {
    // Arrange
    const store = configureStore({
      reducer: {
        loading: () => 0,
      },
    });

    const { container } = render(
      <Provider store={store}>
        <LoadingIndicator />
      </Provider>
    );

    // Assert
    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('seharusnya merender progressbar dengan aria-busy="true" ketika loading bernilai lebih dari 0', () => {
    // Arrange
    const store = configureStore({
      reducer: {
        loading: () => 1,
      },
    });

    render(
      <Provider store={store}>
        <LoadingIndicator />
      </Provider>
    );

    // Assert
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-busy', 'true');
    expect(progressbar).toHaveAttribute('aria-label', 'Memuat data');
  });
});
