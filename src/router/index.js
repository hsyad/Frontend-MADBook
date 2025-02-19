import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CoursesView from '@/views/CoursesView.vue'
import ResourcesView from '@/views/ResourcesView.vue'
import ScheduleView from '@/views/ScheduleView.vue'
import SettingsView from '@/views/SettingsView.vue'
import Quotation from '@/views/tasks/billing/createQuote.vue'
import DeliveryOrder from '@/views/tasks/billing/createDO.vue'
import Invoice from '@/views/tasks/billing/createInvoice.vue'
import Testing from '@/views/tasks/billing/testing.vue'
import QuoteDetails from '@/views/tasks/billing/QuoteDetails.vue'
import MADBook from '@/views/tasks/billing/MADBook.vue'
import CreateQuote from '@/views/tasks/billing/createQuote.vue'
import CreateDO from '@/views/tasks/billing/createDO.vue'
import CreateInvoice from '@/views/tasks/billing/createInvoice.vue'
import DODetails from '@/views/tasks/billing/DODetails.vue'
import InvoiceDetails from '@/views/tasks/billing/InvoiceDetails.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/courses',
            name: 'courses',
            component: CoursesView,
        },
        {
            path: '/resources',
            name: 'resources',
            component: ResourcesView,
        },
        {
            path: '/schedule',
            name: 'schedule',
            component: ScheduleView,
        },
        {
            path: '/madbook',
            name: 'MADBook',
            component: MADBook,
        },
        {
            path: '/create-quotation/:id',
            name: 'CreateQuotation',
            component: CreateQuote,
            props: true,
        },
        {
            path: '/quotation/:id',
            name: 'QuotationDetails',
            component: QuoteDetails,
            props: true
        },
        {
            path: '/create-delivery-order/:id',
            name: 'CreateDO',
            component: CreateDO,
            props: true,

        },
        {
            path: '/do/:id',
            name: 'DODetails',
            component: DODetails,
            props: true
        },
        {
            path: '/create-invoice/:id',
            name: 'CreateInvoice',
            component: CreateInvoice,
            props: true,

        },
        {
            path: '/invoice/:id',
            name: 'InvoiceDetails',
            component: InvoiceDetails,
            props: true
        },
        {
            path: '/testing',
            name: 'Testing',
            component: Testing,
        },
        {
            path: '/settings',
            name: 'settings',
            component: SettingsView,
        },
    ],
})

export default router
