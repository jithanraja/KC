const isProduction = process.env.NODE_ENV == 'production';

module.exports = {
    API_BASE_URL: isProduction ? 'https://example/api/' : 'http://localhost:3001/api/',
    API_PREFIX: '/api',
    databaseURL: 'mongodb+srv://admin:Xjp0ifBWmAxIMlsY@mycluster.ktnmn.mongodb.net/konnectcart?retryWrites=true&w=majority',
    /* Below details needed for password Hashing */
    algorithm: 'aes256',
    key: 'p@$$w06d',
    /* Below details needed for mailgun to send Mail  */
    mailFrom: 'mail.support@kc.com',
    mailApiKey: '5b2cca7eb9ff3acf16d871abbc32900b-dbc22c93-bea586ca',
    mailDomain: 'sandbox222e2f19318e4a28af24e3358fbdf8c2.mailgun.org',
    /* Below details needed for twilio to send SMS  */
    smsAccountSid: 'ACb7765125731cabab5cac98e46af12f20',
    smsAuthToken: 'ad563cd6c537d410f9cd6402a86bc69a',
    smsFrom: '+15867665352',
    Google_ClientId: '634545130272-c82vjc5ore6ilkfl4kod85ik4brvqn4r.apps.googleusercontent.com'
}