import { RuntimeSetUninstallUrl } from './ports/runtime-set-uninstall-url';
import { StorageSyncGet } from './ports/storage-sync-get';
import { StorageSyncSet } from './ports/storage-sync-set';

export interface InitializeInfra {
    runtimeSetUninstallUrl: RuntimeSetUninstallUrl;
    storageSyncGet: StorageSyncGet;
    storageSyncSet: StorageSyncSet;
}
