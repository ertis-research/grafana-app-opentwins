import { IDittoThing } from "utils/interfaces/dittoThing";

export interface MainListProps {
    isType: boolean;
    funcThings: (cursor?: string, pageSize?: number) => Promise<{ items: IDittoThing[], cursor?: string }>;
    funcDelete: (id: string) => Promise<void>;
    funcDeleteChildren?: (id: string) => Promise<void>;
    parentId?: string;
    iniCompactMode?: boolean;
    iniNoSimulations?: boolean;
}

export interface ThingCardProps {
    thing: IDittoThing;
    isEditor: boolean;
    isCompact: boolean;
    styles: any;
    parentId?: string;
    onDelete: (id: string) => void;
    isType: boolean;
    resourceRoot: string;
}