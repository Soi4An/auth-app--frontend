import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotActivation from "./pages/ForgotActivation";
import Forgot from "./pages/Forgot";
import SignUpActivation from "./pages/SignUpActivation";
import { ACTIVATION_ACCOUNT_WAY, ACTIVATION_PASSWORD_WAY } from "./config";
import AccountPage from "./pages/AccountPage";
import ChangeNamePage from "./pages/ChangeNamePage";
import ChangeEmailPage from "./pages/ChangeEmailPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AlertWithLink from "./pages/AlertWithLink";
import { RequireAuth } from "./components/RequireAuth";
import { AlertTypes } from "./types/AlertTypes";

function App() {
  // const location = useLocation();

  return (
    <div>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="home" element={<Navigate to="/" replace />} />

          <Route path="login" element={<SignIn />} />
          <Route path="register" element={<SignUp />} />
          <Route
            path={`${ACTIVATION_ACCOUNT_WAY}/:activetionToken`}
            element={<SignUpActivation requestWay={ACTIVATION_ACCOUNT_WAY} />}
          />

          <Route path="forgot" element={<Forgot />} />
          <Route
            path={`${ACTIVATION_PASSWORD_WAY}/:activetionToken`}
            element={<ForgotActivation requestWay={ACTIVATION_PASSWORD_WAY} />}
          />

          <Route
            path="success-reset"
            element={
              <AlertWithLink
                href="/login"
                buttonTitle="Sign In"
                message="Reseting of password was successfull."
                type={AlertTypes.success}
              />
            }
          />

          {/* <Route path="/" element={<RequireAuth key={location.pathname}/>}> */}
          <Route path="/" element={<RequireAuth />}>
            <Route path="profile">
              <Route index element={<AccountPage />} />
              <Route path="change-name" element={<ChangeNamePage />} />
              <Route path="change-email" element={<ChangeEmailPage />} />
              <Route path="change-password" element={<ChangePasswordPage />} />
            </Route>
          </Route>

          <Route path="*" element={<h1>404 Missing page</h1>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
