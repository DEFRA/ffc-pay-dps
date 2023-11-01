const getDAXContent = (securityRequest) => {
  const line = [
    securityRequest.primaryTrader ?? '',
    securityRequest.usedByTrader ?? '',
    securityRequest.reference ?? '',
    securityRequest.loaded ?? '',
    securityRequest.daxReference ?? '',
    securityRequest.reason ?? '',
    securityRequest.posted ?? ''
  ]
  return [line]
}

module.exports = {
  getDAXContent
}
