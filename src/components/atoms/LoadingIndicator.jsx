import { useSelector } from 'react-redux';

function LoadingIndicator() {
  const loading = useSelector((state) => state.loading);

  if (loading === 0) return null;

  return (
    <div
      role="progressbar"
      aria-label="Memuat data"
      aria-busy="true"
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#D6CEC2] overflow-hidden shadow-sm"
    >
      <div
        className="h-full bg-gradient-to-r from-[#D95338] via-[#F59E0B] to-[#D95338]"
        style={{
          width: '40%',
          animation: 'shimmer 1.2s infinite ease-in-out',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}

export default LoadingIndicator;
