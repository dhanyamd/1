import { createLoader } from "nuqs/server";
import { executionParams } from "../hooks/param";

export const executionsParamsLoader = createLoader(executionParams)