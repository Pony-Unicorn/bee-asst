import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Bee 🐝 Asst</title>
      </Head>
      <script
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "1fd3f5d58467452e9a3a9e7293b2733e"}'
      ></script>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
