import { useState, useEffect, useCallback } from 'react';
import { AppEvents, SelectableValue } from '@grafana/data';
import { getAppEvents } from '@grafana/runtime';
import { 
    deletePolicyService, 
    getAllPoliciesService, 
    getPolicyByIdService, 
    createOrUpdatePolicyService // NOMBRE ACTUALIZADO
} from 'services/PoliciesService';

export const usePolicyLogic = () => {
    const appEvents = getAppEvents();
    
    // --- State: Reading/List ---
    const [policies, setPolicies] = useState<Array<SelectableValue<string>>>([]);
    const [selectedId, setSelectedId] = useState<SelectableValue<string> | undefined>();
    const [selectedPolicyContent, setSelectedPolicyContent] = useState<any>(undefined);
    
    // --- State: Creation/Editing ---
    const [newPolicyJson, setNewPolicyJson] = useState<string>("");
    
    // --- State: UI/Loading ---
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    // Fetch List
    const fetchPolicies = useCallback(async () => {
        setIsLoading(true);
        try {
            const res: string[] = await getAllPoliciesService();
            setPolicies(res.map((item) => ({ label: item, value: item })));
        } catch (error) {
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ["Error fetching policies list"],
            });
        } finally {
            setIsLoading(false);
        }
    }, [appEvents]);

    // Fetch Detail
    useEffect(() => {
        if (selectedId?.value) {
            setIsLoading(true);
            getPolicyByIdService(selectedId.value)
                .then((data: any) => setSelectedPolicyContent(data))
                .catch(() => setSelectedPolicyContent(undefined))
                .finally(() => setIsLoading(false));
        } else {
            setSelectedPolicyContent(undefined);
        }
    }, [selectedId]);

    // Initial Load
    useEffect(() => {
        fetchPolicies();
    }, [fetchPolicies]);

    // DELETE Logic
    const onDeleteConfirm = async () => {
        if (!selectedId?.value) { return; }
        setIsProcessing(true);
        try {
            await deletePolicyService(selectedId.value);
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: [`Policy deleted successfully`],
            });
            setSelectedId(undefined);
            fetchPolicies();
        } catch (e: any) {
            appEvents.publish({ type: AppEvents.alertError.name, payload: ["Error deleting policy"] });
        } finally {
            setIsProcessing(false);
            setShowDeleteModal(false);
        }
    };

    // EDIT Logic (Transfer content to Right Panel)
    const onEditPolicy = () => {
        if (selectedPolicyContent) {
            // Formateamos bonito el JSON para que sea fácil de editar
            setNewPolicyJson(JSON.stringify(selectedPolicyContent, undefined, 4));
            
            // Opcional: Notificación visual suave
            appEvents.publish({
                type: AppEvents.alertInfo.name,
                payload: ["Policy content copied to editor"],
            });
        }
    };

    // SAVE Logic (Create or Update)
    const onSavePolicy = async () => {
        if (!newPolicyJson.trim()) { return; }

        let parsedJson;
        try {
            parsedJson = JSON.parse(newPolicyJson);
        } catch (e) {
            appEvents.publish({
                type: AppEvents.alertWarning.name,
                payload: ["Invalid JSON format. Please check your syntax."],
            });
            return;
        }

        setIsProcessing(true);
        try {
            await createOrUpdatePolicyService(parsedJson);
            
            appEvents.publish({
                type: AppEvents.alertSuccess.name,
                payload: ["Policy saved successfully"],
            });
            
            setNewPolicyJson(""); // Limpiamos tras guardar
            fetchPolicies(); // Refrescamos la lista
        } catch (e: any) {
             let msg = e.message;
            try { msg = JSON.parse(e.message).message; } catch (_) {}
            
            appEvents.publish({
                type: AppEvents.alertError.name,
                payload: ["Error saving policy: " + msg],
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        policies,
        selectedId,
        setSelectedId,
        selectedPolicyContent,
        newPolicyJson,
        setNewPolicyJson,
        isLoading,
        isProcessing,
        showDeleteModal,
        setShowDeleteModal,
        onDeleteConfirm,
        onSavePolicy,
        onEditPolicy // Exportamos la nueva función
    };
};
