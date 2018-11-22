import { BaseEntity } from "../core/base-entity";

export interface FileInfra {
    filename: string,
    filetype: string,
    // per visualizzare il pdf | string è in base64 
    filevalue: ArrayBuffer | string,    
}

export interface Convenzione extends BaseEntity{
    user_id: number;
    descrizione_titolo: string;
    dipartimemto_cd_dip: string;
    nominativo_docente: string;
    emittente: string;    
    user: { id: string, name: string};
    dipartimento: { cd_dip: string, nome_breve: string };
    stato_avanzamento: string;
    tipopagamento: { codice: string, descrizione: string };
    azienda: {id_esterno: string, denominazione: string };
    convenzione_pdf: FileInfra;
    nome_originale_file_convenzione: string;
}
