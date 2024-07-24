export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    tel: string;
    photo?: string;
    coverPhoto?: string;
  }