const getContent = (paymentRequest) => {
  const line = [
    paymentRequest.primaryTrader ?? '',
    paymentRequest.usedByTrader ?? '',
    paymentRequest.reference ?? '',
    paymentRequest.fullReference ?? '',
    paymentRequest.guaranteeNumber ?? '',
    paymentRequest.scheme ?? '',
    paymentRequest.debit ?? '',
    paymentRequest.credit ?? '',
    paymentRequest.currency ?? '',
    paymentRequest.transactionCategory ?? '',
    paymentRequest.makeForwardDate ?? '',
    paymentRequest.measurementStartDate ?? '',
    paymentRequest.description ?? '',
    paymentRequest.primaryFRN ?? '',
    paymentRequest.usedByFRN ?? ''
  ]
  return [line]
}

module.exports = {
  getContent
}
