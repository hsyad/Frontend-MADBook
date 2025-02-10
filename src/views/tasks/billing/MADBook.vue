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
                            @click="currentTab = 'invoice', fetchInvoice()" :style="{
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
            <button class="btn btn-success rounded-md text-white font-bold w-40" v-if="currentTab === 'quotation'"
                @click="addQuote">
                Add Quotation
            </button>
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
                            @click="viewQuoteDetails(quote)">
                            <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ "#00"+quote.id }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ quote.c_name }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ quote.subject }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ quote.total }}</td>
                            <td class="border border-gray-300 px-4 py-2">
                                <button
                                    class="d-flex bg-gray-300 rounded-full w-full h-7 p-1 text-white font-semibold justify-center"
                                    :class="statusButton" @click="showConfirmationPopup">
                                    {{ isConfirmed ? "Confirm" : "Confirm" }}</button>
                            </td>
                            <td class="border border-gray-300 px-4 py-2">{{ quote.created_at }}</td>
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
                        <tr v-for="(inv, index) in invoices" :key="inv.id">
                            <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ "#00"+inv.id }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ inv.quotations.c_name }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ inv.quotations.subject }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ inv.total }}</td>
                            <td class="border border-gray-300 px-4 py-2">
                                <button
                                    class="d-flex bg-gray-300 rounded-full w-full h-7 p-1 text-white font-semibold justify-center"
                                    :class="getPaymentStatus(inv.status)" @click="toggleBilling(inv)">
                                    {{ inv.status }}</button>
                            </td>
                            <td class="border border-gray-300 px-4 py-2">{{ inv.created_at }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p>Loading...</p>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useMADBookStore } from '@/stores/madbookStore';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import  axios from 'axios';

onMounted(()=>
            fetchQuote(),
)

const quotes = ref()
const invoices = ref()

const madbookStore = useMADBookStore();
const router = useRouter();

// Fetch data on component mount
// madbookStore.fetchQuote();
// madbookStore.fetchInvoice();


const statusButton = ref("Pending");
const currentTab = ref("quotation");

const addQuote = () => {
    router.push('/create-quotation');
};

const toggleBilling = (inv) => {
    const statuses = ["Pending", "Paid", "Past Due"];
    const currentIndex = statuses.indexOf(inv.status);
    inv.status = statuses[(currentIndex + 1) % statuses.length];
};

const getPaymentStatus = (status) => {
    const statusColors = {
        Paid: "bg-green-600",
        Pending: "bg-yellow-600",
        "Past Due": "bg-red-600",
    };
    return statusColors[status] || "bg-gray-300";
};

const viewQuoteDetails = (quote) => {
    router.push(`/quotation/${quote.Id}`);
};

const fetchQuote = async() => {
    try {
            const response = await axios.get('http://quotation.test/api/Quotation/'+3);
            quotes.value = response.data.quotations
        } catch (error) {
            console.error("Error fetching quotations:", error);
        }
}
const fetchDO = async() => {

}
const fetchInvoice = async() => {
    try {
                const response = await axios.get('http://quotation.test/api/Invoice/'+3);
                invoices.value = response.data;
                console.log(invoices.value)
            } catch (error) {
                console.error("Error fetching invoices:", error);
            }
}
const createQuote = async() => {

}
const createDO = async() => {

}
const createInvoice = async() => {

}
</script>

<style lang="scss" scoped>
.nav-link:hover {
    background-color: white;
    border: none;
}
</style>
