const getDPSContent = (securityRequest) => {
  const line = [
    securityRequest.primaryTrader ?? '',
    securityRequest.usedByTrader ?? '',
    securityRequest.reference ?? '',
    securityRequest.fullReference ?? '',
    securityRequest.guaranteeNumber ?? '',
    securityRequest.scheme ?? '',
    securityRequest.debit ?? '',
    securityRequest.credit ?? '',
    securityRequest.currency ?? '',
    securityRequest.transactionCategory ?? '',
    securityRequest.makeForwardDate ?? '',
    securityRequest.measurementStartDate ?? '',
    securityRequest.description ?? '',
    securityRequest.primaryFRN ?? '',
    securityRequest.usedByFRN ?? ''
  ]
  return [line]
}

module.exports = {
  getDPSContent
}
