import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CoursesView from '@/views/CoursesView.vue'
import ResourcesView from '@/views/ResourcesView.vue'
import ScheduleView from '@/views/ScheduleView.vue'
import SettingsView from '@/views/SettingsView.vue'
import Billing from '@/views/tasks/billing/Billing.vue'
import Quotation from '@/views/tasks/billing/Quotation.vue'
import DeliveryOrder from '@/views/tasks/billing/DeliveryOrder.vue'
import Invoice from '@/views/tasks/billing/Invoice.vue'
import Testing from '@/views/tasks/billing/testing.vue'
import QuoteDetails from '@/views/tasks/billing/QuoteDetails.vue'

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
            path: '/billing',
            name: 'billing',
            component: Billing,
        },
        {
            path: '/quotation',
            name: 'Quotation',
            component: Quotation,
        },
        {
            path: '/quotation-details',
            name: 'Quotation Details',
            component: QuoteDetails,
        },
        {
            path: '/delivery-order',
            name: 'Delivery Order',
            component: DeliveryOrder,
        },
        {
            path: '/invoice',
            name: 'Invoice',
            component: Invoice,
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
