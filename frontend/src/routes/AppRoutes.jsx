import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import HowVotingWorks from "../pages/public/HowVotingWorks";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VoterDashboard from "../pages/voter/Dashboard";
import Vote from "../pages/voter/Vote";
import VoterResults from "../pages/voter/Results";
import Candidates from "../pages/voter/Candidates";
import Profile from "../pages/voter/Profile";
import BlockchainExplorer from "../pages/voter/BlockchainExplorer";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ElectionControl from "../pages/admin/ElectionControl";
import ManageCandidates from "../pages/admin/ManageCandidates";
import ManageVoters from "../pages/admin/ManageVoters";
import AdminResults from "../pages/admin/Results";
import Votes from "../pages/admin/Votes";
import BlockchainMonitor from "../pages/admin/BlockchainMonitor";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => (
  <BrowserRouter>
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowVotingWorks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/voter/dashboard"
          element={
            <ProtectedRoute allowedRoles={["voter"]}>
              <VoterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter/vote"
          element={
            <ProtectedRoute allowedRoles={["voter"]}>
              <Vote />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter/results"
          element={
            <ProtectedRoute allowedRoles={["voter"]}>
              <VoterResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter/candidates"
          element={
            <ProtectedRoute allowedRoles={["voter"]}>
              <Candidates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter/profile"
          element={
            <ProtectedRoute allowedRoles={["voter"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter/blockchain"
          element={
            <ProtectedRoute allowedRoles={["voter"]}>
              <BlockchainExplorer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/elections"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ElectionControl />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/candidates"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageCandidates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/voters"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageVoters />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/results"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/votes"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Votes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blockchain"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <BlockchainMonitor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  </BrowserRouter>
);

export default AppRoutes;
