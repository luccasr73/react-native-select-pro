import type { ReactNode } from 'react';
import React, { createContext, useCallback, useRef, useState } from 'react';
import { InteractionManager, View } from 'react-native';
import { PortalHost, PortalProvider } from '@gorhom/portal';

import { Portals } from '../../constants';

type Props = {
    children: ReactNode;
};

const PortalHosts = () => {
    return (
        <>
            <PortalHost name={Portals.Backdrop} />
            <PortalHost name={Portals.OptionsList} />
        </>
    );
};

export const SelectProvider = ({ children }: Props) => {
    return (
        <PortalProvider>
            {children}
            <PortalHosts />
        </PortalProvider>
    );
};

export const SelectModalContext = createContext(0);

export const SelectModalProvider = ({ children }: Props) => {
    const [valueY, setValueY] = useState(0);
    const ref = useRef<View>(null);

    // this is a necessary to get correct optionsList position for modal with pageSheet presentation style
    const getModalTopPosition = useCallback(() => {
        void InteractionManager.runAfterInteractions(() => {
            if (ref.current) {
                ref.current.measure((_x, _y, _width, _height, _pageX, pageY) => {
                    setValueY(pageY);
                });
            }
        });
    }, []);

    return (
        <SelectModalContext.Provider value={valueY}>
            <View ref={ref} onLayout={getModalTopPosition} />
            <PortalHosts />
            {children}
        </SelectModalContext.Provider>
    );
};
