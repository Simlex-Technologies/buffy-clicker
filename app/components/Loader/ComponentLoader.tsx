import { CSSProperties, FunctionComponent, ReactElement } from 'react';
import styles from './Loader.module.scss';

interface ComponentLoaderProps {

    /**
     * If you want to use a custom style for the loader, pass the style as an object
     */
    style?: CSSProperties

    isSmallLoader?: boolean

    /**
     * If you want to use a light theme for the loader, pass this prop as true
     */
    lightTheme?: boolean

    /**
     * If you want to use a custom color for the loader, pass the color as a string.
     */
    customLoaderColor?: string

    /**
     * If you want to use a custom background color for the loader, pass the color as a string. 
     * This will override the default background color of the loader.
     * Ideal for buttons
     */
    customBackground?: string

    scale?: number
}

const ComponentLoader: FunctionComponent<ComponentLoaderProps> = (
    { style, lightTheme, customBackground, customLoaderColor, isSmallLoader, scale }): ReactElement => {
    const loaderStyle = isSmallLoader ? { width: '24px', height: '24px', borderWidth: '3px', scale: scale ?? 1 } : {};

    return (
        <>
            <div className="grid place-items-center" style={customBackground ? { position: 'absolute', backgroundColor: `${customBackground}`, width: '100%', height: '100%', left: 0, top: 0 } : {}}>
                <span className=" w-12 h-12 border-4 border-b-primary rounded-full grid place-items-center box-border animate-spin"
                    style={customLoaderColor ? { ...loaderStyle } : { ...loaderStyle, borderColor: `${customLoaderColor ? customLoaderColor : '#8133F1'}` }}
                />
            </div>
        </>
    );
}

export default ComponentLoader;