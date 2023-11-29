// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  siteUrl:
    'https://api.crre-fletcherb2-p1-public.model-t.cc.commerce.ondemand.com/',
  UIsiteURl: 'https://tradeportal.tradelink.com.au', // https://tradeportal.tradelink.com.au //Replace once friendly URL ready 
  baseSiteId: 'fletcherwebservices/v2/tradeLink-spa/',
  // Spa custom domain
  authoTenent: 'https://tradelink-b2b.com.au',
  auth0Domain: 'https://auth.tradelink.com.au',
  auth0Audience: 'https://tradeplus-b2b-hybris.au.com',
  auth0Client_id: 'g6NQqmyiRJNtYQdVC6jCfWP0ytzRqWkM',
  auth0Client_secret:
    'VlVh9FNF77V-D0pKoszRc2ek_2s_SFwpDnheCVrl1iSShiUCA1FxVYftMRkyMHKQ',
  logoutAuth0Domain: 'auth.tradelink.com.au',
  coreLogicTokenUrl: 'https://api-uat.corelogic.asia/',
  coreLogicUrl: 'https://api-uat.corelogic.asia/',
  // Payments URL
  paymentURL: 'https://publicapi.paymentmanager.co.nz/processcreditcard.aspx',
  androidAppRedirectURL: 'https://play.google.com/store/apps/details?id=com.fbu.tradelink&hl=en',
  iosAppRedirectURL: 'https://apps.apple.com/au/app/tradelink/id6443665453'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
