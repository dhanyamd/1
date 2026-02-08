import { PAGINATION } from "@/config/constants";
import { useEffect, useState } from "react";

interface useEntitySearchProps<T extends {
    search: string;
    page: number;
}> {
    params: T;
    setParams: (params: T) => void 
    debounceMs?: number;
}

export function useEntitySearch<T extends {
    search: string;
    page: number
}>({
    params, setParams, debounceMs=500
}: useEntitySearchProps<T>){
    const [loacalSearch, setLocalSearch] = useState(params.search);
    useEffect(() => {
        if (loacalSearch === "" && params.search !== "" ){
            setParams({
                ...params,
                search: "",
                page: PAGINATION.DEFAULT_PAGE
            });
            return;
        }
        const timer = setTimeout(()=> {
            if (loacalSearch !== params.search){
                setParams({
                    ...params,
                    search: loacalSearch,
                    page: PAGINATION.DEFAULT_PAGE
                })
            }
        }, debounceMs)
        return () => clearTimeout(timer)
    },[loacalSearch, params, setParams, debounceMs])
    useEffect(() => {
        setLocalSearch(params.search)
    },[params.search])

    return {
        searchValue: loacalSearch,
        onSearchChange: setLocalSearch
    }
}
