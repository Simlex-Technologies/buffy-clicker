import { FunctionComponent, ReactNode, createContext, useState } from "react";
import { UserProfileInformation } from "../models/IUser";
import { StorageKeys } from "../constants/storageKeys";


// Define the type for the context data
export type ApplicationContextData = {
    isFetchingUserProfile: boolean;
    userProfileInformation: UserProfileInformation | null;
    fetchUserProfileInformation: () => void;
    displayToast: (message: string, type: "success" | "error" | "info" | "warning") => void;
    isUserLoginPromptVisible: boolean;
    toggleUserLoginPrompt: () => void;
};

// Create a context with the specified data type
const ApplicationContext = createContext<ApplicationContextData | undefined>(undefined);

// Create a provider component that takes children as props
type AppProviderProps = {
    children: ReactNode;
};

const AppProvider: FunctionComponent<AppProviderProps> = ({ children }) => {

    // Define state for customer data
    const [userProfileInformation, setUserProfileInformation] = useState<UserProfileInformation | null>(null);
    const [isFetchingUserProfileInformation, setIsFetchingUserProfileInformation] = useState(false);

    // Define state for displaying login prompt
    const [showUserLoginPrompt, setShowUserLoginPrompt] = useState(false);

    // Define function to display toast
    const displayToast = (message: string, type: "success" | "error" | "info" | "warning") => {
        alert(message);
    };

    /**
     * Function to fetch user's profile information
     */
    const handleFetchUserInformation = async () => {

        // Set loader to true
        setIsFetchingUserProfileInformation(true);

        // Check session storage for user information
        const _userInfo = JSON.parse(sessionStorage.getItem(StorageKeys.UserInformation) as string);

        if (_userInfo !== null || _userInfo !== undefined) {
            // Set the user information
            setUserProfileInformation(_userInfo);
        };
    };

    // Define the values you want to share
    const sharedData: ApplicationContextData = {
        isFetchingUserProfile: isFetchingUserProfileInformation,
        userProfileInformation,
        fetchUserProfileInformation: handleFetchUserInformation,
        displayToast,
        isUserLoginPromptVisible: showUserLoginPrompt,
        toggleUserLoginPrompt: () => setShowUserLoginPrompt(!showUserLoginPrompt)
    };

    return (
        <ApplicationContext.Provider value={sharedData}>
            {children}
        </ApplicationContext.Provider>
    );
};

export { AppProvider, ApplicationContext };
