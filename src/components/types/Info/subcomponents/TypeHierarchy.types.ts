import { LinkData } from "utils/interfaces/dittoThing";

export interface HierarchyProps {
    id: string
}

export interface ListLabels {
    id: string,
    number: string,
    buttonsText: string
}

export interface ListThingNumProps {
    id: string; 
    labels: ListLabels;
    funcGet: () => Promise<LinkData[]>;
    funcUpdate: (elemToUpdate: string, newNum: number) => Promise<any>;
    funcUnlink: (elemToUnlink: string) => Promise<any>;
    funcGetOptions: () => Promise<string[]>;
    resourceRoot: string; // Ruta base limpia (/a/plugin/types)
    onCreate?: () => void; // OPCIONAL: Si no se pasa, no se muestra el botón
}
