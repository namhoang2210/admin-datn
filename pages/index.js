import React from 'react';
import Grid from "@mui/material/Grid";
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import Features from "@/components/Dashboard/eCommerce/Features";
import Ratings from "@/components/Dashboard/eCommerce/Ratings";
import AudienceOverview from "@/components/Dashboard/eCommerce/AudienceOverview";
import VisitsByDay from "@/components/Dashboard/eCommerce/VisitsByDay";
import Impressions from "@/components/Dashboard/eCommerce/Impressions";
import ActivityTimeline from "@/components/Dashboard/eCommerce/ActivityTimeline";
import RevenuStatus from "@/components/Dashboard/eCommerce/RevenuStatus";
import SalesByCountries from "@/components/Dashboard/eCommerce/SalesByCountries";
import NewCustomers from "@/components/Dashboard/eCommerce/NewCustomers";
import RecentOrders from "@/components/Dashboard/eCommerce/RecentOrders";
import TeamMembersList from "@/components/Dashboard/eCommerce/TeamMembersList";
import BestSellingProducts from "@/components/Dashboard/eCommerce/BestSellingProducts";
import LiveVisitsOnOurSite from "@/components/Dashboard/eCommerce/LiveVisitsOnOurSite";

export default function eCommerce() {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <h1>Thống kê</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>
            Thống kê
          </li>
        </ul>
      </div>

      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
        <Grid item xs={12} md={12} lg={12} xl={8}>
          {/* Features */}
          <Features />

        </Grid>
      </Grid>

      {/* Recent Orders */}
      <RecentOrders />
    </>
  );
}
