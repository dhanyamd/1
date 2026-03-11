import { credentialsParams } from "@/features/credentials/hooks/param";
import { createLoader } from "nuqs";

export const credentialsParamsLoader = createLoader(credentialsParams)