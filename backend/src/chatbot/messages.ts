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
    public productsList: string;
    public deliveryTax: any;
    constructor({ client }: ChatbotClient) {
        this.client = client;
        this.messages = [];
        this.response = '';
        this.products = [];
        this.productsList = '';
        this.deliveryTax = [];
    }
    async getMessage({ stage, position }: { stage: number, position: number }): Promise<any> {
        try {
            if (this.messages.length > 0) {
                return (
                    this.messages.find((message) => message.stage === stage && message.position === position)?.text ||
                    `Encaminharemos você para o atendente, aguarde.\n\nErro ao buscar mensagem: stage ${stage} e position ${position}`
                );
            }
            const listMessageService = container.resolve(ListMessageService);
            const messages = await listMessageService.execute({
                searchString: "",
                userId: this.client.userId,
            });
            this.messages = messages;
            this.response = (
                this.messages.find((message) => message.stage === stage && message.position === position)?.text ||
                `Erro ao buscar mensagem: stage ${stage} e position ${position}`
            );
            return this.response;
        } catch (error) {
            return error;
        }
    }
    async getListProductMessage({ limit, offset }: { limit: number, offset: number }): Promise<string> {
        try {
            if (this.products.length > 0) {
                return (Object.values(this.products)
                    .map((item: any, index: number) => `${numberEmoji(index)} → ${item?.description}, R$${item?.price},00`)
                    .join('\n') ||
                    `Erro ao buscar produtos: limit ${limit} e offset ${offset}`
                );
            }
            const listProductsService = container.resolve(ListProductsService);
            const products = await listProductsService.execute({
                searchString: "",
                userId: this.client.userId,
            });
            this.products = products;
            this.productsList = (Object.values(this.products)
                .map((item: any, index: number) => `${numberEmoji(index)} → ${item?.description}, R$${item?.price},00`)
                .join('\n') ||
                `Erro ao buscar produtos: limit ${limit} e offset ${offset}`
            );
            return this.productsList;
        } catch (error) {
            return error;
        }
    }
}

