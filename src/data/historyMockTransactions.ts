
import { Transaction } from "@/types/transaction";

export const getHistoryMockTransactions = (): Transaction[] => {
  return [
    {
      id: 'tx_123456',
      amount: '50000',
      currency: 'XAF',
      recipientName: 'Kouakep Jean',
      recipientCountry: 'Cameroon',
      recipientCountryCode: 'CM',
      status: 'completed',
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      type: 'send',
      createdAt: new Date(Date.now() - 86400000),
      country: 'Cameroon',
      fee: '500',
      totalAmount: '50500',
      recipientContact: '+237 677123456',
      recipientId: 'rec_123456',
      paymentMethod: 'mobile_money',
      provider: 'mtn_momo',
      estimatedDelivery: 'Instant'
    },
    {
      id: 'tx_123457',
      amount: '25000',
      currency: 'XAF',
      recipientName: 'Mendi Sophie',
      recipientCountry: 'Cameroon',
      recipientCountryCode: 'CM',
      status: 'pending',
      date: new Date().toISOString(),
      type: 'send',
      createdAt: new Date(),
      country: 'Cameroon',
      fee: '350',
      totalAmount: '25350',
      recipientContact: '+237 699654321',
      recipientId: 'rec_123457',
      paymentMethod: 'mobile_money',
      provider: 'orange_money',
      estimatedDelivery: 'Instant'
    },
    {
      id: 'tx_123458',
      amount: '100000',
      currency: 'XAF',
      recipientName: 'Mbarga Pierre',
      recipientCountry: 'Cameroon',
      recipientCountryCode: 'CM',
      status: 'completed',
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      type: 'send',
      createdAt: new Date(Date.now() - 172800000),
      country: 'Cameroon',
      fee: '750',
      totalAmount: '100750',
      recipientContact: '12345 67890 12345 67890',
      recipientId: 'rec_123458',
      paymentMethod: 'bank_transfer',
      provider: 'afriland',
      estimatedDelivery: '1-2 business days'
    },
    {
      id: 'tx_123459',
      amount: '15000',
      currency: 'XAF',
      recipientName: 'Atangana Marie',
      recipientCountry: 'Cameroon',
      recipientCountryCode: 'CM',
      status: 'failed',
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      type: 'send',
      createdAt: new Date(Date.now() - 259200000),
      country: 'Cameroon',
      fee: '250',
      totalAmount: '15250',
      recipientContact: '+237 655987654',
      recipientId: 'rec_123459',
      paymentMethod: 'mobile_money',
      provider: 'mtn_momo',
      estimatedDelivery: 'Instant',
      failureReason: 'Recipient number not registered with MTN Mobile Money'
    },
    {
      id: 'tx_123460',
      amount: '200000',
      currency: 'XAF',
      recipientName: 'Essomba Francis',
      recipientCountry: 'Cameroon',
      recipientCountryCode: 'CM',
      status: 'completed',
      date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      type: 'send',
      createdAt: new Date(Date.now() - 432000000),
      country: 'Cameroon',
      fee: '1000',
      totalAmount: '201000',
      recipientContact: '22222 33333 44444 55555',
      recipientId: 'rec_123460',
      paymentMethod: 'bank_transfer',
      provider: 'ecobank',
      estimatedDelivery: '1-2 business days'
    },
  ];
};
