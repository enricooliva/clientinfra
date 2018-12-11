import { BaseEntity } from "../core/base-entity";

export interface FileInfra {
    filename: string,
    filetype: string,
    // per visualizzare il pdf | string è in base64 
    filevalue: ArrayBuffer | string,
}

export interface Convenzione extends BaseEntity {
    schematipotipo: string, 
    user_id: number,
    descrizione_titolo: string,
    dipartimemto_cd_dip: string,
    nominativo_docente: string,
    emittente: string,
    user: { id: number, name: string },
    dipartimento: { cd_dip: string, nome_breve: string },
    stato_avanzamento: string,
    tipopagamento: { codice: string, descrizione: string },
    azienda: { id_esterno: string, denominazione: string },
    convenzione_pdf: FileInfra,
    nome_originale_file_convenzione: string,
    attachments?: FileAttachment[],
    unitaorganizzativa_uo: string,
}

export interface FileAttachment {
    id?: number,
    model_id?: number,
    model_type: string,
    attachmenttype_codice?: string,
    attachmenttype?: {id: number, codice: string, descrizione: string},
    filename: string,
    filetype?: string,
    // per visualizzare il pdf | string è in base64 
    filevalue?: ArrayBuffer | string,
    filepath?: string,
}

// { "model_id": 2, "model_type": "App\\Convenzione", "attachmenttype_id": 1, 
// "disk": "local", "filename": "filetest.txt", "uuid": "01f2e84d-b031-4cae-931b-46de449a9ea4", 
// "filepath": "attachments\/Convenzione2\/DD_01f2e84d-b031-4cae-931b-46de449a9ea4.txt", 
// "filesize": 10, 
// "filetype": "text\/plain", "updated_at": "2018-11-28 14:55:19", "created_at": "2018-11-28 14:55:19", "id": 8,}