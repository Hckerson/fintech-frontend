import { removePayee } from "@/lib/actions/remove-payee";
import { usePayeeMutation } from "@/lib/hooks/use-payee-mutation";

export const useRemovePayee = () => usePayeeMutation(removePayee);
