import { createBrowserRouter, Navigate } from "react-router"
import AppLayout from "./components/AppLayout"
import StartSelector from "./pages/StartSelector"

// Habitante Pages
import Login from "./pages/Login"
import Activate from "./pages/Activate"
import ActivateVerify from "./pages/ActivateVerify"
import Password from "./pages/Password"
import ActivationSuccess from "./pages/ActivationSuccess"
import ForgotPassword from "./pages/ForgotPassword"
import RecoveryVerify from "./pages/RecoveryVerify"
import RecoveryPassword from "./pages/RecoveryPassword"
import RecoverySuccess from "./pages/RecoverySuccess"
import Home from "./pages/Home"
import Bill from "./pages/Bill"
import Review from "./pages/Review"
import OnlinePayment from "./pages/OnlinePayment"
import PaymentConfirmation from "./pages/PaymentConfirmation"
import BankVerification from "./pages/BankVerification"
import PaymentProcessing from "./pages/PaymentProcessing"
import PaymentDeclined from "./pages/PaymentDeclined"
import Success from "./pages/Success"
import Pending from "./pages/Pending"
import Unknown from "./pages/Unknown"
import Receipt from "./pages/Receipt"
import History from "./pages/History"
import Help from "./pages/Help"
import Offline from "./pages/Offline"
import OfficeCode from "./pages/OfficeCode"
import AccountUpToDate from "./pages/AccountUpToDate"
import PublicValidation from "./pages/PublicValidation"

// Campo Pages
import FieldLogin from "./pages/field/FieldLogin"
import FieldLayout from "./components/field/FieldLayout"
import FieldRoute from "./pages/field/FieldRoute"
import FieldHomes from "./pages/field/FieldHomes"
import FieldMeter from "./pages/field/FieldMeter"
import FieldCapture from "./pages/field/FieldCapture"
import FieldInvalid from "./pages/field/FieldInvalid"
import FieldCheck from "./pages/field/FieldCheck"
import FieldOutlier from "./pages/field/FieldOutlier"
import FieldReviewPending from "./pages/field/FieldReviewPending"
import FieldIssued from "./pages/field/FieldIssued"
import FieldDelivery from "./pages/field/FieldDelivery"
import FieldAbsent from "./pages/field/FieldAbsent"
import FieldDone from "./pages/field/FieldDone"
import FieldIncidence from "./pages/field/FieldIncidence"
import FieldIncidenceSuccess from "./pages/field/FieldIncidenceSuccess"
import FieldOffline from "./pages/field/FieldOffline"
import FieldPending from "./pages/field/FieldPending"
import FieldSync from "./pages/field/FieldSync"
import FieldDuplicate from "./pages/field/FieldDuplicate"
import FieldSummary from "./pages/field/FieldSummary"

// Admin Pages
import AdminLayout from "./components/admin/AdminLayout"
import AdminLogin from "./pages/admin/AdminLogin"
import CashierLogin from "./pages/admin/CashierLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminAccounts from "./pages/admin/AdminAccounts"
import AdminOperation from "./pages/admin/AdminOperation"
import AdminLiveTracking from "./pages/admin/AdminLiveTracking"
import AdminPos from "./pages/admin/AdminPos"
import AdminReports from "./pages/admin/AdminReports"
import AdminIncidents from "./pages/admin/AdminIncidents"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: StartSelector },

      // Habitante Routes
      { path: "login", Component: Login },
      { path: "activate", Component: Activate },
      { path: "activate/verify", Component: ActivateVerify },
      { path: "password", Component: Password },
      { path: "activate/success", Component: ActivationSuccess },
      { path: "recover", Component: ForgotPassword },
      { path: "recover/verify", Component: RecoveryVerify },
      { path: "recover/password", Component: RecoveryPassword },
      { path: "recover/success", Component: RecoverySuccess },
      { path: "home", Component: Home },
      { path: "bill", Component: Bill },
      { path: "review", Component: Review },
      { path: "payment/card", Component: OnlinePayment },
      { path: "payment/confirm", Component: PaymentConfirmation },
      { path: "payment/auth", Component: BankVerification },
      { path: "payment/processing", Component: PaymentProcessing },
      { path: "payment/declined", Component: PaymentDeclined },
      { path: "success", Component: Success },
      { path: "pending", Component: Pending },
      { path: "unknown", Component: Unknown },
      { path: "receipt", Component: Receipt },
      { path: "history", Component: History },
      { path: "help", Component: Help },
      { path: "offline", Component: Offline },
      { path: "office-code", Component: OfficeCode },
      { path: "up-to-date", Component: AccountUpToDate },
      { path: "public-validation", Component: PublicValidation },

      // Campo Routes
      { path: "field/login", Component: FieldLogin },
      {
        path: "field",
        Component: FieldLayout,
        children: [
          { path: "route", Component: FieldRoute },
          { path: "homes", Component: FieldHomes },
          { path: "meter", Component: FieldMeter },
          { path: "capture", Component: FieldCapture },
          { path: "invalid", Component: FieldInvalid },
          { path: "check", Component: FieldCheck },
          { path: "outlier", Component: FieldOutlier },
          { path: "review-pending", Component: FieldReviewPending },
          { path: "issued", Component: FieldIssued },
          { path: "delivery", Component: FieldDelivery },
          { path: "absent", Component: FieldAbsent },
          { path: "done", Component: FieldDone },
          { path: "incidence", Component: FieldIncidence },
          { path: "incidence-success", Component: FieldIncidenceSuccess },
          { path: "offline", Component: FieldOffline },
          { path: "pending", Component: FieldPending },
          { path: "sync", Component: FieldSync },
          { path: "duplicate", Component: FieldDuplicate },
          { path: "summary", Component: FieldSummary },
        ],
      },
    ],
  },
  { path: "/admin/login", Component: AdminLogin },
  { path: "/cashier/login", Component: CashierLogin },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "dashboard", Component: AdminDashboard },
      { path: "accounts", Component: AdminAccounts },
      { path: "operation", Component: AdminOperation },
      { path: "tracking", Component: AdminLiveTracking },
      { path: "pos", element: <Navigate to="/cashier/login" replace /> },
      { path: "reports", Component: AdminReports },
      { path: "incidents", Component: AdminIncidents },
    ],
  },
  {
    path: "/cashier",
    Component: AdminLayout,
    children: [
      { index: true, element: <Navigate to="/cashier/pos" replace /> },
      { path: "pos", Component: AdminPos },
    ],
  },
])
