export class InfraMessage {
    type: InfraMessageType;
    message: string;
}

export enum InfraMessageType {
    Success,
    Error,
    Info,
    Warning
}