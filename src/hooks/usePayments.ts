import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteOrder, listAllOrders } from "@api/payments.api";

export const useOrders = () =>
  useQuery({
    queryKey: ["admin-orders"],
    queryFn: listAllOrders,
  });

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "admin", "all"] });
    },
  });
};
