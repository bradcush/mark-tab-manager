import { makeGroupName, NEW_GROUP_NAME, SYSTEM_GROUP_NAME } from '../groupName';

describe('makeGroupName', () => {
    describe('when any sorting is specified', () => {
        it('should return the system group if missing url', () => {
            const type = 'granular';
            const url = undefined;
            const groupName = makeGroupName({ type, url });
            expect(groupName).toBe(SYSTEM_GROUP_NAME);
        });

        it('should return new nomenclature for new tabs', () => {
            const type = 'granular';
            const url = 'chrome://newtab';
            const groupName = makeGroupName({ type, url });
            expect(groupName).toBe(NEW_GROUP_NAME);
        });

        it('should return system group for unlisted urls', () => {
            const type = 'granular';
            const chromeUrl = 'chrome://extensions';
            const chromeGroup = makeGroupName({ type, url: chromeUrl });
            expect(chromeGroup).toBe(SYSTEM_GROUP_NAME);
            const extensionUrl = 'chrome-extension://123456789';
            const extensionGroup = makeGroupName({ type, url: extensionUrl });
            expect(extensionGroup).toBe(SYSTEM_GROUP_NAME);
            const filePath = 'file:///path.file.ext';
            const filePathGroup = makeGroupName({ type, url: filePath });
            expect(filePathGroup).toBe(SYSTEM_GROUP_NAME);
            const ftpPath = 'ftp://path.file.ext';
            const ftpPathGroup = makeGroupName({ type, url: ftpPath });
            expect(ftpPathGroup).toBe(SYSTEM_GROUP_NAME);
            const unlisted = 'https://domain.unlisted';
            const unlistedGroup = makeGroupName({ type, url: unlisted });
            expect(unlistedGroup).toBe(SYSTEM_GROUP_NAME);
        });

        it('should return the system group when tld only', () => {
            const type = 'granular';
            const url = 'https://com';
            const groupName = makeGroupName({ type, url });
            expect(groupName).toBe(SYSTEM_GROUP_NAME);
        });

        it('should properly group source code urls', () => {
            const type = 'granular';
            const url = 'view-source:https://domain.com';
            const groupName = makeGroupName({ type, url });
            expect(groupName).toBe('domain');
        });

        it('should properly group valid protocols', () => {
            const type = 'granular';
            const httpUrl = 'http://domain.com';
            const httpUrlGroup = makeGroupName({ type, url: httpUrl });
            expect(httpUrlGroup).toBe('domain');
            const httpsUrl = 'https://domain.com';
            const httpsUrlGroup = makeGroupName({ type, url: httpsUrl });
            expect(httpsUrlGroup).toBe('domain');
        });
    });

    describe('when granular sorting is specified', () => {
        it('should return the domain when there are no subdomains', () => {
            const type = 'granular';
            const url = 'https://domain.com';
            const groupName = makeGroupName({ type, url });
            expect(groupName).toBe('domain');
        });

        it('should return the domain for if only subdomain is common', () => {
            const type = 'granular';
            const wwwUrl = 'https://www.domain.com';
            const wwwGroup = makeGroupName({ type, url: wwwUrl });
            expect(wwwGroup).toBe('domain');
            const ww2Url = 'https://ww2.domain.com';
            const ww2Group = makeGroupName({ type, url: ww2Url });
            expect(ww2Group).toBe('domain');
        });

        it('should return the highest level subdomain', () => {
            const type = 'granular';
            const oneSubUrl = 'https://sub.domain.com';
            const oneSubdomainGroup = makeGroupName({ type, url: oneSubUrl });
            expect(oneSubdomainGroup).toBe('sub');
            const twoSubUrl = 'https://another.sub.domain.com';
            const twoSubdomainGroup = makeGroupName({ type, url: twoSubUrl });
            expect(twoSubdomainGroup).toBe('sub');
        });
    });

    describe('when shared sorting is specified', () => {
        it('should return the domain regardless of subdomains', () => {
            const type = 'shared';
            const domainUrl = 'https://domain.com';
            const domainGroup = makeGroupName({ type, url: domainUrl });
            expect(domainGroup).toBe('domain');
            const oneSubUrl = 'https://sub.domain.com';
            const oneSubdomainGroup = makeGroupName({ type, url: oneSubUrl });
            expect(oneSubdomainGroup).toBe('domain');
            const twoSubUrl = 'https://another.sub.domain.com';
            const twoSubdomainGroup = makeGroupName({ type, url: twoSubUrl });
            expect(twoSubdomainGroup).toBe('domain');
        });
    });
});
