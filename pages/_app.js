import '../styles/globals.css';
import 'katex/dist/katex.min.css';
import 'leaflet/dist/leaflet.css';
import { appWithTranslation } from 'next-i18next';
import { useEffect } from 'react';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-XXXXXXXXXX'); // Replace with your Google Analytics ID
    }
  }, []);

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX'); // Replace with your Google Analytics ID
        `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp);
