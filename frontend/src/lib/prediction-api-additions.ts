// Add these prediction API functions to the end of api.ts

// Prediction interfaces
export interface PredictionRequest {
    medicine_id: number;
    hospital_id: number;
    current_stock: number;
    daily_consumption: number;
    reorder_level?: number;
    drug_category?: string;
    hospital_type?: string;
}

export interface PredictionResult {
    shortage_prediction: boolean;
    shortage_probability: number;
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    recommendation: string;
    confidence: number;
    days_of_supply: number;
}

export interface PredictionResponse {
    success: boolean;
    prediction: PredictionResult;
    timestamp: string;
}

// Prediction APIs
export const predictShortage = (data: PredictionRequest) =>
    apiRequest<PredictionResponse>('/api/predictions/predict/', {
        method: 'POST',
        body: JSON.stringify(data),
    });

export const batchPredict = (inventories: PredictionRequest[]) =>
    apiRequest<{
        success: boolean;
        total_predictions: number;
        risk_summary: {
            LOW: number;
            MEDIUM: number;
            HIGH: number;
            CRITICAL: number;
        };
        predictions: Array<PredictionResult & { medicine_id?: number; hospital_id?: number }>;
    }>('/api/predictions/batch-predict/', {
        method: 'POST',
        body: JSON.stringify({ inventories }),
    });

export const getModelStatus = () =>
    apiRequest<{
        model_loaded: boolean;
        models_exist: boolean;
        feature_count: number;
        status: 'READY' | 'NOT_TRAINED';
    }>('/api/predictions/model-status/');
