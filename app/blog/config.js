var config = {};

config.kuaipan = {
  consumer_key: 'xcoUfFXLYTlhTcH5',
  consumer_secret: 'FgBF45IQ8LWunHzA',
  oauth_signature_method: 'HMAC-SHA1',
  oauth_version: '1.0',
  oauth_callback: 'http://localhost:1234/api/blog/kuaipan/authorize_callback',
  url: {
    requestToken: 'https://openapi.kuaipan.cn/open/requestToken',
    authorize: 'https://www.kuaipan.cn/api.php?ac=open&op=authorise&oauth_token=',
    accessToken: 'https://openapi.kuaipan.cn/open/accessToken',
    account_info: 'http://openapi.kuaipan.cn/1/account_info'
  }

};

if (process.env.MONGODB_PORT_27017_TCP_PORT) {
  config.kuaipan.oauth_callback = 'http://zhanglun.daocloud.io/api/blog/kuaipan/authorize_callback';
}
module.exports = config;
