export default {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["https:"],
      scriptSrc: [
        "'self'",
        "'unsafe-eval'",
        "'unsafe-inline'",
        "blob:",
        "https://sandbox.src.mastercard.com/srci/integration/2/lib.js",
        "https://src.mastercard.com/srci/integration/2/lib.js",
      ],
      objectSrc: ["'none'"],
      formAction: ["'self'"],
      frameAncestors: null,
      imgSrc: ["'self'", "https://tap-assets.b-cdn.net/"],
      connectSrc: [
        "'self'", // Allow connections to your own domain (e.g., localhost:4001)
        "https://tapcardcheckout-default-rtdb.firebaseio.com",
      ],
    },
  },
  expectCt: {
    maxAge: 30, // Set the max-age directive in seconds
    enforce: true, // Enable enforcement of the Expect-CT header
    reportUri: "/report-expect-ct", // Specify a URL to report Expect-CT violations
  },
  frameguard: false,
  crossOriginEmbedderPolicy: false,
  xssFilter: true,
};
