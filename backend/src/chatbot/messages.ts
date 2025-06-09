import { container } from "tsyringe";
import { ListMessageService } from "../useCases/Message/ListMessages/ListMessageService.service";
import { Chatbot, ChatbotClient, Message, Order } from "../entities/chatbot";
import { numberEmoji } from "../helpers/numberEmoji";
import { ListProductsService } from "../useCases/Product/ListProducts/ListProductsService.service";
import { format } from "../helpers/format";

export class ChatbotMessages {
    public client: ChatbotClient
    public arrayMessages: any;
    public response: string;
    public arrayProducts: any[];
    public product: any;
    public productsListMessage: string;
    constructor({ client }: { client: ChatbotClient }) {
        this.client = client;
        this.arrayMessages = [];
        this.response = '';
        this.arrayProducts = [];
        this.product = {};
        this.productsListMessage = '';
    }
    async getMessageStored(): Promise<any> {
        try {
            if (this.arrayMessages.length > 0)
                return this.arrayMessages;

            const listMessageService = container.resolve(ListMessageService);
            this.arrayMessages = await listMessageService.execute({
                searchString: "",
                userId: this.client.userId,
            });
            this.arrayMessages = this.arrayMessages.map((item: Message) => ({
                ...item,
                text: format.insertLineBreaks(item.text)
            }));
            return this.arrayMessages;
        } catch (error) {
            console.log(error.message);
            return error.message;
        }
    }
    async getListProductMessage(): Promise<string> {
        try {
            if (this.productsListMessage.length > 0)
                return this.productsListMessage

            this.arrayProducts = await this.getArrayProduct();
            if (!this.arrayProducts || this.arrayProducts.length === 0) {
                this.productsListMessage = `Nenhum produto encontrado.\nCadastre um produto na página inicial.`;
                return this.productsListMessage;
            }
            this.productsListMessage = this.arrayProducts.map((item: any, index: number) =>
                `${numberEmoji(index)} → ${item?.name}, R$${item?.value},00`
            ).join('\n') ||
                `Erro ao buscar mensagem da lista de produtos`;
            return this.productsListMessage;
        } catch (error) {
            console.log(error.message);
            return error.message;
        }
    }
    async getArrayProduct(): Promise<any> {
        try {
            if (this.arrayProducts.length > 0)
                return this.arrayProducts

            const listProductsService = container.resolve(ListProductsService);
            const products = await listProductsService.execute({
                searchString: "",
                userId: this.client.userId,
            });
            this.arrayProducts = products;
            return this.arrayProducts;
        } catch (error) {
            console.log(error.message);
            return error.message;
        }
    }
    async getProductByCode(code: string): Promise<any> {
        if (this.product?.code === code)
            return this.product;
        if (this.arrayProducts.length > 0) {
            const product = this.arrayProducts.find((item: any) => item.code === code);
            this.product = product;
            return this.product;
        }
        if (this.client.order.items.length > 0) {
            const product = this.client.order.items.find((item: any) => item.code === code);
            this.product = product;
            return this.product;
        }
        try {
            const listProductsService = container.resolve(ListProductsService);
            const product = await listProductsService.executeByCode({
                code,
                userId: this.client.userId,
            });
            this.product = product;
            return this.product;
        } catch (error) {
            console.log(error.message);
            return error.message;
        }
    }
    setResponse(response: string) {
        this.response = response;
    }
    async getResponse(stage?: number, position?: number): Promise<string> {
        if (!!stage && !!position) {
            if (stage <= 0 || stage >= 5 || position <= 0 || position >= 5)
                throw new Error("Valores inválidos: stage e position");

            if (!this.arrayMessages.length) {
                this.arrayMessages = await this.getMessageStored();
            }
            this.response = (
                this.arrayMessages.find((message) => message.stage === stage && message.position === position)?.text ||
                `Erro ao buscar mensagem: stage ${stage} e position ${position}`
            );
            return this.response;
        }
        return this.response || `Informe o stage e position para buscar a mensagem.`;
    }
}

