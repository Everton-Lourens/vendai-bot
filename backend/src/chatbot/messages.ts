import { container } from "tsyringe";
import { ListMessageService } from "../useCases/Message/ListMessages/ListMessageService.service";
import { Chatbot, ChatbotClient, Message, NewClient, Order } from "../entities/chatbot";
import { numberEmoji } from "../helpers/numberEmoji";
import { ListProductsService } from "../useCases/Product/ListProducts/ListProductsService.service";

export class ChatbotMessages {
    public client: NewClient
    public messages: any;
    public response: string;
    public products: any;
    public productsListMessage: string;
    constructor({ client }: ChatbotClient) {
        this.client = client;
        this.messages = [];
        this.response = '';
        this.products = [];
        this.productsListMessage = '';
    }
    async getMessageStored(): Promise<any> {
        try {
            if (this.messages.length > 0)
                return this.messages;

            const listMessageService = container.resolve(ListMessageService);
            this.messages = await listMessageService.execute({
                searchString: "",
                userId: this.client.userId,
            });
            return this.messages;
        } catch (error) {
            return error.message;
        }
    }
    async getListProductMessage(): Promise<string> {
        try {
            if (this.productsListMessage.length > 0)
                return this.productsListMessage

            this.products = await this.getArrayProduct()
            this.productsListMessage = this.products.map((item: any, index: number) =>
                `${numberEmoji(index)} → ${item?.description}, R$${item?.price},00`
            ).join('\n') ||
                `Erro ao buscar mensagem da lista de produtos`;
            return this.productsListMessage;
        } catch (error) {
            return error.message;
        }
    }
    async getArrayProduct(): Promise<any> {
        try {
            if (this.products.length > 0)
                return this.products

            const listProductsService = container.resolve(ListProductsService);
            const products = await listProductsService.execute({
                searchString: "",
                userId: this.client.userId,
            });
            this.products = products;
            return this.products;
        } catch (error) {
            return error.message;
        }
    }
    setResponse(response: string) {
        this.response = response;
    }
    async getResponse(stage?: number, position?: number): Promise<string> {
        if (!!stage && !!position) {
            if (stage <= 0 || stage >= 4 || position <= 0 || position >= 4)
                throw new Error("Valores inválidos: stage e position");

            if (!this.messages.length) {
                this.messages = await this.getMessageStored();
            }
            this.response = (
                this.messages.find((message) => message.stage === stage && message.position === position)?.text ||
                `Erro ao buscar mensagem: stage ${stage} e position ${position}`
            );
            return this.response;
        }
        return this.response || `Erro ao buscar resposta`;
    }
}

