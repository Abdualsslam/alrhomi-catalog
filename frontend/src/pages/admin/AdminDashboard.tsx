// src/pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import { fetchStats, fetchUsers } from "../../api/admin";
import { User } from "../../types/models.types";
import DashboardSkeleton from "./components/DashboardSkeleton";
import DashboardHeader from "./components/DashboardHeader";
import StatsOverview from "./components/StatsOverview";
import ImagesDistributionCard from "./components/ImagesDistributionCard";
import RecentUsersCard from "./components/RecentUsersCard";

interface StatsData {
  totalProducts: number;
  productsWithImages: number;
  productsWithoutImages: number;
  totalImages: number;
  watermarkedCount: number;
  pendingJobs: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData>({
    // Products (الأساس)
    totalProducts: 0,
    productsWithImages: 0,
    productsWithoutImages: 0,
    // Images (تابعة)
    totalImages: 0,
    watermarkedCount: 0,
    pendingJobs: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  // src/pages/admin/AdminDashboard.jsx
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    let isMounted = true;

    const load = async () => {
      console.log("Dashboard load started");
      setLoading(true);

      try {
        // 1. جلب الإحصائيات
        console.log("→ Calling fetchStats()");
        const statsResponse = await fetchStats({ signal });

        // تحقق من أن المكون ما زال مرفوعًا
        if (!isMounted) return;

        // تحقق من وجود البيانات
        if (statsResponse) {
          console.log("← fetchStats returned", statsResponse);
          setStats({
            totalProducts: statsResponse.totalProducts ?? 0,
            productsWithImages: statsResponse.productsWithImages ?? 0,
            productsWithoutImages: statsResponse.productsWithoutImages ?? 0,
            totalImages: statsResponse.totalImages ?? 0,
            watermarkedCount: statsResponse.watermarkedCount ?? 0,
            pendingJobs: statsResponse.pendingJobs ?? 0,
            activeUsers: statsResponse.activeUsers ?? 0,
          });
        } else {
          throw new Error("Invalid stats response");
        }

        // 2. جلب المستخدمين
        console.log("→ Calling fetchUsers()");
        const usersResponse = await fetchUsers({ signal });

        // تحقق من أن المكون ما زال مرفوعًا
        if (!isMounted) return;

        // تحقق من وجود البيانات
        if (usersResponse && Array.isArray(usersResponse)) {
          console.log("← fetchUsers returned", usersResponse);
          const sorted = usersResponse
            .sort((a: User, b: User) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
          setRecentUsers(sorted);
        } else {
          throw new Error("Invalid users response");
        }
      } catch (err) {
        // تجاهل أخطاء الإلغاء
    
        // معالجة أخطاء الوقت الفائت
          console.error("Error fetching dashboard data:", err instanceof Error ? err.message : String(err));
          setStats({
            totalProducts: 0,
            productsWithImages: 0,
            productsWithoutImages: 0,
            totalImages: 0,
            watermarkedCount: 0,
            pendingJobs: 0,
            activeUsers: 0,
          });
          setRecentUsers([]);
        
      } finally {
        if (isMounted) {
          console.log("Dashboard load finished");
          setLoading(false);
        }
      }
    };

    load();

    // تنظيف الطلبات عند الخروج
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // حساب الصور المعالجة = الإجمالي - المعلّمة - بانتظار المعالجة
  const processed =
    (stats.totalImages ?? 0) - (stats.watermarkedCount ?? 0) - (stats.pendingJobs ?? 0);

  const chartData = [
    { name: "معالجة", value: Math.max(0, processed) },
    { name: "مُعلَّمة", value: stats.watermarkedCount ?? 0 },
    { name: "بانتظار", value: stats.pendingJobs ?? 0 },
  ];

  const formatDate = (d: string | Date): string =>
    new Date(d).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <DashboardHeader />
      <StatsOverview stats={stats} />
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
          <ImagesDistributionCard data={chartData} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
          <RecentUsersCard users={recentUsers} formatDate={formatDate} />
        </Grid>
      </Grid>
    </Box>
  );
}
