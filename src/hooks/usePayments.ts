import { useQuery } from "@tanstack/react-query";
import { listAllOrders } from "@api/payments.api";

export const useOrders = () =>
  useQuery({
    queryKey: ["admin-orders"],
    queryFn: listAllOrders,
  });
