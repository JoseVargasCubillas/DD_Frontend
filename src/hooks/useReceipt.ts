import { useQuery } from '@tanstack/react-query';
import * as subsApi from '@api/subscriptions.api';
import * as paymentsApi from '@api/payments.api';

export const useSubscriptionReceipt = (id: string | undefined) =>
  useQuery({
    queryKey: ['receipt', 'subscription', id],
    queryFn: () => subsApi.getSubscriptionReceipt(id as string),
    enabled: Boolean(id),
    retry: false,
  });

export const useOrderReceipt = (id: string | undefined) =>
  useQuery({
    queryKey: ['receipt', 'order', id],
    queryFn: () => paymentsApi.getOrderReceipt(id as string),
    enabled: Boolean(id),
    retry: false,
  });
