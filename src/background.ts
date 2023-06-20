import { logVerbose } from './logs/console';
import { setupMemoryManagement } from './memory/setup-memory-management';
import { setupOnboarding } from './onboarding/setup-onboarding';
import { setupResourcesMenu } from './resources/setup-resources-menu';
import { setupSettingsMenu } from './settings/setup-settings-menu';
import { setupShortcuts } from './shortcuts/setup-shortcuts';
import { MemoryCache } from './storage/memory-cache';
import { setMemoryCache } from './storage/memory-cache-instance';
import { PersistedStore } from './storage/persisted-store';
import { setPersistedStore } from './storage/persisted-store-instance';
import { setUninstallSurvey } from './survey/uninstall';
import { setupTabsManagement } from './tabs/setup-tabs-management';

/**
 * Initialize the background process
 * and all top-level listeners
 */
function initialize() {
    logVerbose('Service worker started');

    // Load settings from storage
    const storeInstance = new PersistedStore();
    void storeInstance.load();
    // Set instance for direct use without
    // need for dependency injection
    setPersistedStore(storeInstance);

    // Set instance for direct use without
    // need for dependency injection
    const memoryCache = new MemoryCache();
    setMemoryCache(memoryCache);

    setupTabsManagement();
    setupMemoryManagement();
    setupResourcesMenu();
    setupSettingsMenu();
    setupShortcuts();
    setupOnboarding();
    setUninstallSurvey();
}

initialize();
