<template>
    <main>
        <!-- DESCRIPTION -->
        <!-- <div class="bg-white rounded-3">
            <h3 class="font-bold pl-4 pt-4 pb-2">New Quotation</h3>
            <p class="text-gray-600 px-3 pb-4">
                Complete the form below to generate a detailed quotation for your client.
                As you fill in the details, a live preview will instantly update, giving you a real-time view of how the
                quotation will appear.
            </p>
        </div> -->

        <h3 class="font-bold m-3 mb-5">Add New Quotation</h3>

        <!-- ERROR MESSAGE (conditional) -->
        <div v-if="showErrorMessage" class="text-red-600 font-bold mt-3 mb-3 bg-white p-3 rounded-md">
            Please fill in all required fields.
        </div>

        <!-- MAIN CONTAINER -->
        <div class="d-flex overflow-auto bg-white rounded-3">

            <!-- LIVE PREVIEW COLUMN -->
            <div class="d-flex flex-column p-3 border-end" style="flex:0.8" v-html="sanitizedContent"></div>

            <!-- FORM COLUMN -->
            <div class="p-3 flex-1">
                <!-- <p v-if="referenceNumber">Quote No: {{ referenceNumber }}</p> -->
                <p class="my-3 mb-5"><strong>Quote No: <span class="auto-generate"> #{{ referenceNumber
                            }}</span></strong>
                </p>

                <!-- LOGO -->
                <div class="d-flex align-middle gap-3">

                    <!-- Hidden File Input -->
                    <input class="d-none" type="file" id="log-upload" ref="logoInput" @change="handleLogoInput"
                        accept="image/*" />

                    <!-- Custom logo upload button -->
                    <button type="button"
                        class="btn btn-outline-success mb-3 gap-2 d-inline-flex align-items-center text-green-800 hover-bg-success-text-white"
                        @click="triggerLogoUpload">
                        <span class="material-icons">upload</span>
                        <span>Add your logo</span>
                    </button>

                    <div v-if="logo">
                        <span class="file-name">{{ logoName }}</span>
                        <button type="button" class="btn text-danger border-0 rounded-3 p-2 cursor-pointer mx-auto"
                            @click="deleteLogo">
                            <i class="fas fa-xmark"></i> </button>
                    </div>
                </div>

                <form @submit.prevent="generateDocument">
                    <div class="d-flex gap-2 align-baseline">
                        <div class="flex-1">
                            <label for="name">From:</label>
                            <input type="text" v-model="emailFrom" placeholder="Enter your email" />
                            <textarea v-model="businessAddress" placeholder="Enter your business address" />
                        </div>

                        <div class="flex-1">
                            <label for="name">For:</label>
                            <input type="text" v-model="customerName" placeholder="Enter customer name" />
                            <input type="text" v-model="emailCustomer" placeholder="Enter customer email" />
                            <textarea v-model="customerDetails" placeholder="Enter your customer address" />
                        </div>
                    </div>

                    <div class="mt-3 d-flex gap-2 align-baseline">
                        <div class="flex-1">
                            <label for="date">Issue Date: </label>
                            <input type="date" v-model="issueDate" />
                        </div>

                        <div class="flex-1">
                            <label for="date">Valid Until: </label>
                            <input type="date" v-model="validUntil" />
                        </div>
                    </div>

                    <table class="rounded-md">
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
                                <td><input class="mt-2" type="text" v-model="item.name" /></td>
                                <td><input type="number" v-model="item.price" /></td>
                                <td><input type="number" v-model="item.quantity" /></td>
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

                    <div>
                        <label for="notes">Notes: <i class="text-xs font-light text-gray-400">(optional*)</i></label>
                        <textarea placeholder="Enter notes here..." v-model="notes"></textarea>
                    </div>

                    <div class="text-lg text-right mt-3 mb-5 font-bold">
                        <span>Total: RM{{ calculateTotal }}</span>
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


export default {
    setup() {
        const referenceNumber = ref('');
        const logo = ref(null);
        const logoName = ref(null);
        const logoInput = ref(null);
        const logoPath = ref(null);

        const emailFrom = ref('');
        const businessAddress = ref('');
        const customerName = ref('');
        const emailCustomer = ref('');
        const customerDetails = ref('');
        const issueDate = ref('');
        const validUntil = ref('');
        const items = reactive([{ name: '', price: 0, quantity: 0 }]);
        const notes = ref('');
        const previewContent = ref('');
        const sanitizedContent = computed(() => DOMPurify.sanitize(previewContent.value));

        const showErrorMessage = ref(false);

        const generateRandNum = () => {
            const randomNumber = Math.floor(Math.random() * 10000);
            referenceNumber.value = `${randomNumber}`;
        };

        const triggerLogoUpload = () => {
            logoInput.value.click();
        };

        const handleLogoInput = (event) => {
            const file = event.target.files[0];
            if (file) {
                logoName.value = file.name;
                const reader = new FileReader();

                reader.onload = (e) => {
                    logo.value = e.target.result;
                    updatePreview();
                    saveLogoToDatabase(file);
                };
                reader.readAsDataURL(file);
            }
        };

        const saveLogoToDatabase = async (file) => {
            try {
                const formData = new FormData();
                formData.append("logo", file);

                const response = await fetch("/api/upload-logo", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    logoPath.value = data.filePath;
                    alert("Logo uploaded successfully!", logoPath.value);
                } else {
                    alert("Error uploading logo: ", response.statusText);
                }
            } catch (error) {
                alert("Error uploading logo: ", error);
            }
        };

        const deleteLogo = async () => {
            try {
                await fetch("/api/delete-logo", {
                    method: "DELETE",
                });

                alert("Logo deleted successfully!");
                logo.value = null;
                logoName.value = null;
                logoPath.value = null;
            } catch (error) {
                alert("Error deleting logo: ", error);
            }
        };

        const addItem = () => {
            items.push({ name: "", price: 0, quantity: 0 });
        };

        const removeItem = (index) => {
            items.splice(index, 1);
        };

        const saveOrder = async () => {
            const orderData = {
                items,
                total: calculateTotal.value,
            };

            try {
                const response = await axios.post('/api/orders', orderData);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Order saved successfully!',
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Error saving order: ${error.message}`,
                });
            }
        };

        const validateForm = () => {
            if (!emailFrom.value || !customerName.value || items.value === 0) {
                showErrorMessage.value = true;
                return false;
            }
            showErrorMessage.value = false;
            return true;
        };

        const generateDocument = async () => {
            showErrorMessage.value = false;

            if (validateForm()) {
                try {
                    const formData = {
                        logo: logo.value,
                        email_from: emailFrom.value,
                        business_address: businessAddress.value,
                        customer_name: customerName.value,
                        customer_details: customerDetails.value,
                        issue_date: issueDate.value,
                        valid_until: validUntil.value,
                        items: items.value,
                        total: calculateTotal.value,
                        notes: notes.value,
                    };

                    const response = await fetch("/api/quotation", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to save the quotation. Please try again.");
                    }

                    const result = await response.json();
                    Swal.fire({
                        icon: 'success',
                        title: 'Quotation Generated',
                        text: result.message,
                        confirmButtonText: 'Go to Quotation'
                    }).then(() => {
                        window.location.href = `/quotation/${result.quotation.id}`;
                    });
                } catch (error) {
                    console.error("Error generating document:", error);

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.message || "An error occurred while generating the document. Please try again.",
                        confirmButtonText: 'Try Again',
                    });

                    showErrorMessage.value = true;
                }
            }
        };


        const generatePreviewContent = () => {
            return `
                <div style="margin: 20px; height: 100vh; border: 2px solid black;">
                    <div style="margin: 30px;">
                    <h2 style="text-align: right; font-weight: 600;">Quote</h2>

                    <div style="display: flex; justify-content: flex-start; align-items: center; margin-top: 25px; margin-bottom: 25px;">
                        ${logo.value ? `
                        <div style="display: inline-block; height: 80px; overflow: hidden;">
                            <img src="${logo.value}" alt="logo" style="height: 100%; object-fit: contain;">
                        </div>
                        ` : ""}
                    </div>

                    <p style="color: grey; font-size: 12px;">${businessAddress.value} | ${emailFrom.value}</p>

                    <div style="display: flex; justify-content: space-between; margin-top: 25px;">
                        <div style="flex: 1; text-align: left;">
                            <p style="margin: 1px;"><strong>For:</strong></p>
                            <p  style="margin: 1px;">${customerName.value}</p>
                            <p style="white-space: pre; margin: 1px;">${customerDetails.value}</p>
                        </div>

                        <div style="text-align: left;">
                            <p style="margin: 1px;"><strong>Quote No : </strong> ${referenceNumber.value}</p>
                            <p  style="margin: 1px;"><strong>Issue Date : </strong> ${issueDate.value}</p>
                            <p  style="margin: 1px;"><strong>Valid Until : </strong> ${validUntil.value}</p>
                        </div>
                    </div>

                    <table style="border-collapse: collapse; width: 100%; margin-top: 50px; box-shadow: none;">
                        <thead style="background-color: lightgrey; color: black;">
                            <tr>
                                <th style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">No.</th>
                                <th style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">Items</th>
                                <th style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">Price</th>
                                <th style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">Quantity</th>
                                <th style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items
                    .map(
                        (item, index) => `
                                        <tr>
                                            <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
                                            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${item.name}</td>
                                            <td style="border: 1px solid #ddd; padding: 8px;">${item.price}</td>
                                            <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                                            <td style="border: 1px solid #ddd; padding: 8px;">${item.price * item.quantity || 0}</td>
                                        </tr>
                                    `
                    )
                    .join("")}
                        </tbody>
                    </table>

                    <p style="margin-top: 20px;"><strong>Notes:</strong> ${notes.value}</p>
                    <p style="text-align: right; font-size: 18px; font-weight: bold;">Total: RM${calculateTotal.value}</p>
                </div>
                </div>
            `;
        };

        const updatePreview = () => {
            previewContent.value = generatePreviewContent();
            // this.sanitizedContent = DOMPurify.sanitize(this.previewContent);
        };

        const calculateTotal = computed(() => {
            return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        });

        watchEffect(() => {
            updatePreview();
        });

        onMounted(() => {
            generateRandNum();
            updatePreview();
        });


        return {
            referenceNumber,
            logo,
            logoName,
            logoPath,
            logoInput,
            saveLogoToDatabase,
            emailFrom,
            businessAddress,
            emailCustomer,
            customerName,
            customerDetails,
            issueDate,
            validUntil,
            items,
            notes,
            previewContent,
            sanitizedContent,
            calculateTotal,
            addItem,
            removeItem,
            saveOrder,
            showErrorMessage,
            generateDocument,
            deleteLogo,
            triggerLogoUpload,
            handleLogoInput,
            generatePreviewContent,
        };
    },
};
</script>
