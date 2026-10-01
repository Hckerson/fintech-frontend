import { renamePayee } from "@/lib/actions/rename-payee";
import { usePayeeMutation } from "@/lib/hooks/use-payee-mutation";

export const useRenamePayee = () => usePayeeMutation(renamePayee);
