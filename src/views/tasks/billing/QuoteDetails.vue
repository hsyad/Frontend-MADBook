<template>
    <main>
        <div class="p-3 bg-white rounded-md">
            <div class="d-flex mb-4 justify-between items-center">
                <h2 class="fw-semibold mb-0">Quotation Details</h2>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary rounded-md text-white font-bold h-12 w-20">
                        <span class="material-icons text-white align-middle">
                            download
                        </span>
                    </button>
                    <button class="btn btn-success rounded-md text-white font-bold h-12 w-20">Edit</button>
                </div>
            </div>
            <div class="border border-dark rounded p-4 max-h-[90vh]">
                <!-- <div class="px-3" v-if="quotation"> -->
                <!-- UI Testing -->
                <div class="px-3">
                    <!-- UI Testing -->
                    <h2 class="mt-4 text-end fw-semibold">Quote</h2>

                    <!-- LOGO -->
                    <div class="d-flex items-center my-4">
                        <!-- <div v-if="quotation.logo" class="d-inline-block overflow-hidden h-20">
                        <img :src="quotation.logo" alt="logo" style="height: 100%; object-fit: contain;">
                    </div> -->

                        <!-- UI Testing -->
                        <div v-if="logo" class="d-inline-block overflow-hidden h-20">
                            <img :src="logo" alt="logo" style="height: 100%; object-fit: contain;">
                        </div>
                    </div>

                    <p class="text-secondary small">
                        <!-- {{ quotation.business_address }} | {{ quotation.email_from }} -->
                        {{ business_address }} | {{ email_from }} <!--UI Testing-->
                    </p>

                    <!-- CUSTOMER DETAILS -->
                    <div class="d-flex justify-between my-4">
                        <div class="text-start flex-grow-1">
                            <p class="mb-1"><strong>For:</strong></p>
                            <!-- <p class="mb-1 fs-6"><strong>{{ quotation.c_name }}</strong></p> -->
                            <p class="mb-1 fs-6">{{ c_name }}</p> <!--UI Testing-->
                            <!-- <p class="mb-1 fs-6"><strong>{{ quotation.c_no }}</strong></p> -->
                            <p class="mb-1 fs-6">{{ c_no }}</p> <!--UI Testing-->
                            <!-- <p class="mb-1 fs-6 text-wrap"><strong>{{ quotation.c_address }}</strong></p> -->
                            <p class="mb-1 fs-6 text-wrap" v-html="formattedAddress"></p> <!--UI Testing-->
                        </div>

                        <!-- QUOTATION DETAILS -->
                        <div class="text-start">
                            <!-- <p class="mb-1"><strong>Quote No: </strong>{{ quotation.id }}</p> -->
                            <p class="mb-1"><strong>Quote No: </strong>{{ referenceNumber }}</p> <!--UI Testing-->
                            <!-- <p class="mb-1"><strong>Issue Date: </strong>{{ quotation.issue_date }}</p> -->
                            <p class="mb-1"><strong>Issue Date: </strong>{{ issue_date }}</p> <!--UI Testing-->
                            <!-- <p class="mb-1"><strong>Valid Until: </strong>{{ quotation.valid_date }}</p> -->
                            <p class="mb-1"><strong>Valid Until: </strong>{{ valid_date }}</p> <!--UI Testing-->
                        </div>
                    </div>

                    <!-- ITEM DETAILS -->
                    <table class="w-full border border-gray-300 text-center shadow-none">
                        <thead class="bg-gray-200 border border-gray-300 text-black">
                            <tr>
                                <th scope="col" class="small">No.</th>
                                <th scope="col" class="small">Items</th>
                                <th scope="col" class="small">Price</th>
                                <th scope="col" class="small">Quantity</th>
                                <th scope="col" class="small">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- <tr v-for="(item, index) in quotation.items" :key="index"> -->
                            <tr v-for="(item, index) in items" :key="index"> <!--UI Testing-->
                                <td class="px-4 py-2 border">{{ index + 1 }}</td>
                                <td class="px-4 py-2 border">{{ item.name }}</td>
                                <td class="px-4 py-2 border text-end">RM{{ item.price }}</td>
                                <td class="px-4 py-2 border text-end">{{ item.quantity }}</td>
                                <td class="px-4 py-2 border text-end">RM{{ (item.price * item.quantity).toFixed(2) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- <p class="mt-3"><strong>Notes: </strong>{{ quotation.notes }}</p> -->
                    <p class="mt-5"><strong>Notes: </strong>{{ notes }}</p> <!--UI Testing-->
                    <p class="text-end fs-5 fw-bold">Total: RM{{ calculate_total }}</p>
                </div>
                <!-- <div v-else>
                <p>Loading...</p>
            </div> -->
            </div>
            <div class="flex m-2 justify-center">

            </div>
            <div class="d-flex gap-1 mb-2">
                <button class="btn btn-success rounded-md text-white font-bold w-full">Create Delivery Order</button>
                <button class="btn btn-success rounded-md text-white font-bold w-full">Create Invoice</button>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import { computed, ref } from 'vue';
import logoImg from '/src/assets/images/kucen.png';

export default {
    //     name: "QuoteDetails",
    //     data() {
    //         return {
    //             // quotation: null,
    //             logo: null, // Replace with actual logo URL or null
    //             business_address: "123 Business Street, City, State",
    //             email_from: "info@business.com",
    //             c_name: "John Doe",
    //             c_no: "+60123456789",
    //             c_address: "Megan Ambassy, Taman U Thant, 55000 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
    //             referenceNumber: "Q12345",
    //             issue_date: "2025-01-28",
    //             valid_date: "2025-02-28",
    //             items: [
    //                 { name: "Item 1", price: 100.0, quantity: 2 },
    //                 { name: "Item 2", price: 50.0, quantity: 1 },
    //             ],
    //             notes: "Please ensure confirmation order within the validity period.",
    //         };
    //     },
    //     // created() {
    //     //     const id = this.$route.params.id; // Get the quote ID from the URL
    //     //     this.fetchQuoteDetails(quoteId);
    //     // },
    //     // methods: {
    //     //     async fetchQuoteDetails(quoteId) {
    //     //         try {
    //     //             const response = await axios.get(`http://localhost/api/quotation/${quoteId}`);
    //     //             this.quotation = response.data; // Store the quotation data in the 'quotation' var
    //     //         } catch (error) {
    //     //             Swal.fire({
    //     //                 icon: 'error',
    //     //                 title: "Oops...",
    //     //                 text: "An error occured while fetching quotation details. Please try again.",
    //     //                 confirmButtonText: 'Try Again',
    //     //             }).then((result) => {
    //     //                 if (result.isConfirmed) {
    //     //                     this.fetchQuotationDetails(quoteId); // Retry the request
    //     //                 }
    //     //             });
    //     //         }
    //     //     },
    //     // },
    //     computed: {
    //         calculateTotal() {
    //             // return this.quotation.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    //             return this.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2); //UI Testing

    //         },
    //     },

    setup() {
        const logo = ref(logoImg);
        const business_address = ref("123 Business Street, City, State");
        const email_from = ref("info@business.com");
        const c_name = ref("John Doe");
        const c_no = ref("+60123456789");
        const c_address = ref("Megan Ambassy, Taman U Thant, \n55000 Kuala Lumpur, \nWilayah Persekutuan Kuala Lumpur");
        const referenceNumber = ref("Q12345");
        const issue_date = ref("2025-01-28");
        const valid_date = ref("2025-02-28");
        const items = ref([
            { name: "Item 1", price: 100.0, quantity: 2 },
            { name: "Item 2", price: 50.0, quantity: 1 },
        ]);
        const notes = ref("Please ensure confirmation order within the validity period.");

        const calculate_total = computed(() => {
            return items.value.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
        });

        const formattedAddress = computed(() => {
            return c_address.value.replace(/\n/g, '<br>');
        });

        return {
            logo,
            business_address,
            email_from,
            c_name,
            c_no,
            c_address,
            referenceNumber,
            issue_date,
            valid_date,
            items,
            notes,
            calculate_total,
            formattedAddress,
        };
    }
};
</script>

<style lang="scss" scoped>
.material-icons {
    font-size: 1.6rem; // icons size
    color: var(--light);
    transition: 0.2s ease-out;
}
</style>
