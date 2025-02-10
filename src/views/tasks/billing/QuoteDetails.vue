<template>
    <main>
        <div class="p-3 bg-white rounded-md">
            <div class="d-flex mb-4 justify-between items-center">
                <h2 class="fw-semibold mb-0">Quotation Details</h2>
                <div class="d-flex gap-2">
                    <button @click="downloadDoc" class="btn btn-primary rounded-md text-white font-bold h-12 w-20">
                        <span class="material-icons text-white align-middle">
                            download
                        </span>
                    </button>
                    <button @click="openModal"
                        class="btn btn-success rounded-md text-white font-bold h-12 w-20">Edit</button>

                    <!-- MODAL -->
                    <div v-if="showEditModal" class="modal fade show d-block">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Edit Quotation</h5>
                                    <button type="button" class="btn-close" @click="closeModal"></button>
                                </div>
                                <div class="modal-body">
                                    <form @submit.prevent="saveEdit">
                                        <div class="d-flex items-center gap-3">
                                            <div v-if="formData.logo"
                                                class="d-inline-block overflow-hidden h-28 border rounded-md mb-3">
                                                <img :src="formData.logo" alt="logo" class="h-full object-contain p-2">
                                            </div>

                                            <input class="d-none" type="file" id="edit_logo_upload" accept="image/*"
                                                @change="handleEditLogoInput" hidden />

                                            <button type="button"
                                                class="btn btn-outline-success mb-3 gap-2 h-10 d-inline-flex align-items-center text-green-800 hover-bg-success-white"
                                                @click="triggerEditLogoUpload">
                                                <span class="material-icons">upload</span>
                                                <span>Change logo</span>
                                            </button>
                                        </div>


                                        <div class="d-flex gap-2 align-baseline">
                                            <div class="flex-1">
                                                <label for="name">From:</label>
                                                <input type="text" v-model="formData.business_address"
                                                    placeholder="Enter business name">
                                                <input type="text" v-model="formData.email_from"
                                                    placeholder="Enter business email">
                                            </div>
                                            <div class="flex-1">
                                                <label for="name">For:</label>
                                                <input type="text" v-model="formData.c_name"
                                                    placeholder="Enter customer name">
                                                <input type="text" v-model="formData.c_no"
                                                    placeholder="Enter customer phone number">
                                                <textarea rows="3" id="c_address" v-model="formData.c_address"
                                                    placeholder="Eg: 456 Client Road,&#10;Town, 12345,&#10;State"></textarea>
                                            </div>
                                        </div>

                                        <div class="mt-2 d-flex gap-2 align-baseline">
                                            <div class="flex-1">
                                                <label for="date">Issue Date:</label>
                                                <input type="date" v-model="formData.issue_date">
                                            </div>
                                            <div class="flex-1">
                                                <label for="date">Valid Until:</label>
                                                <input type="date" v-model="formData.valid_date">
                                            </div>
                                        </div>


                                        <!-- ITEMS -->
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
                                                    <td class="align-middle">{{ index + 1 }}</td>
                                                    <td class="text-start">
                                                        <input type="text" v-model="item.name">
                                                    </td>
                                                    <td>
                                                        <input type="number" v-model="item.price"
                                                            @input="updateAmount(index)">
                                                    </td>
                                                    <td>
                                                        <input type="number" v-model="item.quantity"
                                                            @input="updateAmount(index)">
                                                    </td>
                                                    <td>
                                                        <input type="number" v-model="item.amount" disabled>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <button type="button"
                                            class="btn btn-success mb-3 gap-2 d-inline-flex align-items-center text-green-800 hover-bg-success-text-white icon-btn"
                                            @click="addItem">
                                            <i class="fas fa-plus"></i>Add Item
                                        </button>

                                        <div>
                                            <label for="notes">Notes: <i
                                                    class="text-xs font-light text-gray-400">(optional*)</i></label>
                                            <textarea placeholder="Enter notes here..."
                                                v-model="formData.notes"></textarea>
                                        </div>

                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary"
                                                @click="closeModal">Cancel</button>
                                            <button type="submit" class="btn btn-success">Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- OVERLAY -->
                    <div v-if="showEditModal" class="modal-backdrop fade show"></div>
                </div>
            </div>

            <div class="border border-dark rounded p-4">
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
                            <p class="mb-1"><strong>For:</strong></p>
                            <!-- <p class="mb-1 fs-6"><strong>{{ quotation.c_name }}</strong></p> -->
                            <p class="mb-1 fs-6">{{ c_name }}</p> <!--UI Testing-->
                            <!-- <p class="mb-1 fs-6"><strong>{{ quotation.c_no }}</strong></p> -->
                            <p class="mb-1 fs-6">{{ c_no }}</p> <!--UI Testing-->
                            <!-- <p class="mb-1 fs-6 text-wrap"><strong>{{ quotation.c_address }}</strong></p> -->
                            <p class="mb-1 fs-6 whitespace-pre">{{ c_address }}</p> <!--UI Testing-->
                        </div>

                        <!-- QUOTE DETAILS -->
                        <div class="container d-flex gap-2 justify-end">
                            <div class="text-end">
                                <!-- <p class="mb-1"><strong>Quote No: </strong>{{ quotation.id }}</p> -->
                                <p class="mb-1"><strong>Quote No: </strong></p> <!--UI Testing-->
                                <!-- <p class="mb-1"><strong>Issue Date: </strong>{{ quotation.issue_date }}</p> -->
                                <p class="mb-1"><strong>Issue Date: </strong></p> <!--UI Testing-->
                                <!-- <p class="mb-1"><strong>Valid Until: </strong>{{ quotation.valid_date }}</p> -->
                                <p class="mb-1"><strong>Valid Until: </strong></p>
                            </div>
                            <div class="text-start">
                                <p class="mb-1">{{ referenceNumber }}</p> <!--UI Testing-->
                                <p class="mb-1">{{ issue_date }}</p> <!--UI Testing-->
                                <p class="mb-1">{{ valid_date }}</p>
                            </div>
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
                        <!-- <tr v-for="(item, index) in quotation.items" :key="index"> -->
                        <tr v-for="(item, index) in items" :key="index"> <!--UI Testing-->
                            <td>{{ index + 1 }}</td>
                            <td class="text-start">{{ item.name }}</td>
                            <td>RM{{ item.price }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>RM{{ (item.price * item.quantity).toFixed(2) }}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="d-flex gap-3 justify-end mt-6">
                    <div class="text-end">
                        <p class="fw-semibold">Total: </p>
                    </div>
                    <div class="text-end">
                        <p class="fw-semibold">RM{{ calculate_total }}</p>
                    </div>
                </div>

                <!-- <p class="mt-3"><strong>Notes: </strong>{{ quotation.notes }}</p> -->
                <p class="mt-5"><strong>Notes: </strong>{{ notes }}</p> <!--UI Testing-->
            </div>
            <!-- <div v-else>
                <p>Loading...</p>
            </div> -->
        </div>
        <div class="flex m-2 justify-center">

        </div>
        <div class="d-flex gap-1 mb-2">
            <button @click="navigateToDO" class="btn btn-success rounded-md text-white font-bold w-full">Create Delivery
                Order</button>
            <button @click="navigateToInvoice" class="btn btn-success rounded-md text-white font-bold w-full">Create
                Invoice</button>
        </div>
    </main>
</template>

<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { computed, reactive, ref, watch } from 'vue';
import logoImg from '/src/assets/images/kucen.png';
import { useRouter } from 'vue-router';

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

const router = useRouter();
//LOGO
const logo = ref(logoImg);
const logo_name = ref(null);
const logo_input = ref(null);
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
const valid_date = ref("2025-02-28");
//ITEMS
const items = ref([
    { name: "Item 1", price: 100.00, quantity: 2, amount: 200.00 },
    { name: "Item 2", price: 50.00, quantity: 1, amount: 50.00 },
]);
const calculate_total = ref(250.00);
const notes = ref("Please ensure confirmation order within the validity period.");

//MODAL
const showEditModal = ref(false);
const formData = reactive({
    logo: "",
    business_address: "",
    email_from: "",
    c_name: "",
    c_no: "",
    c_address: "",
    issue_date: "",
    valid_date: "",
    notes: "",
    items: [],
});

const triggerEditLogoUpload = () => {
    document.getElementById('edit_logo_upload').click();
};

const handleEditLogoInput = (event) => {
    console.log("File input changed", event.target.files);
    const file = event.target.files[0];
    if (file) {
        formData.logo = URL.createObjectURL(file);
        console.log("Updated logo URL:", formData.logo);
    }
};

const downloadDoc = () => {
    try {
        Swal.fire('Success', 'Document downloaded successfully', 'success');
    } catch (error) {
        Swal.fire('Error', 'Failed to download document', 'error');
    }
}

const openModal = () => {
    formData.logo = logo.value;
    formData.business_address = business_address.value;
    formData.email_from = email_from.value;
    formData.c_name = c_name.value;
    formData.c_no = c_no.value;
    formData.c_address = c_address.value;
    formData.issue_date = issue_date.value;
    formData.valid_date = valid_date.value;
    formData.notes = notes.value;

    formData.items = items.value;

    showEditModal.value = true;
}

const updateAmount = (index) => {
    formData.items[index].amount = formData.items[index].price * formData.items[index].quantity;
}

watch(() => formData.items, (newItems) => {
    calculate_total.value = newItems.reduce((total, item) => total + item.amount, 0);
}, { deep: true });

const closeModal = () => {
    showEditModal.value = false;
}
const saveEdit = () => {
    logo.value = formData.logo;
    business_address.value = formData.business_address;
    email_from.value = formData.email_from;
    c_name.value = formData.c_name;
    c_no.value = formData.c_no;
    c_address.value = formData.c_address;
    issue_date.value = formData.issue_date;
    valid_date.value = formData.valid_date;
    notes.value = formData.notes;

    items.value = formData.items;

    Swal.fire('Success', 'Quotation updated successfully', 'success');
    closeModal();

    console.log("Form submitted with data: ", formData);
}

const addItem = () => {
    formData.items.push({
        name: "",
        price: 0,
        quantity: 0,
    });
};

const navigateToDO = () => {
    router.push('/create-delivery-order');
}

const navigateToInvoice = () => {
    router.push('/create-invoice');
}
</script>

<style lang="scss" scoped>
.material-icons {
    font-size: 1.6rem; // icons size
    color: var(--light);
    transition: 0.2s ease-out;
}
</style>
