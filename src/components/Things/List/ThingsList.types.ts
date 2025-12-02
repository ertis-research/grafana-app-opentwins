import { IDittoThing } from "utils/interfaces/dittoThing";

export interface MainListProps {
    isType: boolean;
    funcThings: () => Promise<any>;
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