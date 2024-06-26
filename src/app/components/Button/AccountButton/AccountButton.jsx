"use client";

import { useContext } from "react";
import { MdAccountCircle } from "react-icons/md";
import { UserInfoContext } from "../../UserInfoProvider/UserInfoProvider";

// AccountButton component
/**
 * Renders a button component for user account actions.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.className - The CSS class name for the button container.
 * @returns {JSX.Element} The rendered AccountButton component.
 */
const AccountButton = ({ className }) => {
  const { userInfo } = useContext(UserInfoContext);

  return (
    <div className={className}>
      {userInfo.isConnected ? (
        // If user is connected, display link to profile
        <a href="/profil" className="decoration-none">
          <span id="accountSpan">
            Mon compte
            <MdAccountCircle size={32} />
          </span>
        </a>
      ) : (
        // If user is not connected, display link to login
        <a href="/login" className="decoration-none">
          <span id="accountSpan">
            Me connecter
            <MdAccountCircle size={32} />
          </span>
        </a>
      )}
    </div>
  );
};

export default AccountButton;
