import React, {createContext, useCallback, useContext, useState} from 'react';
import {Alert, Snackbar} from '@mui/material';

type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning';

interface SnackbarContextType {
    showMessage: (message: string, severity?: SnackbarSeverity) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<SnackbarSeverity>('info');

    const showMessage = useCallback((msg: string, sev: SnackbarSeverity = 'info') => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    }, []);

    return (
        <SnackbarContext.Provider value={{showMessage}}>
            {children}
            <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const ctx = useContext(SnackbarContext);
    if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider');
    return ctx;
};





