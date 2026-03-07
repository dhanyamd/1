import { credentialsParams } from "@/features/credentials/hooks/param";
import { createLoader } from "nuqs/server";

export const credentialsParamsLoader = createLoader(credentialsParams)