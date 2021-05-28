import { MkBrowser } from 'src/api/MkBrowser';

interface MkRuntime {
    setUninstallURL: MkBrowser.runtime.SetUninstallURL;
}

export interface MkUninstallBrowser {
    runtime: MkRuntime;
}
