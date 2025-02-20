<template>
    <main>
        <!-- TITLE -->
        <div class="bg-white p-3 rounded-md mb-3">
            <h3 class="font-bold mt-2 mb-4 border-b-2 pb-3">Create New Quotation</h3>
            <div class="d-flex gap-2 align-middle items-center">
                <p class="fw-semibold m-0">Subject: </p>
                <input class="m-0" type="text" v-model="subject" placeholder="Enter quote subject" />
            </div>
        </div>

        <!-- MAIN CONTAINER -->
        <div class="d-flex overflow-auto bg-white rounded-3">

            <!-- LIVE PREVIEW COLUMN -->
            <div class="d-flex flex-column p-3 border-end" style="flex:0.8" v-html="sanitizedContent"></div>

            <!-- FORM COLUMN -->
            <div class="p-3 flex-1">
                <!-- <p v-if="referenceNumber">Quote No: {{ referenceNumber }}</p> -->
                <p class="my-3 mb-5"><strong>Quote No: <span class="auto-generate">
                            {{ "#MAD00" + quoteId.id }}</span></strong>
                </p>

                <!-- LOGO -->
                <div class="d-flex align-middle gap-3">

                    <input class="d-none" type="file" id="logo" ref="logo_input" @change="handleLogoInput"
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
                            <label for="name">From:</label>
                            <input type="text" v-model="email" placeholder="Enter your email" required />
                            <textarea v-model="address" placeholder="Enter your business address" required />
                        </div>

                        <div class="flex-1">
                            <label for="name">For:</label>
                            <input type="text" v-model="c_name" placeholder="Enter customer name" required />
                            <input type="text" v-model="c_no" placeholder="Enter customer phone number" required />
                            <textarea rows="3" v-model="c_address"
                                placeholder="Eg: 456 Client Road,&#10;Town, 12345,&#10;State" required />
                        </div>
                    </div>

                    <div class="mt-3 d-flex gap-2 align-baseline">
                        <div class="flex-1">
                            <label for="date">Issue Date: </label>
                            <input type="date" v-model="issue_date" required />
                        </div>

                        <div class="flex-1">
                            <label for="date">Valid Until: </label>
                            <input type="date" v-model="valid_date" required />
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
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in items" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td><input class="mt-2" type="text" v-model="item.name" required /></td>
                                <td><input type="number" v-model="item.price" required /></td>
                                <td><input type="number" v-model="item.quantity" required /></td>
                                <td>{{ (item.quantity * item.price) || 0 }}</td>
                                <td><button type="button"
                                        class="btn text-danger border-0 rounded-3 p-2 cursor-pointer d-block mx-auto"
                                        @click="removeItem(index)"><i class="fas fa-trash"></i></button></td>
                            </tr>
                        </tbody>
                    </table>

                    <button type="button"
                        class="btn btn-success mb-3 gap-2 d-inline-flex align-items-center text-green-800 hover-bg-success-text-white icon-btn"
                        @click="addItem">
                        <i class="fas fa-plus"></i>Add Item
                    </button>

                    <!-- NOTES -->
                    <div class="mt-3">
                        <label for="notes">Notes: <i class="text-xs font-light text-gray-400">(optional*)</i></label>
                        <textarea placeholder="Enter notes here..." v-model="notes"></textarea>
                    </div>

                    <!-- CALCULATE TOTAL -->
                    <div class="text-lg text-right mt-3 mb-5 font-bold">
                        <span>Total: RM{{ calculate_total }}</span>
                    </div>

                    <!-- GENERATE/SAVE DOCUMENT -->
                    <button type="submit"
                        class="btn btn-success w-full mb-3 gap-2 d-inline-flex justify-content-center hover-bg-success-text-white">Generate
                        Document</button>
                </form>

            </div>
        </div>
    </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watchEffect } from 'vue';
import DOMPurify from 'dompurify';
import axios from 'axios';
import Swal from 'sweetalert2';
import router from '@/router';
import { onBeforeRouteLeave } from 'vue-router';

const borrower_id = ref('');
const quoteId = defineProps({
    id: {
        required: true,
    }
})
// FORM DETAILS
const subject = ref('Hasya Test 2');

const logo = ref(null);
const logo_name = ref("");
const logo_input = ref(null);

const issue_date = ref('2025-01-20');
const valid_date = ref('2025-01-25');
const c_name = ref('Hasya');
const c_address = ref('alamat mana2');
const c_no = ref('0123456789');
const email = ref('hasy@example.com');
const address = ref('alamat1, alamat2, sekian');
const items = reactive([{ name: 'item 1', price: 10, quantity: 2 }, { name: 'item 2', price: 20, quantity: 2 }]);
const notes = ref('Hello bello annyeonghaseyo arigato bye byeee');

const previewContent = ref('');
const sanitizedContent = computed(() => DOMPurify.sanitize(previewContent.value));

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

// Add a new item to the quotation
const addItem = () => {
    items.push({ name: "", price: 0, quantity: 0 });
};

// Remove an item from the quotation
const removeItem = (index) => {
    items.splice(index, 1);
};

// Calculate the total of the items in the quotation
const calculate_total = computed(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
});

// Generate the content for previewing the quotation
const generatePreviewContent = () => {
    return `
    <div class="border border-dark rounded p-3">
      <div class="px-3">
        <h2 class="mt-4 text-end fw-semibold">Quote</h2>

        <div class="d-flex justify-flex-start items-center my-4">
          ${logo.value ? `
            <div class="d-inline-block overflow-hidden h-20">
              <img src="${logo.value}" alt="logo" class="h-100 object-contain">
            </div>
          ` : ""}
        </div>

        <p class="text-secondary small">${address.value} | ${email.value}</p>

        <div class="d-flex justify-between my-4">
          <div class="text-start flex-grow-1">
            <p class="mb-1"><strong>For:</strong></p>
            <p class="mb-1 fs-7">${c_name.value}</p>
            <p class="mb-1 fs-7">${c_no.value}</p>
            <p class="mb-1 fs-7 whitespace-pre">${c_address.value}</p>
          </div>

          <div class="d-flex gap-2 justify-end">
            <div class="text-end">
              <p class="mb-1"><strong>Quote No: </strong></p>
              <p class="mb-1"><strong>Issue Date: </strong></p>
              <p class="mb-1"><strong>Valid Until: </strong></p>
            </div>
            <div class="text-start">
              <p class="mb-1">${quoteId.id}</p>
              <p class="mb-1">${issue_date.value}</p>
              <p class="mb-1">${valid_date.value}</p>
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
            ${items.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td class="text-start">${item.name}</td>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p class="mt-5"><strong>Notes:</strong> ${notes.value}</p>
        <div class="d-flex gap-3 justify-end m-1 text-lg">
          <p class="fw-semibold">Total: </p>
          <p class="fw-semibold">RM${calculate_total.value}</p>
        </div>
      </div>
    </div>
  `;
};

const updatePreview = () => {
    previewContent.value = generatePreviewContent();
};

// Validate form inputs
const validateForm = () => {
    if (!subject.value || !c_name.value || items.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Please fill in all required fields.",
            confirmButtonColor: "#d33",
        });
        return false;
    }
    return true;
};

const saveQuoteToDatabase = async (quoteData) => {
    try {
        // Simulate saving the quote data to a database
        const response = await axios.post('http://quotation.test/api/Quotation/Store', quoteData); // Adjust URL to match your backend
        const quoteId = response.data.quotation.id;
        Swal.fire("Success", "Quotation has been saved to the database!", "success");
        router.push(`/Quotation/${quoteId}`);
    } catch (error) {
        console.error("Error saving quotation: ", error);
        Swal.fire("Error", "Failed to save quotation. Please try again.", "error");
    }
};

// Handle document generation
const generateDocument = () => {
    if (validateForm()) {
        const quoteData = {
            logo: logo.value || null,
            email: email.value.trim(),
            address: address.value.trim(),
            subject: subject.value.trim(),
            c_name: c_name.value.trim(),
            c_no: c_no.value.trim(),
            c_address: c_address.value.trim(),
            issue_date: issue_date.value.trim(),
            valid_date: valid_date.value.trim(),
            items: items.length > 0 ? items : [],
            total: calculate_total.value || 0,
            notes: notes.value.trim() || "",
            borrower_id: borrower_id.id
        };
        console.log(quoteData)
        saveQuoteToDatabase(quoteData);
    }
};

const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ";"
};

onBeforeRouteLeave((to, from, next) => {
    Swal.fire({
        title: "Are you sure?",
        text: "The data will not be saved!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, leave",
        cancelButtonText: "Stay",
    }).then((result) => {
        if (result.isConfirmed) {
            next(); // Allow navigation
        } else {
            next(false); // Cancel navigation
        }
    });
});

// Update preview when any field changes
watchEffect(() => {
    updatePreview();
});

onMounted(() => {
    updatePreview();
    window.removeEventListener("beforeunload", handleBeforeUnload);
});

onUnmounted(() => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>
