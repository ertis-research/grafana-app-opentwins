import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { SelectableValue, AppEvents } from '@grafana/data';
import { getAppEvents } from '@grafana/runtime';
import { IDittoThing, IDittoThingData, IAttribute, IFeature, IThingId } from 'utils/interfaces/dittoThing';
import { enumOptions, basicAttributesConst, staticAttributesConst, restrictedAttributesConst } from 'utils/data/consts';
import { checkIsEditor } from 'utils/auxFunctions/auth';
import { getAllTypesService } from 'services/TypesService';
import { getAllPoliciesService } from 'services/PoliciesService';
import { getSelectWithObjectsFromThingsArray, JSONtoIAttributes, JSONtoIFeatures, splitThingId } from 'utils/auxFunctions/dittoThing';

interface UseThingFormProps {
    thingToEdit?: IDittoThing;
    isType: boolean;
    funcFromType?: any;
    funcFromZero: (thingId: string, data: IDittoThingData, num?: number) => Promise<any>;
    resourceRoot: string;
}

export const useThingForm = ({ thingToEdit, isType, funcFromType, funcFromZero, resourceRoot }: UseThingFormProps) => {
    const history = useHistory();
    const appEvents = getAppEvents();
    const [isLoading, setIsLoading] = useState(false);

    // Listas
    const [policies, setPolicies] = useState<SelectableValue<string>[]>([]);
    const [types, setTypes] = useState<SelectableValue<IDittoThing>[]>([]);

    // Modos
    const [creationMode, setCreationMode] = useState(thingToEdit ? enumOptions.FROM_ZERO : enumOptions.FROM_TYPE);
    const [selectedType, setSelectedType] = useState<SelectableValue<IDittoThing>>();
    const [customizeType, setCustomizeType] = useState(false);

    // Estado del Objeto
    const [thingIdField, setThingIdField] = useState<IThingId>({ id: "", namespace: "" });
    const [policyId, setPolicyId] = useState<string>("");

    // CORRECCIÓN 1: Estado para guardar la definición original

    const [numChildren, setNumChildren] = useState<number>(1);

    const [basicInfo, setBasicInfo] = useState({ name: "", description: "", image: "" });
    const [attributes, setAttributes] = useState<IAttribute[]>([]);
    const [features, setFeatures] = useState<IFeature[]>([]);
    const [hiddenAttributes, setHiddenAttributes] = useState<any>({});

    const allowFromType = !isType && !thingToEdit;
    const disableAdvancedFields = isLoading || (creationMode === enumOptions.FROM_TYPE && !customizeType);

    // --- HELPER: Limpieza de atributos ---
    const processRawAttributes = (rawAttributes: any = {}) => {
        const attributesCopy = { ...rawAttributes };

        // 1. Extraer Info Básica
        const newBasicInfo = {
            name: attributesCopy.name || "",
            description: attributesCopy.description || "",
            image: attributesCopy.image || ""
        };

        // 2. Extraer Ocultos (Static) y preservarlos
        const newHiddenAttrs: any = {};
        staticAttributesConst.forEach(key => {
            if (attributesCopy.hasOwnProperty(key)) {
                newHiddenAttrs[key] = attributesCopy[key];
                delete attributesCopy[key];
            }
        });

        // 3. Borrar restringidos (estos NO se deben enviar al editar, la API los gestiona)
        restrictedAttributesConst.forEach(key => delete attributesCopy[key]);

        // 4. Borrar básicos de la lista custom
        basicAttributesConst.forEach(key => delete attributesCopy[key]);

        return {
            basic: newBasicInfo,
            hidden: newHiddenAttrs,
            custom: JSONtoIAttributes(attributesCopy)
        };
    };

    // --- INITIAL LOAD ---
    useEffect(() => {
        const init = async () => {
            const isEditor = await checkIsEditor();
            if (!isEditor) {
                history.replace(resourceRoot);
                return;
            }

            try {
                const policiesRes = await getAllPoliciesService();
                setPolicies(policiesRes.map((p: any) => ({ label: p, value: p })));

                if (allowFromType) {
                    const typesRes = await getAllTypesService();
                    setTypes(getSelectWithObjectsFromThingsArray(typesRes));
                }

                if (thingToEdit) {
                    loadThingData(thingToEdit);
                } else {
                    setCreationMode(allowFromType ? enumOptions.FROM_TYPE : enumOptions.FROM_ZERO);
                }
            } catch (error) {
                console.error("Error loading initial data", error);
            }
        };
        init();
    }, [allowFromType, thingToEdit, history, resourceRoot]);

    // --- CARGAR DATOS (Edit Mode) ---
    const loadThingData = (thing: IDittoThing) => {
        const { id, namespace } = splitThingId(thing.thingId);
        setThingIdField({ id, namespace });
        setPolicyId(thing.policyId);

        // CORRECCIÓN 1: Cargamos la definición existente

        const { basic, hidden, custom } = processRawAttributes(thing.attributes);

        setBasicInfo(basic);
        setHiddenAttributes(hidden);
        setAttributes(custom);
        setFeatures(JSONtoIFeatures(thing.features));
    };

    // --- CAMBIO DE TIPO ---
    useEffect(() => {
        if (creationMode === enumOptions.FROM_TYPE && selectedType?.value) {
            const typeThing = selectedType.value;
            setPolicyId(typeThing.policyId);
            setFeatures(JSONtoIFeatures(typeThing.features));

            const { basic, hidden, custom } = processRawAttributes(typeThing.attributes);
            setBasicInfo(basic);
            setHiddenAttributes(hidden);

            const customWithRef = [...custom];
            if (!customWithRef.find(a => a.key === 'type')) {
                customWithRef.push({ key: "type", value: typeThing.thingId });
            }
            setAttributes(customWithRef);
        }
    }, [selectedType, creationMode]);

    // --- CONSTRUIR OBJETO FINAL ---
    const getFinalThingObject = () => {
        // Combinamos atributos: Info Básica + Ocultos + Custom
        const finalAttributes = {
            ...basicInfo,
            ...hiddenAttributes,
            ...(attributes.reduce((acc, curr) => {
                // CORRECCIÓN: Evitar enviar claves vacías
                if (curr.key) acc[curr.key] = curr.value;
                return acc;
            }, {} as any))
        };

        // CORRECCIÓN: Limpieza final de atributos vacíos o nulos si es necesario
        // (A veces Ditto rechaza atributos con valor string vacío "" si no son strings)
        // Por ahora lo dejamos tal cual asumiendo que son strings.

        return {
            thingId: `${thingIdField.namespace}:${thingIdField.id}`,
            policyId: policyId,
            attributes: finalAttributes,
            features: features.reduce((acc, curr) => {
                // CORRECCIÓN: Asegurar estructura features
                if (curr.name) {
                    acc[curr.name] = {
                        properties: curr.properties || {}
                    };
                }
                return acc;
            }, {} as any)
        };
    };

    // --- GUARDAR ---
    const saveThing = async () => {
        // 1. Validación manual
        if (!thingIdField.id || !thingIdField.namespace || !policyId) {
            appEvents.publish({
                type: AppEvents.alertWarning.name,
                payload: ['Validation Error', 'Namespace, ID and Policy are required.']
            });
            return;
        }

        setIsLoading(true);

        // 2. Preparar Payload
        const finalObj = getFinalThingObject();

        const finalData: IDittoThingData = {
            policyId: finalObj.policyId,
            attributes: finalObj.attributes,
            features: finalObj.features
        };

        // --- DEBUGGING CRÍTICO ---
        // Mira esto en la consola del navegador
        console.group("ThingForm Submit Payload");
        console.log("Thing ID:", finalObj.thingId);
        console.log("Payload Data:", JSON.stringify(finalData, null, 2));
        console.log("Is Type Creation:", isType);
        if (isType) console.log("Num Children:", numChildren, typeof numChildren);
        console.groupEnd();
        // ------------------------

        try {
            let promise;
            if (creationMode === enumOptions.FROM_TYPE && selectedType?.value && allowFromType) {
                const typeId = selectedType.value.thingId;
                promise = customizeType
                    ? funcFromType(finalObj.thingId, typeId, finalData)
                    : funcFromType(finalObj.thingId, typeId);
            } else {
                // CORRECCIÓN 2: Asegurar que numChildren sea un número entero
                const safeNumChildren = isType ? Math.floor(Number(numChildren)) : undefined;
                promise = funcFromZero(finalObj.thingId, finalData, safeNumChildren);
            }

            await promise;

            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: [`Success`, `${isType ? 'Type' : 'Twin'} saved successfully.`]
            });

            goBackToList();

        } catch (e: any) {
            console.error("API Error details:", e);

            // Intentamos mostrar detalles del error si la API devuelve mensaje
            let errorMsg = "Check console for details.";
            if (e.data && e.data.message) errorMsg = e.data.message;
            else if (e.message) errorMsg = e.message;

            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ['Bad Request / Error', errorMsg]
            });
        } finally {
            setIsLoading(false);
        }
    };

    const goBackToList = () => {
        history.push(resourceRoot);
    };

    return {
        thingIdField, setThingIdField,
        policyId, setPolicyId,
        basicInfo, setBasicInfo,
        attributes, setAttributes,
        features, setFeatures,
        numChildren, setNumChildren,
        policies,
        types,
        creationMode, setCreationMode,
        selectedType, setSelectedType,
        customizeType, setCustomizeType,
        allowFromType,
        disableAdvancedFields,
        isLoading,
        saveThing,
        goBackToList,
        previewJson: JSON.stringify(getFinalThingObject(), null, 4)
    };
};
