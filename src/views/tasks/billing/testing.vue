<template>
    <div>
        <h1>Create Delivery Order</h1>
        <form @submit.prevent="submitDeliveryOrder">
            <div>
                <label>Quotation ID:</label>
                <input type="text" v-model="quotation.id" disabled />
            </div>
            <div>
                <label>Borrower Name:</label>
                <input type="text" v-model="quotation.borrowerName" disabled />
            </div>
            <div>
                <label>Delivery To:</label>
                <input type="text" v-model="quotation.deliveryTo" disabled />
            </div>
            <div>
                <label>Ship To:</label>
                <input type="text" v-model="quotation.shipTo" disabled />
            </div>

            <div>
                <h3>Items</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in quotation.items" :key="item.id">
                            <td>{{ item.name }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>{{ item.unitPrice }}</td>
                            <td>{{ item.totalPrice }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <button type="submit">Submit Delivery Order</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            quotation: {
                id: '',
                borrowerName: '',
                deliveryTo: '',
                shipTo: '',
                items: []
            }
        };
    },
    mounted() {
        // Ambil ID quotation dari URL
        const quoteId = this.$route.params.id;
        this.fetchQuotationDetails(quoteId);
    },
    methods: {
        async fetchQuotationDetails(quoteId) {
            try {
                const response = await axios.get(`/api/quotations/${quoteId}`);
                this.quotation = response.data; // Auto-filled
            } catch (error) {
                console.error('Error fetching quotation details:', error);
            }
        },
        async submitDeliveryOrder() {
            const deliveryOrderData = {
                quotationId: this.quotation.id,
                borrowerName: this.quotation.borrowerName,
                deliveryTo: this.quotation.deliveryTo,
                shipTo: this.quotation.shipTo,
                items: this.quotation.items
            };

            try {
                const response = await axios.post('/api/delivery-orders', deliveryOrderData);
                console.log('Delivery Order Created:', response.data);
                this.$router.push(`/delivery-order/${response.data.id}`);
            } catch (error) {
                console.error('Error creating delivery order:', error);
            }
        }
    }
};
</script>
