"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import Breadcrumb from "@/app/admin/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import { useAdminContext } from "@/app/admin/AdminContext";
import cmsService from "@/services/cmsService";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ContentModal from "./ContentModal";
import "./page.css";
import ParentCard from "../../components/shared/ParentCard";
import SettingsForm from "./SettingsForm";

const BCrumb = [
  {
    to: "/admin",
    title: "Home",
  },
  {
    title: "General Settings",
  },
];

const SamplePage = () => {

 
  return (
    <PageContainer title="General Settings" description="General Settings">
      <Breadcrumb title="General Settings" items={BCrumb} />
      <ParentCard
        title="Settings"

      >
        <SettingsForm />
      </ParentCard>
    </PageContainer>
  );
};

export default SamplePage;
