import { createPayee } from "@/lib/actions/create-payee";
import { usePayeeMutation } from "@/lib/hooks/use-payee-mutation";

export const useCreatePayee = () => usePayeeMutation(createPayee);
