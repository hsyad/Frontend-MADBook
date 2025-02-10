<template>
    <main>
        <div class="p-3 bg-white rounded-md">
            <div class="d-flex mb-4 justify-between items-center">
                <h2 class="fw-semibold mb-0">Invoice Details</h2>
                <div class="d-flex gap-2">
                    <button @click="downloadDoc" class="btn btn-primary rounded-md text-white font-bold h-12 w-20">
                        <span class="material-icons text-white align-middle">
                            download
                        </span>
                    </button>
                    <button @click="showEditWarning"
                        class="btn btn-success rounded-md text-white font-bold h-12 w-20">Edit</button>
                </div>
            </div>
            <div class="border border-dark rounded p-4 ">
                <!-- <div class="px-3" v-if="quotation"> -->
                <!-- UI Testing -->
                <div class="px-3">
                    <!-- UI Testing -->
                    <h2 class="mt-4 text-end fw-semibold">Invoice</h2>

                    <!-- LOGO -->
                    <div class="d-flex items-center my-4">
                        <!-- <div v-if="quotation.logo" class="d-inline-block overflow-hidden h-20">
                        <img :src="quotation.logo" alt="logo" style="height: 100%; object-fit: contain;">
                    </div> -->

                        <!-- UI Testing -->
                        <div v-if="logo" class="d-inline-block overflow-hidden h-20">
                            <img :src="logo" alt="logo" class="h-full object-contain">
                        </div>
                    </div>

                    <p class="text-secondary small">
                        <!-- {{ quotation.business_address }} | {{ quotation.email_from }} -->
                        {{ business_address }} | {{ email_from }} <!--UI Testing-->
                    </p>

                    <!-- CUSTOMER DETAILS -->
                    <div class="d-flex justify-between my-4">
                        <div class="text-start flex-grow-1">
                            <p class="mb-1"><strong>Bill To:</strong></p>
                            <!-- <p class="mb-1 fs-6"><strong>{{ quotation.c_name }}</strong></p> -->
                            <p class="mb-1 fs-6">{{ c_name }}</p> <!--UI Testing-->
                            <!-- <p class="mb-1 fs-6"><strong>{{ quotation.c_no }}</strong></p> -->
                            <p class="mb-1 fs-6">{{ c_no }}</p> <!--UI Testing-->
                            <!-- <p class="mb-1 fs-6 text-wrap"><strong>{{ quotation.c_address }}</strong></p> -->
                            <p class="mb-1 fs-6 whitespace-pre">{{ c_address }}</p> <!--UI Testing-->
                        </div>

                        <!-- INVOICE DETAILS -->
                        <div class="container d-flex gap-2 justify-end">
                            <div class="text-end">
                                <!-- <p class="mb-1"><strong>Quote No: </strong>{{ quotation.id }}</p> -->
                                <p class="mb-1"><strong>Invoice No: </strong></p> <!--UI Testing-->
                                <!-- <p class="mb-1"><strong>Issue Date: </strong>{{ quotation.issue_date }}</p> -->
                                <p class="mb-1"><strong>Issue Date: </strong></p> <!--UI Testing-->
                                <!-- <p class="mb-1"><strong>Valid Until: </strong>{{ quotation.valid_date }}</p> -->
                                <p class="mb-1"><strong>Delivery Date: </strong></p>
                                <!--UI Testing-->
                                <p class="mb-1"><strong>Due Date: </strong></p> <!--UI Testing-->
                            </div>
                            <div class="text-start">
                                <p class="mb-1">{{ referenceNumber }}</p> <!--UI Testing-->
                                <p class="mb-1">{{ issue_date }}</p> <!--UI Testing-->
                                <p class="mb-1">{{ delivery_date }}</p>
                                <p class="mb-1">{{ due_date }}</p> <!--UI Testing-->
                            </div>
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
                            <tr v-for="(item, index) in items" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td class="text-start">{{ item.name }}</td>
                                <td>{{ item.price }}</td>
                                <td>{{ item.quantity }}</td>
                                <td>{{ item.amount }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="d-flex gap-3 justify-end mt-6">
                        <div class="text-end">
                            <p class="mb-1">Ship By: </p>
                            <p>Shipping Fee: </p>
                            <p class="fw-semibold">Total: </p>
                        </div>
                        <div class="text-end">
                            <p class="mb-1">{{ ship_by }}</p>
                            <p>RM{{ ship_fee }}</p>
                            <p class="fw-semibold">RM{{ calculate_total }}</p>
                        </div>
                    </div>

                    <!-- <p class="mt-3"><strong>Notes: </strong>{{ quotation.notes }}</p> -->
                    <p class="mt-5"><strong>Notes: </strong>{{ notes }}</p> <!--UI Testing-->
                    <div class="mt-4 mb-4 border-s-8 border-emerald-500 pl-4">
                        <p class="mt-3 mb-px text-sm"> {{ bank_name }}</p>
                        <p class="mb-px text-sm"> {{ acc_holder }}</p>
                        <p class="mb-px text-sm"> {{ acc_num }}</p>
                    </div>
                </div>
                <!-- <div v-else>
                <p>Loading...</p>
            </div> -->
            </div>
            <div class="flex m-2 justify-center">

            </div>
        </div>
    </main>
</template>

<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { computed, ref } from 'vue';
import logoImg from '/src/assets/images/kucen.png';
import { useRouter } from 'vue-router';

const router = useRouter();
const logo = ref(logoImg);
//INFO
const business_address = ref("123 Business Street, City, State");
const email_from = ref("info@business.com");
//CUSTOMER
const c_name = ref("John Doe");
const c_no = ref("+60123456789");
const c_address = ref("Megan Ambassy, Taman U Thant, \n55000 Kuala Lumpur, \nWilayah Persekutuan Kuala Lumpur");
const referenceNumber = ref("1234");
//DATES
const issue_date = ref("2025-01-28");
const delivery_date = ref("2025-02-28");
const due_date = ref("2025-02-28");
//ITEMS
const items = ref([
    { name: "Item 1", price: 100.0, quantity: 2, amount: 200.0 },
    { name: "Item 2", price: 50.0, quantity: 1, amount: 50.0 },
]);
const calculate_total = ref("250.00");
const notes = ref("Please ensure payment within the validity period.");
//SHIPPING
const ship_by = ref("Ninjavan");
const ship_fee = ref("10.00");

//BANK DETAILS
const bank_name = ref("Maybank Malaysia");
const acc_holder = ref("Ali bin Abu");
const acc_num = ref("1234567890");

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
</script>

<style lang="scss" scoped>
.material-icons {
    font-size: 1.6rem; // icons size
    color: var(--light);
    transition: 0.2s ease-out;
}
</style>
