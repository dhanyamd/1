import { authClient } from "@/lib/auth-client"
import { useQuery } from "@tanstack/react-query"

export const useSubscription = () => {
    return useQuery({
        queryKey: ["subscription"],
        queryFn: async () => {
            const {data} = await authClient.customer.state()
            return data;
        }
    })
}

export const useHasActiveSubscription = () => {
    const {data: cutsomerState, isLoading, ...rest} = useSubscription();
    const hasActiveSubscription = 
      cutsomerState?.activeSubscriptions && 
      cutsomerState.activeSubscriptions.length > 0;
    return {
        hasActiveSubscription,
        subscription: cutsomerState?.activeSubscriptions?.[0],
        isLoading,
        ...rest
    }
}