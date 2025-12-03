import { DynamicInfo } from "utils/interfaces/others";

export interface DebugInfo {
    logs?: DynamicInfo,
    metrics?: DynamicInfo,
    status?: DynamicInfo
}

export type DebugInfoKey = keyof DebugInfo;
