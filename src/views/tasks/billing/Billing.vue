<template>
    <div class="billing-view space-y-6">
        <!-- TAB FOR QUOTATION | INVOICE -->
        <div class="tabs-container">
            <div class="tabs flex space-x-4">
                <button :class="{ 'active': currentTab === 'quotation' }" @click="currentTab = 'quotation'">
                    Quotation
                </button>
                <button :class="{ 'active': currentTab === 'invoice' }" @click="currentTab = 'invoice'">
                    Invoice
                </button>
            </div>
            <button class="add-btn" v-if="currentTab === 'quotation'" @click="addItem">
                Add Quotation
            </button>
        </div>

        <!-- CONTENT AREA -->
        <div class="content-area">
            <div v-if="currentTab === 'quotation'" class="quotation-section">
                <h2 class="text-lg font-semibold mb-4">Quotations</h2>
                <p class="text-gray-600">Manage and review all your quotations here.</p>
                <table class="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th class="border border-gray-300 text-center">Quote No.</th>
                            <th class="border border-gray-300 text-center">Client's Email</th>
                            <th class="border border-gray-300 text-center">Subject</th>
                            <th class="border border-gray-300 text-center">Amount</th>
                            <th class="border border-gray-300 text-center">Status</th>
                            <th class="border border-gray-300 text-center">Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="quote in quotation" :key="quote.id" @click="viewQuoteDetails(quote)"
                            class="cursor-pointer">
                            <td class="border border-gray-300 px-4 py-2">{{ quote.quoteNo }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ quote.email }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ quote.subject }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ quote.amount }}</td>
                            <td class="border border-gray-300 px-4 py-2">
                                <button class="status-btn" :class="statusButton" @click="showConfirmationPopup">{{
                                    isConfirmed ? "Confirm" : "Confirm" }}</button>
                            </td>
                            <td class="border border-gray-300 px-4 py-2">{{ quote.created }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Popup Confirmation -->
            <div v-if="showPopup" class="popup-overlay">
                <div class="popup-box">
                    <p>Are you sure you want to change the status to "Confirm"?</p>
                    <div class="popup-actions">
                        <button class="confirm-btn" @click="confirmStatus">Yes</button>
                        <button class="cancel-btn" @click="closePopup">No</button>
                    </div>
                </div>
            </div>

            <!-- QUOTATION DETAILS -->
            <div v-if="currentTab === 'quotation-details' && selectedQuote" class="quotation-details">
                <h2 class="text-lg font-semibold mb-4">Quotation Details</h2>
                <p><strong>Quote No: {{ selectedQuote.quoteNo }}</strong></p>
                <p><strong>Client's Email:</strong> {{ selectedQuote.email }}</p>
                <p><strong>Subject:</strong> {{ selectedQuote.subject }}</p>
                <p><strong>Amount:</strong> {{ selectedQuote.amount }}</p>
                <p><strong>Status:</strong> {{ selectedQuote.status }}</p>
                <p><strong>Created:</strong> {{ selectedQuote.created }}</p>
                <div class="actions mt-4">
                    <button class="delivery-btn" @click="navigateToDeliveryOrder">Delivery Order</button>
                    <button class="invoice-btn" @click="navigateToInvoice">Invoice</button>
                    <button class="back-btn" @click="currentTab = 'quotation'">Back to List</button>
                </div>
            </div>

            <!-- INVOICE LIST -->
            <div v-if="currentTab === 'invoice'" class="invoice-section">
                <h2 class="text-lg font-semibold mb-4">Invoices</h2>
                <p class="text-gray-600">Manage and review all your invoices here.</p>
                <table class="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th class="border border-gray-300 text-center">Invoice No.</th>
                            <th class="border border-gray-300 text-center">Client's Email</th>
                            <th class="border border-gray-300 text-center">Subject</th>
                            <th class="border border-gray-300 text-center">Amount</th>
                            <th class="border border-gray-300 text-center">Status</th>
                            <th class="border border-gray-300 text-center">Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border border-gray-300 px-4 py-2">INV001</td>
                            <td class="border border-gray-300 px-4 py-2">johndoe@gmail.com</td>
                            <td class="border border-gray-300 px-4 py-2">Service A</td>
                            <td class="border border-gray-300 px-4 py-2">RM800</td>
                            <td class="border border-gray-300 px-4 py-2">
                                <p>isConfirmed: {{ isConfirmed }}</p>
                                <button class="status-btn" :class="statusButton" @click="toggleBilling">
                                    {{ statusBill }}</button>
                            </td>
                            <td class="border border-gray-300 px-4 py-2">2025-01-01</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import DeliveryOrder from './DeliveryOrder.vue';
import Invoice from './Invoice.vue';

export default {
    name: 'BillingPage',
    data() {
        return {
            currentTab: 'quotation',
            isConfirmed: false,
            showPopup: false,
            quotation: [
                { id: 1, quoteNo: 'Q001', email: 'john@gmail.com', subject: 'Service A', amount: 'RM800', status: 'Confirm', created: '2025-01-01' },
                { id: 2, quoteNo: 'Q002', email: 'jane@gmail.com', subject: 'Service B', amount: 'RM1000', status: 'Confirm', created: '2025-01-25' },
            ],
            selectedQuote: null, // to store chosen quote details
        };
    },
    computed: {
        statusButton() {
            return this.isConfirmed
                ? "confirm-green"
                : "confirm-gray"
        },
    },
    methods: {
        addItem() {
            this.$router.push('/quotation');
        },
        toggleConfirmation() {
            this.isConfirmed = !this.isConfirmed;
        },
        showConfirmationPopup() {
            this.showPopup = true; // Display popup
        },
        closePopup() {
            this.showPopup = false; // Close popup
        },
        confirmStatus() {
            this.isConfirmed = true; // Change status
            this.showPopup = false; // Close popup
        },
        viewQuoteDetails(quote) {
            this.selectedQuote = quote;
            this.currentTab = 'quotation-details';
        },
        navigateToDeliveryOrder() {
            this.$router.push('/delivery-order', DeliveryOrder);
        },
        navigateToInvoice() {
            this.$router.push('/invoice', Invoice);
        },
    },
};
</script>

<style lang="scss" scoped>
.billing-view {
    width: 100%;
    max-width: 56rem;
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 2rem auto;
    background-color: rgb(255, 255, 255);
}

.tabs-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: 1px;
    padding-bottom: 12px;
}

.tabs button {
    padding-left: 16px;
    padding-right: 16px;
    border-radius: 6px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;

    transition: border 0.3s ease;
}

.tabs button.active {

    background-color: rgb(50, 148, 50);
    color: white;
    width: 100px;
    padding: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

}

.tabs button:not(.active):hover {
    background-color: rgb(213, 213, 213);
    color: white;
    width: 100px;
}

.add-btn {
    background-color: rgb(50, 148, 50);
    border-radius: 8px;
    color: white;
    font-weight: 600;
    width: 160px;
    padding: 10px;

    transition: border 0.3s ease;

    &:hover {
        background-color: rgb(58, 120, 58);
        color: white;
    }
}

.content-area {
    margin-top: 20px;
}

.status-btn {
    display: flex;
    background-color: rgb(208, 213, 218);
    border-radius: 100px;
    width: 100px;
    height: 30px;
    // margin: 10px;
    padding: 5px;
    color: white;
    font-weight: 600;
    justify-content: center;
}

.confirm-green {
    background-color: green;
}

.confirm-gray {
    background-color: rgb(213, 213, 213);
}

.quotation-details {
    padding: 20px;
    border-radius: 8px;
    max-width: 600px;
    text-align: left;
}

.actions button {
    margin: 10px;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: bold;
}

.delivery-btn,
.invoice-btn {
    background-color: green;
    color: white;
}

.back-btn {
    background-color: gray;
    color: white;
}
</style>
