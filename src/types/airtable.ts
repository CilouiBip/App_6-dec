import { z } from 'zod';

export interface GlobalScore {
  Score_Global_Sur_10: number;
}

export interface FunctionScore {
  Name: string;
  Score_Final_Fonction: number;
  Nbr_KPIs: number;
  Nbr_KPIs_Alert: number;
}

export interface KPI {
  ID_KPI: string;
  Nom_KPI: string;
  Type: string;
  Valeur_Actuelle: number;
  Score_KPI_Final: number;
  Statut: string;
  Fonctions: string;
}

export interface AuditItem {
  Item_ID: string;
  Item_Name: string;
  KPIs_Audit: string;
  Fonction_Name: string;
  Problems_Name: string;
  Sub_Problems_Name: string;
  Categorie_Problems_Name: string;
  Status: 'Not Started' | 'In Progress' | 'Completed';
}

export const ActionStatus = z.enum(['Not Started', 'In Progress', 'Completed']);
export type ActionStatus = z.infer<typeof ActionStatus>;