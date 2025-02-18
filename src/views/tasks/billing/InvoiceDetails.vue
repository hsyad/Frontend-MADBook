<template>
    <main>
        <div class="p-3 bg-white rounded-md">
            <div class="d-flex mb-4 justify-between items-center">
                <div class="d-column gap-2 ">
                    <h2 class="fw-semibold mb-2">Invoice Details</h2>
                    <p class="mb-0">Subject: {{ quotation.subject }}</p>
                </div>
                <div class="d-flex gap-2">
                    <button @click="downloadDoc" class="btn btn-primary rounded-md text-white font-bold h-12 w-20">
                        <span class="material-icons text-white align-middle">
                            download
                        </span>
                    </button>
                    <button @click="showEditWarning"
                        class="btn btn-success rounded-md text-white font-bold h-12 w-20">Edit</button>
                    <button class="btn btn-danger h-12 w-20">Delete</button>

                </div>
            </div>
            <div class="border border-dark rounded p-4" v-if="invoice">
                <div class="px-3">
                    <h2 class="mt-4 text-end fw-semibold">Invoice</h2>

                    <!-- LOGO -->
                    <div class="d-flex items-center my-4">

                        <div v-if="invoice.logo" class="d-inline-block overflow-hidden h-20">
                            <img :src="quotation.logo" alt="logo" class="h-full object-contain">
                        </div>
                    </div>

                    <p class="text-secondary small">
                        {{ quotation.address || "No Address" }} | {{ quotation.email || "No Email" }}
                    </p>

                    <!-- CUSTOMER DETAILS -->
                    <div class="d-flex justify-between my-4">
                        <div class="text-start flex-grow-1">
                            <p class="mb-1"><strong>Bill To:</strong></p>
                            <p class="mb-1 fs-6">{{ quotation.c_name }}</p>
                            <p class="mb-1 fs-6">{{ quotation.c_no }}</p>
                            <p class="mb-1 fs-6 whitespace-pre">{{ quotation.c_address }}</p>
                        </div>

                        <!-- INVOICE DETAILS -->
                        <div class="text-end">
                            <p class="mb-1"><strong class="mr-2">Invoice No:</strong> {{ invoice.id }}</p>
                            <p class="mb-1"><strong class="mr-2">Issue Date:</strong> {{ invoice.issue_date }}</p>
                            <p class="mb-1"><strong class="mr-2">Delivery Date:</strong> {{ invoice.delivery_date }}</p>
                            <p class="mb-1"><strong class="mr-2">Due Date:</strong> {{ invoice.due_date }}</p>
                        </div>
                    </div>

                    <!-- TABLE -->
                    <table class="table table-borderless shadow-none">
                        <thead class="table-secondary">
                            <tr>
                                <th class="w-14">No.</th>
                                <th class="w-auto text-start">Items</th>
                                <th class="w-20">Price</th>
                                <th class="w-25">Quantity</th>
                                <th class="w-20">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="border-bottom">
                            <tr v-for="(item, index) in invoice.q_items" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td class="text-start">{{ item.name }}</td>
                                <td>{{ item.price }}</td>
                                <td>{{ item.quantity }}</td>
                                <td>{{ (item.price * item.quantity).toFixed(2) }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- SHIPPING DETAILS -->
                    <div class="d-flex flex-column align-items-end gap-2 mt-4">
                        <p class="mb-1 text-end">Ship By: {{ q_delivery_order.ship_by }}</p>
                        <p class="mb-1 text-end">Shipping Fee: RM{{ q_delivery_order.ship_fee }}</p>
                        <p class="fw-semibold text-end">
                            Total: RM{{ invoice.i_total }}
                        </p>
                    </div>

                    <p class="mt-5"><strong>Notes: </strong>{{ quotation.notes }}</p>
                    <div class="mt-4 mb-4 border-s-8 border-emerald-500 pl-4">
                        <p class="mt-3 mb-px text-sm"> {{ q_bank_detail.bank_name }}</p>
                        <p class="mb-px text-sm"> {{ q_bank_detail.acc_holder }}</p>
                        <p class="mb-px text-sm"> {{ q_bank_detail.acc_num }}</p>
                    </div>
                </div>
            </div>
            <div class="flex m-2 justify-center">

            </div>
        </div>
    </main>
</template>

<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const invoice = ref({});
const quotation = ref('')
const q_item = ref('')
const q_delivery_order = ref('')
const q_bank_detail = ref('')
const invoiceId = route.params.id;

const fetchInvoice = async () => {
    try {
        const response = await axios.get(`http://quotation.test/api/Invoice/`+invoiceId);
        invoice.value = response.data;

        const {quotations, q_items, q_delivery_orders, q_bank_details} = response.data
        quotation.value = quotations
        q_item.value = q_items
        q_delivery_order.value = q_delivery_orders
        q_bank_detail.value = q_bank_details

    } catch (error) {
        console.error("Error fetching invoice:", error);
    }
};

const downloadDoc = () => {
    try {
        Swal.fire({
            title: 'Success',
            text: 'Document downloaded successfully',
            icon: 'success',
            confirmButtonColor: '#4cbb17'
        });
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Failed to download document',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }
}

const showEditWarning = () => {
    Swal.fire({
        title: "Attention!",
        text: "To update the invoice, you must first edit the quote and delivery order documents. Once updated, generate a new invoice, as invoice details are automatically filled based on these documents.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#FFA500" //orange
    });
}


// Fetch data bila component mounted
onMounted(async () => {
    fetchInvoice();
});
</script>

<style lang="scss" scoped>
.material-icons {
    font-size: 1.6rem; // icons size
    color: var(--light);
    transition: 0.2s ease-out;
}
</style>
