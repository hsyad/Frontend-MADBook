<template>
    <div class="w-full p-4 bg-white shadow-sm m-8 rounded-md space-y-6">
        <!-- TAB FOR QUOTATION | INVOICE -->
        <div class="d-flex justify-between align-middle items-center border-b-2 pb-3">
            <div>
                <ul class="nav nav-tabs" style="border: none;">
                    <li class="nav-item">
                        <button class="nav-link"
                            :class="{ active: currentTab === 'quotation', 'text-muted': currentTab !== 'quotation' }"
                            @click="currentTab = 'quotation'" :style="{
                                backgroundColor: currentTab === 'quotation' ? '#198754' : '',
                                color: currentTab === 'quotation' ? 'white' : '',
                                border: currentTab === 'quotation' ? 'none' : '',
                            }">
                            Quotation
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link"
                            :class="{ active: currentTab === 'invoice', 'text-muted': currentTab !== 'invoice' }"
                            @click="currentTab = 'invoice', fetchInvoice(borrowerId)" :style="{
                                backgroundColor: currentTab === 'invoice' ? '#198754' : '',
                                color: currentTab === 'invoice' ? 'white' : '',
                                border: currentTab === 'invoice' ? 'none' : '',
                            }">
                            Invoice
                        </button>
                    </li>
                </ul>
            </div>

            <!-- ADD NEW QUOTATION -->
            <RouterLink :to="{ name: 'CreateQuotation', params: { id: String(borrowerId) } }"
                class="btn btn-success rounded-md text-white font-bold w-40" v-if="currentTab === 'quotation'">
                Add Quotation
            </RouterLink>
        </div>

        <!-- CONTENT AREA -->
        <div>
            <div v-if="currentTab === 'quotation'">

                <!-- QUOTATION LIST RECORD -->
                <h2 class="text-lg font-semibold mb-4">Quotations</h2>
                <p class="text-gray-600">Manage and review all your quotations here.</p>
                <table class="w-full border-collapse border border-gray-300 rounded-md">
                    <thead>
                        <tr>
                            <th class="border border-gray-300 text-center">No.</th>
                            <th class="border border-gray-300 text-center">Quote No.</th>
                            <th class="border border-gray-300 text-center">Client Name</th>
                            <th class="border border-gray-300 text-center">Subject</th>
                            <th class="border border-gray-300 text-center">Total</th>
                            <th class="border border-gray-300 text-center">Status</th>
                            <th class="border border-gray-300 text-center">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(quote, index) in quotes" :key="quote.id" class="cursor-pointer"
                            @click="viewQuoteDetails(quote.id)">
                            <td class="border border-gray-300 w-0 px-4 py-2">{{ index + 1 }}</td>
                            <td class="border border-gray-300 w-0 px-4 py-2">{{ "#00" + quote.id }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ quote.c_name }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ quote.subject }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ quote.q_total }}</td>
                            <td class="border border-gray-300 px-4 py-2">
                                <button
                                    class="d-flex bg-gray-300 rounded-full w-full h-7 p-1 text-white font-semibold justify-center"
                                    :class="{
                                        'bg-green-600': quote.status === 1,
                                        'bg-gray-300': quote.status === 0,
                                    }" disabled>
                                    Confirm</button>
                            </td>
                            <td class="border border-gray-300 px-4 py-2">{{ quote.issue_date }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- INVOICE LIST -->
            <div v-if="currentTab === 'invoice'">
                <h2 class="text-lg font-semibold mb-4">Invoices</h2>
                <p class="text-gray-600">Manage and review all your invoices here.</p>
                <table class="w-full border-collapse border border-gray-300 rounded-md">
                    <thead>
                        <tr>
                            <th class="border border-gray-300 text-center">No.</th>
                            <th class="border border-gray-300 text-center">Invoice No.</th>
                            <th class="border border-gray-300 text-center">Client Name</th>
                            <th class="border border-gray-300 text-center">Subject</th>
                            <th class="border border-gray-300 text-center">Total</th>
                            <th class="border border-gray-300 text-center">Status</th>
                            <th class="border border-gray-300 text-center">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(invoice, index) in invoices" :key="invoice.id"
                            @click="viewInvoiceDetails(invoice.id)">
                            <td class="border border-gray-300 w-0 px-4 py-2">{{ index + 1 }}</td>
                            <td class="border border-gray-300 w-0 px-4 py-2">{{ "#00" + invoice.id }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ invoice.quotations.c_name }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ invoice.quotations.subject }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ invoice.i_total }}</td>
                            <td class="border border-gray-300 px-4 py-2">
                                <button
                                    class="d-flex bg-gray-300 rounded-full w-20 h-7 p-1 text-white font-semibold justify-center"
                                    :class="{
                                        'bg-yellow-600': invoice.status === 'Pending',
                                        'bg-green-600': invoice.status === 'Paid',
                                        'bg-red-600': invoice.status === 'Canceled',
                                    }" disabled>{{ invoice.status }}
                                </button>
                            </td>
                            <td class="border border-gray-300 px-4 py-2">{{ invoice.issue_date }}</td>
                        </tr>


                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

onMounted(() => {
    fetchQuote(borrowerId);
});

const quotes = ref([])
const invoices = ref([])
const borrowerId = 2;

const router = useRouter();

const currentTab = ref("quotation");

const viewQuoteDetails = (quote) => {
    router.push(`/quotation/${quote}`);
};

const viewInvoiceDetails = (invoice) => {
    router.push(`/invoice/${invoice}`);
};

const fetchQuote = async (borrowerId) => {
    try {
        const response = await axios.get(`http://quotation.test/api/Borrower/${borrowerId}/Quotation`);
        quotes.value = response.data.quotations;

        await fetchInvoice(borrowerId);
    } catch (error) {
        console.error("Error fetching quotations:", error);
    }
}
const fetchDO = async () => {

}
const fetchInvoice = async (borrowerId) => {
    try {
        const response = await axios.get(`http://quotation.test/api/All/Invoices/${borrowerId}`);
        invoices.value = response.data;
    } catch (error) {
        console.error("Error fetching invoices:", error);
    }
}
const createQuote = async () => {

}
const createDO = async () => {

}
const createInvoice = async () => {

}
</script>

<style lang="scss" scoped>
.nav-link:hover {
    background-color: white;
    border: none;
}
</style>
