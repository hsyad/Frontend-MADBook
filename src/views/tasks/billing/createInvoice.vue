<template>
    <main>
        <!-- TITLE -->
        <div class="bg-white p-3 rounded-md mb-3">
            <h3 class="font-bold mt-2 mb-4 border-b-2 pb-3">Create New Invoice</h3>
            <div class="d-flex gap-2 align-middle">
                <p class="fw-semibold">Subject:</p>
                <p class="text-gray-600">Test 1</p>
            </div>
        </div>

        <!-- MAIN CONTAINER -->
        <div class="d-flex overflow-auto bg-white rounded-3">

            <!-- LIVE PREVIEW COLUMN -->
            <div class="d-flex flex-column p-3 border-end" style="flex:0.8" v-html="sanitizedContent"></div>

            <!-- FORM COLUMN -->
            <div class="p-3 flex-1">
                <p class="my-3 mb-5"><strong>Invoice No: <span class="auto-generate">
                            #{{ reference_number }}</span></strong>
                </p>

                <!-- LOGO -->
                <div class="d-flex align-middle gap-3">

                    <input class="d-none" type="file" id="log-upload" ref="logo_input" @change="handleLogoInput"
                        accept="image/*" />

                    <button type="button"
                        class="btn btn-outline-success mb-3 gap-2 d-inline-flex align-items-center text-green-800 hover-bg-success-text-white"
                        @click="triggerLogoUpload">
                        <span class="material-icons">upload</span>
                        <span>Add your logo</span>
                    </button>

                    <div v-if="logo">
                        <span class="file-name">{{ logo_name }}</span>
                        <button type="button" class="btn text-danger border-0 rounded-3 p-2 cursor-pointer mx-auto"
                            @click="deleteLogo">
                            <i class="fas fa-xmark"></i> </button>
                    </div>
                </div>

                <!-- FORM INPUT -->
                <form @submit.prevent="generateDocument">
                    <div class="d-flex gap-2 align-baseline">
                        <div class="flex-1">
                            <label for="name">Delivery To:</label>
                            <input type="text" v-model="c_name" placeholder="Enter customer name" required />
                            <input type="text" v-model="c_no" placeholder="Enter customer phone number" required />
                            <textarea rows="3" v-model="c_address"
                                placeholder="Eg: 456 Client Road,&#10;Town, 12345,&#10;State" required />
                        </div>
                        <div class="flex-1">
                            <label for="date">Issue Date: </label>
                            <input type="date" v-model="issue_date" required />
                            <label class="mt-2" for="date">Delivery Date: </label>
                            <input type="date" v-model="delivery_date" required />
                            <label class="mt-2" for="date">Due Date: </label>
                            <input type="date" v-model="due_date" required />
                        </div>
                    </div>

                    <!-- TABLE -->
                    <table class="rounded-md mt-4">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Items</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in items" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td><input class="mt-2" type="text" v-model="item.name" disabled /></td>
                                <td><input type="number" v-model="item.price" disabled /></td>
                                <td><input type="number" v-model="item.quantity" disabled /></td>
                                <td>{{ (item.quantity * item.price) || 0 }}</td>
                                <td><button type="button"
                                        class="btn text-danger border-0 rounded-3 p-2 cursor-pointer d-block mx-auto"
                                        @click="removeItem(index)" disabled><i class="fas fa-trash"></i></button></td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- SHIPPING -->
                    <div class="d-flex mt-3 gap-2 items-center align-baseline">
                        <label class="whitespace-nowrap" for="name">Ship By:</label>
                        <input type="text" v-model="ship_by" placeholder="Ninjavan" disabled />
                        <label class="whitespace-nowrap" for="name">Shipping Fee: </label>
                        <input type="number" v-model="ship_fee" placeholder="RM10" disabled />
                    </div>

                    <!-- NOTES -->
                    <div class="mt-2">
                        <label for="notes">Notes: <i class="text-xs font-light text-gray-400">(optional*)</i></label>
                        <textarea placeholder="Enter notes here..." v-model="notes"></textarea>
                    </div>

                    <!-- ADD BANK DETAILS -->
                    <div class="mt-2 mb-3">
                        <button type="button"
                            class="btn btn-outline-success mb-3 gap-2 d-inline-flex align-items-center text-green-800 hover-bg-success-text-white"
                            @click="toggleForm">
                            <i class="fas fa-plus"></i>Add Bank Details
                        </button>

                        <div v-if="showForm">
                            <div>
                                <label for="bank_name">Bank Name:</label>
                                <input class="mb-2 p-2 w-100%" type="text" v-model="bankDetails.bank_name"
                                    id="bank_name" placeholder="Enter bank name" />
                            </div>
                            <div>
                                <label for="acc_holder">Account Holder Name:</label>
                                <input class="mb-2 p-2 w-100%" type="text" v-model="bankDetails.acc_holder"
                                    id="acc_holder" placeholder="Enter account holder name" />
                            </div>
                            <div>
                                <label for="acc_num">Account Number:</label>
                                <input class="mb-2 p-2 w-100%" type="text" v-model="bankDetails.acc_num" id="acc_num"
                                    placeholder="Enter your account number" />
                            </div>
                        </div>
                    </div>

                    <!-- CALCULATE TOTAL -->
                    <div class="text-lg text-right mt-3 mb-5 font-bold">
                        <span>Total: RM{{ calculate_total }}</span>
                    </div>

                    <button type="submit"
                        class="btn btn-success w-full mb-3 gap-2 d-inline-flex justify-content-center hover-bg-success-text-white">Generate
                        Document</button>
                </form>

            </div>
        </div>
    </main>
</template>

<script>
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import DOMPurify from 'dompurify';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useMADBookStore } from '@/stores/madbookStore';
import logoImg from '@/assets/images/kucen.png';
import InvoiceDetails from './InvoiceDetails.vue';
import router from '@/router';


export default {
    setup() {
        const madbookStore = useMADBookStore();

        //FORM//
        const reference_number = ref('');

        //LOGO
        const logo = ref(logoImg);
        const logo_name = ref(null);
        const logo_input = ref(null);
        const logo_path = ref(null);

        //INFO
        const email_from = ref('');
        const business_address = ref('');
        const subject = ref('');

        //CLIENT DETAILS
        const c_name = ref('');
        const c_no = ref('');
        const c_address = ref('');

        //DATES
        const issue_date = ref('');
        const delivery_date = ref('');
        const due_date = ref('');

        //SHIPPING
        const ship_by = ref('Ninjavan');
        const ship_fee = ref('10');

        //ITEMS
        const items = reactive([
            { name: 'Item 1', price: 100, quantity: 2 },
            { name: "Item 2", price: 50, quantity: 1 },
        ]);

        const notes = ref('');
        const previewContent = ref('');
        const sanitizedContent = computed(() => DOMPurify.sanitize(previewContent.value));
        const totalWithShipping = ref('');

        const generateRandNum = () => {
            const randomNumber = Math.floor(Math.random() * 10000);
            reference_number.value = `${randomNumber}`;
        };

        const triggerLogoUpload = () => {
            logo_input.value.click();
        };

        const handleLogoInput = (event) => {
            const file = event.target.files[0];
            if (file) {
                logo_name.value = file.name;
                const reader = new FileReader();

                reader.onload = (e) => {
                    logo.value = e.target.result;
                    updatePreview();
                };
                reader.readAsDataURL(file);
            }
        };

        const removeItem = (index) => {
            items.splice(index, 1);
        };

        const generateDocument = () => {
            try {
                Swal.fire({
                    title: "Success",
                    text: "Invoice successfully created!",
                    icon: "success",
                    confirmButtonText: "Home",
                }).then(() => {
                    router.push({ name: 'MADBook' });
                });
            } catch (error) {
                console.error("Error saving invoice: ", error);
                Swal.fire("Error", "Failed to save invoice. Please try again.", "error");
            }
        };

        // BANK DETAILS
        const showForm = ref(false);
        const bankDetails = ref({
            bank_name: 'Maybank Malaysia',
            acc_holder: 'Ali bin Abu',
            acc_num: '1234567890',
        });
        const toggleForm = () => {
            showForm.value = !showForm.value;
        };

        const generatePreviewContent = () => {
            return `
               <div class="border border-dark rounded p-3">
                    <div class="px-3">
                    <h2 class="mt-4 text-end fw-semibold">Invoice</h2>

                    <div class="d-flex justify-flex-start items-center my-4">
                        ${logo.value ? `
                        <div class="d-inline-block overflow-hidden h-20">
                            <img src="${logo.value}" alt="logo" class="h-100 object-contain">
                        </div>
                        ` : ""}
                    </div>

                    <p class="text-secondary small">123 Business Street, City, State | info@business.com </p>

                    <div class="d-flex justify-between my-4">
                        <div class="text-start flex-grow-1">
                            <p class="mb-1"><strong>Bill To:</strong></p>
                            <p class="mb-1 fs-7">${c_name.value}</p>
                            <p class="mb-1 fs-7">${c_no.value}</p>
                            <p class="mb-1 fs-7 whitespace-pre">${c_address.value}</p>
                        </div>

                        <div class="d-flex gap-2 justify-end">
                            <div class="text-end">
                                <p class="mb-1"><strong>Invoice No: </strong></p>
                                <p class="mb-1"><strong>Issue Date: </strong></p>
                                <p class="mb-1"><strong>Delivery Date: </strong></p>
                                <p class="mb-1"><strong>Due Date: </strong></p>
                            </div>
                            <div class="text-start">
                                <p class="mb-1">${reference_number.value}</p>
                                <p class="mb-1">${issue_date.value}</p>
                                <p class="mb-1">${delivery_date.value}</p>
                                <p class="mb-1">${due_date.value}</p>
                            </div>
                        </div>

                    </div>

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
                            ${items
                    .map(
                        (item, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td class="text-start">${item.name}</td>
                                            <td>${item.price}</td>
                                            <td>${item.quantity}</td>
                                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    `
                    )
                    .join("")}

                        </tbody>
                    </table>

                        <div class="d-flex gap-3 justify-end m-1">
                            <p class="mb-1 text-end">Ship By: </p>
                            <p class="mb-1 text-start">${ship_by.value}</p>
                        </div>
                        <div class="d-flex gap-3 justify-end m-1">
                            <p class="mb-1 text-end">Shipping Fee: </p>
                            <p class="mb-1 text-start">RM${ship_fee.value}</p>
                        </div>
                        <div class="d-flex gap-3 justify-end m-1 text-lg">
                            <p class="fw-bold">Total: </p>
                            <p class="fw-bold">RM${calculate_total.value}</p>
                        </div>


                    <p class="mt-5"><strong>Notes:</strong> ${notes.value}</p>
                    <div class="mt-4 mb-4 border-s-8 border-emerald-500 pl-4">
                        <p class="mt-3 mb-px text-sm"> ${bankDetails.value.bank_name}</p>
                        <p class="mb-px text-sm"> ${bankDetails.value.acc_holder}</p>
                        <p class="mb-px text-sm"> ${bankDetails.value.acc_num}</p>
                    </div>
                </div>
                </div>
            `;
        };

        const updatePreview = () => {
            previewContent.value = generatePreviewContent();
        };

        //CALCULATE TOTAL
        const calculate_total = computed(() => {
            const total = items.reduce((sum, item) => {
                return sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
            }, 0);

            const totalWithShipping = total + (parseFloat(ship_fee.value) || 0); // Use .value for ref

            return totalWithShipping.toFixed(2);
        });

        watchEffect(() => {
            updatePreview();
        });

        onMounted(() => {
            generateRandNum();
            updatePreview();
        });


        return {
            subject,
            reference_number,
            //logo
            logo,
            logo_name,
            logo_path,
            logo_input,
            //info
            email_from,
            business_address,
            //client details
            c_no,
            c_name,
            c_address,
            //dates
            due_date,
            issue_date,
            delivery_date,
            //shipping
            ship_by,
            ship_fee,
            //items
            items,

            notes,
            previewContent,
            sanitizedContent,

            //total
            calculate_total,
            totalWithShipping,

            //bank details
            showForm,
            bankDetails,
            toggleForm,

            removeItem,
            updatePreview,
            handleLogoInput,
            generateDocument,
            triggerLogoUpload,
            generatePreviewContent,
        };
    },
};
</script>
