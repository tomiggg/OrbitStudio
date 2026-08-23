import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Ingresar — Panel Shift Studio" };

export default function AdminLoginPage() {
  return <LoginForm />;
}
