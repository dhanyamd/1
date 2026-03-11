import { executionParams } from "../hooks/param";
import { createLoader } from "nuqs/server";

export const executionsParamsLoader = createLoader(executionParams)