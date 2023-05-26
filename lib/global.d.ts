export {};

declare global {

    type Bubble = {
        id: string;
        name: string;
        description: string;
        created_at: string;
        greet_message: string;
        ticket_email: string;
        info_entity:
            | {
                  id: string;
                  type: string;
                  data: string;
                  url: string | null;
                  created_at: string;
                  tokens: number | null;
                  // 0: not processed, 1: getting processed, 2: processed
                  processed: number;
              }[]
            | null;
    };

    type InfoEntity = {
        id?: string;
        type: string;
        data: string;
        url?: string;
        created_at?: string;
        // 0: not processed, 1: getting processed, 2: processed
        processed: number;
    };

    type Ticket = {
        bubble: string;
        created_at: string | null;
        email: string;
        id: number;
        message: string;
        chat?: string;
    }

    type Chat = {
        bubble: string;
        created_at: string | null;
        fingerprint: string;
        messages: {
            chat: string;
            content: string;
            created_at: string | null;
            id: number;
            sender: string;
        } | {
            chat: string;
            content: string;
            created_at: string | null;
            id: number;
            sender: string;
        }[] | null;
    }
}