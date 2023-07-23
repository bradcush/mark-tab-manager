import { InitializeInfra } from './background-types';
import { runtimeSetUninstallUrl } from './infra/browser/runtime/set-uninstall-url';
import { storageSyncGet } from './infra/browser/storage/sync/get';
import { storageSyncSet } from './infra/browser/storage/sync/set';
import { setupMemoryManagement } from './memory/setup-memory-management';
import { setupOnboarding } from './onboarding/setup-onboarding';
import { setupMenus } from './toolbar/setup-menus';
import { setupShortcuts } from './shortcuts/setup-shortcuts';
import { MemoryCache } from './storage/memory-cache';
import { setMemoryCache } from './storage/memory-cache-instance';
import { PersistedStore } from './storage/persisted-store';
import { setPersistedStore } from './storage/persisted-store-instance';
import { setUninstallSurvey } from './survey/uninstall';
import { setupTabsManagement } from './tabs/setup-tabs-management';
import { logVerbose } from './logs/console';

/**
 * Initialize the background process
 * and all top-level listeners
 */
function initialize(infrastructure: InitializeInfra) {
    logVerbose('Service worker started');
    const { runtimeSetUninstallUrl, storageSyncGet, storageSyncSet } =
        infrastructure;

    // Load settings from storage
    const persistedStoreInstance = new PersistedStore(
        storageSyncGet,
        storageSyncSet
    );
    void persistedStoreInstance.load();
    // Set instance for direct use without
    // need for dependency injection
    setPersistedStore(persistedStoreInstance);

    // Set instance for direct use without
    // need for dependency injection
    const memoryCacheInstance = new MemoryCache();
    setMemoryCache(memoryCacheInstance);

    void setupMenus();
    setupTabsManagement();
    setupMemoryManagement();
    setUninstallSurvey(runtimeSetUninstallUrl);
    setupShortcuts();
    setupOnboarding();
}

initialize({
    runtimeSetUninstallUrl,
    storageSyncGet,
    storageSyncSet,
});
