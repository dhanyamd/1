import { createLoader, parseAsInteger } from "nuqs/server";
import { PAGINATION } from '@/config/constants';

export const executionsParamsLoader = createLoader({
    page: parseAsInteger
        .withDefault(PAGINATION.DEFAULT_PAGE)
        .withOptions({ clearOnDefault: true }),
    pageSize: parseAsInteger
        .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
        .withOptions({ clearOnDefault: true }),
})