"use client";

import { useContext, useEffect, useRef, useState } from "react";
import loginAction, { removeCookie } from "./loginAction";
import ReturnArrowButton from "../components/Button/returnArrowButton/ReturnArrowButton";
import Header from "../components/Header/Header";
import { UserInfoContext } from "../components/UserInfoProvider/UserInfoProvider";
import { useRouter } from "next/navigation";
import PasswordInput from "../components/PasswordInput/PasswordInput";

/**
 * Login component for user authentication.
 * @returns {JSX.Element} The rendered login form.
 */
export default function Login() {
    // Get the router object
    // Used to redirect the user after login
    const router = useRouter();

    // Reference to the form
    const formRef = useRef(null);

    // Get user information from the context
    const { login } = useContext(UserInfoContext);

    // State variables
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        removeCookie();
    }, []);

    /**
     * Handles form submission and user login validation.
     * @param {Event} e - The form submission event.
     */
    const handleValidate = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Call loginAction function to validate user login
        const result = await loginAction(formData);
        if (result.access) {
            setSuccess(result.msg);
            router.push("/dashboard");
            login(result);
        }
        else{
            setError(result.msg);
            setIsLoading(false);
        }
    };

    /**
     * Handles form input changes and updates the form data.
     * @param {Event} e - The input change event.
     */
    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === "email") value = value.toLowerCase().replace(/\s/g, ""); // Normalize email input
        setFormData({ ...formData, [name]: value });
    };

    // Render the login form
    return (
        <>
            <Header displayAccountButton={false} />
            <div className="flex-column flex-center margin-bottom-50 max-width-90p">
                <div className="form-container">
                    <h1 className="padding-30">Connexion</h1>
                    <form
                        ref={formRef}
                        onSubmit={handleValidate}
                        className="formulaire"
                    >
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Mot de Passe:
                            <PasswordInput
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={true}
                            />
                        </label>
                        <button type="submit" disabled={isLoading}>
                            {!isLoading ? "Valider" : "Chargement..."}
                        </button>
                    </form>

                    {success === ""
                        ? <p className="error margin-top-10">{error}</p>
                        : <p className="success margin-top-10">{success}</p>
                    }
                    <a href="/register" className="margin-top-10">
                        Pas encore inscrit ?
                    </a>
                </div>
                <ReturnArrowButton
                    text="Retour à l'accueil"
                    link="/"
                    className="self-left margin-top-10"
                />
            </div>
        </>
    );
}
