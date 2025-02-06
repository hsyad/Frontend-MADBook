import axios from "axios";
import { defineStore } from "pinia";

export const useMADBookStore = defineStore('madbook', {
    state: () => ({
        quotations: [],
        deliveryOrders: [],
        invoices: [],
        bankDetails: {
            bank_name: '',
            acc_holder: '',
            acc_num: '',
        },
        saveToDB: 'no',
    }),
    actions: {
        //Fetch Quotation from API
        async fetchQuote() {
            try {
                const response = await axios.get('api/Quotation');
                this.quotations = response.data;
            } catch (error) {
                console.error("Error fetching quotations:", error);
            }
        },
        //Fetch DeliveryOrder from API
        async fetchDO() {
            try {
                const response = await axios.get('api/DeliveryOrder');
                this.deliveryOrders = response.data;
            } catch (error) {
                console.error("Error fetching delivery orders:", error);
            }
        },
        //Fetch Invoice from API
        async fetchInvoice() {
            try {
                const response = await axios.get('api/Invoice');
                this.invoices = response.data;
            } catch (error) {
                console.error("Error fetching invoices:", error);
            }
        },

        //Create a New Quotation
        async createQuote(quoteData) {
            try {
                const response = await axios.post('api/Quotation/Store', quoteData);
                this.quotations.push(response.data); // Add created quote to the state
            } catch (error) {
                console.error("Error creating quotation: ", error);
            }
        },
        //Create a New Delivery Order
        async createDO(doData) {
            try {
                const response = await axios.post('api/DeliveryOrder/Store', doData);
                this.deliveryOrders.push(response.data); // Add created quote to the state
            } catch (error) {
                console.error("Error creating delivery order: ", error);
            }
        },
        //Create a New Invoices
        async createInvoice(invData) {
            try {
                const response = await axios.post('api/Invoice/Store', invData);
                this.invoices.push(response.data); // Add created quote to the state
            } catch (error) {
                console.error("Error creating invoice: ", error);
            }
        },
        //Bank Details
        setBankDetails(bankDetails) {
            this.bankDetails = bankDetails;
        },
        setSaveToDB(value) {
            this.saveToDB = value;
        },
    },
    getters: {
        getQuotations: (state) => state.quotations,
        getDeliveryOrders: (state) => state.deliveryOrders,
        getInvoices: (state) => state.invoices,
    },
});
