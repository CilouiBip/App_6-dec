import axios from 'axios';
import { KPI, GlobalScore, FunctionScore, AuditItem } from '../types/airtable';

const baseUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}`;
const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
};

// Helper function to ensure numbers are serializable
const sanitizeNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// Helper function to ensure strings are serializable
const sanitizeString = (value: any): string => {
  return String(value || '');
};

export const api = {
  async fetchGlobalScore(): Promise<GlobalScore> {
    try {
      const response = await axios.get(`${baseUrl}/GLOBAL_SCORE`, { 
        headers,
        params: {
          maxRecords: 1,
          sort: [{ field: 'Score_Global_Sur_10', direction: 'desc' }]
        }
      });
      
      if (!response.data.records?.[0]?.fields) {
        throw new Error('No global score data found');
      }

      const record = response.data.records[0].fields;
      
      // Ensure we're accessing the correct field name
      if (typeof record.Score_Global_Sur_10 === 'undefined') {
        throw new Error('Score_Global_Sur_10 field not found in GLOBAL_SCORE table');
      }

      return {
        Score_Global_Sur_10: sanitizeNumber(record.Score_Global_Sur_10)
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Global Score table not found. Please check your Airtable configuration.');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid Airtable API key. Please check your configuration.');
        }
        if (error.response?.data) {
          console.error('Airtable API Error:', error.response.data);
        }
      }
      throw new Error('Failed to fetch global score. Please ensure the GLOBAL_SCORE table exists with a Score_Global_Sur_10 field.');
    }
  },

  async fetchFunctionScores(): Promise<FunctionScore[]> {
    try {
      const response = await axios.get(`${baseUrl}/Score_Fonction`, { 
        headers,
        params: {
          sort: [{ field: 'Name', direction: 'asc' }]
        }
      });
      
      if (!response.data.records) {
        return [];
      }

      return response.data.records.map((record: any) => ({
        Name: sanitizeString(record.fields.Name),
        Score_Final_Fonction: sanitizeNumber(record.fields.Score_Final_Fonction),
        Nbr_KPIs: sanitizeNumber(record.fields.Nbr_KPIs),
        Nbr_KPIs_Alert: sanitizeNumber(record.fields.Nbr_KPIs_Alert)
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Function Scores table not found. Please check your Airtable configuration.');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid Airtable API key. Please check your configuration.');
        }
      }
      throw new Error('Failed to fetch function scores');
    }
  },

  async fetchKPIs(): Promise<KPI[]> {
    try {
      const response = await axios.get(`${baseUrl}/KPIs`, { 
        headers,
        params: {
          sort: [
            { field: 'Type', direction: 'asc' },
            { field: 'Nom_KPI', direction: 'asc' }
          ]
        }
      });

      if (!response.data.records) {
        return [];
      }

      return response.data.records.map((record: any) => ({
        ID_KPI: sanitizeString(record.id),
        Nom_KPI: sanitizeString(record.fields.Nom_KPI),
        Type: sanitizeString(record.fields.Type),
        Valeur_Actuelle: sanitizeNumber(record.fields.Valeur_Actuelle),
        Score_KPI_Final: sanitizeNumber(record.fields.Score_KPI_Final),
        Statut: sanitizeString(record.fields.Statut || 'OK'),
        Fonctions: sanitizeString(record.fields.Fonctions_Readable || 'N/A')
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('KPIs table not found. Please check your Airtable configuration.');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid Airtable API key. Please check your configuration.');
        }
      }
      throw new Error('Failed to fetch KPIs');
    }
  },

  async fetchAuditItems(): Promise<AuditItem[]> {
    try {
      const response = await axios.get(`${baseUrl}/Audit_Items`, {
        headers,
        params: {
          filterByFormula: "{KPIs_Audit} = 'To Audit'",
          sort: [
            { field: 'Fonction_Name', direction: 'asc' },
            { field: 'Problems_Name', direction: 'asc' }
          ]
        }
      });

      if (!response.data.records) {
        return [];
      }

      return response.data.records.map((record: any) => ({
        Item_ID: sanitizeString(record.id),
        Item_Name: sanitizeString(record.fields.Item_Name),
        KPIs_Audit: sanitizeString(record.fields.KPIs_Audit),
        Fonction_Name: sanitizeString(record.fields.Fonction_Name),
        Problems_Name: sanitizeString(record.fields.Problems_Name),
        Sub_Problems_Name: sanitizeString(record.fields.Sub_Problems_Name),
        Categorie_Problems_Name: sanitizeString(record.fields.Categorie_Problems_Name),
        Status: sanitizeString(record.fields.Status || 'Not Started')
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Audit Items table not found. Please check your Airtable configuration.');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid Airtable API key. Please check your configuration.');
        }
      }
      throw new Error('Failed to fetch audit items');
    }
  },

  async updateAuditItemStatus(itemId: string, status: AuditItem['Status']): Promise<void> {
    try {
      await axios.patch(
        `${baseUrl}/Audit_Items/${itemId}`,
        { fields: { Status: status } },
        { headers }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Audit item not found');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid Airtable API key');
        }
      }
      throw new Error('Failed to update audit item status');
    }
  }
};