<template>
    <main>
        <div class="p-3 bg-white rounded-md">
            <div class="d-flex mb-4 justify-between items-center">
                <h2 class="fw-semibold mb-0">Delivery Order Details</h2>
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
                                    <h5 class="modal-title">Edit Delivery Order</h5>
                                    <button type="button" class="btn-close" @click="closeModal"></button>
                                </div>
                                <div class="modal-body">
                                    <!-- c_name, c_no, c_address, issue_date, delivery_date, due_date, ship_by, ship_fee, notes, bankDetails(bank_name, acc_holder, acc_num) -->
                                    <!-- FORM -->
                                    <form @submit.prevent="saveEdit">
                                        <div class="d-flex gap-2 align-baseline">
                                            <div class="flex-1">
                                                <label for="name">Delivery To: </label>
                                                <input type="text" v-model="formData.c_name"
                                                    placeholder="Enter customer name">
                                                <input type="text" v-model="formData.c_no"
                                                    placeholder="Enter customer phone number">
                                                <textarea row="3" id="c_address" v-model="formData.delivery_date"
                                                    placeholder="Eg: 456 Client Road,&#10;Town, 12345,&#10;State"></textarea>
                                            </div>
                                            <div class="flex-1">
                                                <label for="date">Issue Date: </label>
                                                <input type="date" v-model="formData.issue_date">
                                                <label class="mt-2" for="date">Delivery Date: </label>
                                                <input type="date" v-model="formData.delivery_date">
                                                <label class="mt-2" for="date">Due Date: </label>
                                                <input type="date" v-model="formData.due_date">
                                            </div>
                                        </div>

                                        <!-- SHIPPING -->
                                        <div class="d-flex mt-3 gap-3 items-center align-baseline">
                                            <label class="whitespace-nowrap" for="name">Ship By: </label>
                                            <input type="text" v-model="formData.ship_by" placeholder="Ninjavan">
                                            <label class="whitespace-nowrap" for="name">Shipping Fee: </label>
                                            <input type="number" v-model="formData.ship_fee" placeholder="RM10.00 ">
                                        </div>

                                        <!-- NOTES -->
                                        <div>
                                            <label for="notes">Notes: <i
                                                    class="text-xs font-light text-gray-400">(optional*)</i></label>
                                            <textarea placeholder="Enter notes here..."
                                                v-model="formData.notes"></textarea>
                                        </div>

                                        <!-- ADD BANK DETAILS -->
                                        <div class="mt-2 mb-3">
                                            <button type="button" class="btn btn-outline-success mb-3"
                                                @click="toggleBankDetails">
                                                <i>Add Bank Details</i>
                                            </button>

                                            <div v-if="showBankDetails">
                                                <div>
                                                    <label for="bank_name">Bank Name</label>
                                                    <input type="text" v-model="formData.bankDetails.bank_name"
                                                        class="mb-2 p-2 w-100%" id="bank_name"
                                                        placeholder="Enter bank name">
                                                </div>
                                                <div>
                                                    <label for="acc_holder">Account Holder</label>
                                                    <input type="text" v-model="formData.bankDetails.acc_holder"
                                                        class="mb-2 p-2 w-100%" id="acc_holder"
                                                        placeholder="Enter account holder name">
                                                </div>
                                                <div>
                                                    <label for="acc_num">Account Number</label>
                                                    <input type="text" v-model="formData.bankDetails.acc_num"
                                                        class="mb-2 p-2 w-100%" id="acc_num"
                                                        placeholder="Enter account number">
                                                </div>
                                            </div>
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

                    <!-- OVERLAY  -->
                    <div v-if="showEditModal" class="modal-backdrop fade show"></div>
                </div>

            </div>
            <div class=" border border-dark rounded p-4 ">
                <!-- <div class=" px-3" v-if="quotation"> -->
                <!-- UI Testing -->
                <div class="px-3">
                    <!-- UI Testing -->
                    <h2 class="mt-4 text-end fw-semibold">Delivery Order</h2>

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
                            <p class="mb-1"><strong>Delivery To:</strong></p>
                            <!-- <p class="mb-1 fs-6"><strong>{{ quotation.c_name }}</strong></p> -->
                            <p class="mb-1 fs-6">{{ c_name }}</p> <!--UI Testing-->
                            <!-- <p class="mb-1 fs-6"><strong>{{ quotation.c_no }}</strong></p> -->
                            <p class="mb-1 fs-6">{{ c_no }}</p> <!--UI Testing-->
                            <!-- <p class="mb-1 fs-6 text-wrap"><strong>{{ quotation.c_address }}</strong></p> -->
                            <p class="mb-1 fs-6 text-wrap" v-html="formattedAddress"></p> <!--UI Testing-->
                        </div>

                        <!-- DO DETAILS -->
                        <div class="container d-flex gap-4 justify-end">
                            <div class="text-end">
                                <!-- <p class="mb-1"><strong>Quote No: </strong>{{ quotation.id }}</p> -->
                                <p class="mb-1"><strong>DO No: </strong></p> <!--UI Testing-->
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
                                <th class="w-auto text-start">Items</th>
                                <th class="w-10 text-center">Quantity</th>
                            </tr>
                        </thead>
                        <tbody class="border-bottom">
                            <tr v-for="item in items" :key="item">
                                <td class="text-start">{{ item.name }}</td>
                                <td class="text-center">{{ item.quantity }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="d-flex flex-column align-items-end gap-2 mt-10">
                        <div class="d-flex justify-content-end w-100">
                            <p class="mb-px text-end">Ship By:</p>
                            <p class="mb-px text-end ms-2">{{ ship_by }}</p>
                        </div>
                        <div class="d-flex justify-content-end w-100 fw-semibold">
                            <p class="text-end">Shipping Fee:</p>
                            <p class="text-end ms-2">RM{{ parseFloat(ship_fee || 0).toFixed(2) }}</p>
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
            <div class="d-flex gap-1 mb-2">
                <button @click="navigateToDO" class="btn btn-success rounded-md text-white font-bold w-full">Create
                    Delivery Order</button>
                <button @click="navigateToInvoice" class="btn btn-success rounded-md text-white font-bold w-full">Create
                    Invoice</button>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import { computed, ref } from 'vue';
import logoImg from '/src/assets/images/kucen.png';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();

        const logo = ref(logoImg);
        //INFO
        const business_address = ref("123 Business Street, City, State");
        const email_from = ref("info@business.com");
        //CUSTOMER
        const c_name = ref("John Doe");
        const c_no = ref("+60123456789");
        const c_address = ref("Megan Ambassy, Taman U Thant, \n55000 Kuala Lumpur, \nWilayah Persekutuan Kuala Lumpur");
        const referenceNumber = ref("#12345");
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

        //MODAL
        const showEditModal = ref(false);
        const showBankDetails = ref(false);
        const formData = reactive({
            c_name: "",
            c_no: "",
            c_address: "",
            issue_date: "",
            delivery_date: "",
            due_date: "",
            ship_by: "",
            ship_fee: 0.00,
            notes: "",
            bankDetails: {
                bank_name: "",
                acc_holder: "",
                acc_num: ""
            },
        });


        const formattedAddress = computed(() => {
            return c_address.value.replace(/\n/g, '<br>');
        });

        const downloadDoc = () => {
            try {
                Swal.fire('Success', 'Document downloaded successfully', 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to download document', 'error');
            }
        }

        const openModal = () => {
            formData.c_name = c_name.value;
            formData.c_no = c_no.value;
            formData.c_address = c_address.value;
            formData.issue_date = issue_date.value;
            formData.delivery_date = delivery_date.value;
            formData.due_date = due_date.value;
            formData.ship_by = ship_by.value;
            formData.ship_fee = ship_fee.value;
            formData.notes = notes.value;
            formData.bankDetails.bank_name = bank_name.value;
            formData.bankDetails.acc_holder = acc_holder.value;
            formData.bankDetails.acc_num = acc_num.value;

            showEditModal.value = true;
        }
        const closeModal = () => {
            showEditModal.value = false;
        }
        const toggleBankDetails = () => {
            showBankDetails.value = !showBankDetails.value;
        }
        const saveEdit = () => {
            c_name.value = formData.c_name;
            c_no.value = formData.c_no;
            c_address.value = formData.c_address;
            issue_date.value = formData.issue_date;
            delivery_date.value = formData.delivery_date;
            due_date.value = formData.due_date;
            ship_by.value = formData.ship_by;
            ship_fee.value = formData.ship_fee;
            notes.value = formData.notes;
            bank_name.value = formData.bankDetails.bank_name;
            acc_holder.value = formData.bankDetails.acc_holder;
            acc_num.value = formData.bankDetails.acc_num;

            Swal.fire('Success', 'Delivery Order updated successfully', 'success');
            closeModal();
        }

        const navigateToDO = () => {
            router.push({ name: 'CreateDO' });
        }

        const navigateToInvoice = () => {
            router.push({ name: 'CreateInvoice' });
        }

        return {
            logo,
            business_address,
            email_from,
            c_name,
            c_no,
            c_address,
            referenceNumber,
            issue_date,
            delivery_date,
            due_date,
            items,
            notes,
            calculate_total,
            formattedAddress,
            ship_by,
            ship_fee,
            bank_name,
            acc_holder,
            acc_num,
            downloadDoc,
            openModal,
            closeModal,
            toggleBankDetails,
            saveEdit,
            showEditModal,
            showBankDetails,
            formData,
            navigateToDO,
            navigateToInvoice
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
