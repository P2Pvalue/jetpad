import { SException } from '.';

export interface ConnectionStatus {
    state: string;
    error: SException;
}
