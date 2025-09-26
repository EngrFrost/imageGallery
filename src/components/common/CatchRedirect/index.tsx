import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CatchRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
};

export default CatchRedirect;
