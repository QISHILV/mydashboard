import { useEffect } from "react";
import { useNavigate } from "react-router";

export function TemplatesRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/templates/market", { replace: true });
  }, [navigate]);
  return null;
}
