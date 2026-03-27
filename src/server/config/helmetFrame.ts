export default {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", 'https:'],
      scriptSrc: [
        "'self'",
        "'unsafe-eval'",
        "'unsafe-inline'",
        'https://sandbox.src.mastercard.com/srci/integration/2/lib.js',
        'https://src.mastercard.com/srci/integration/2/lib.js',
      ],
      objectSrc: ["'none'"],
      formAction: ["'self'"],
      frameAncestors: null,
      imgSrc: ["'self'", 'https://tap-assets.b-cdn.net/', 'https://cdn.tap.company/'],
    },
  },
  expectCt: {
    maxAge: 30, // Set the max-age directive in seconds
    enforce: true, // Enable enforcement of the Expect-CT header
    reportUri: '/report-expect-ct', // Specify a URL to report Expect-CT violations
  },
  frameguard: false,
  crossOriginEmbedderPolicy: false,
  xssFilter: true,
};
