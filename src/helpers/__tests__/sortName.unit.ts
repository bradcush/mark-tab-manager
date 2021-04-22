import { SYSTEM_GROUP_NAME } from '../groupName';
import { makeSortName } from '../sortName';

describe('makeSortName', () => {
    describe('when any sorting is specified', () => {
        it('should return the system group if missing url', () => {
            const type = 'granular';
            const url = undefined;
            const sortName = makeSortName({ type, url });
            expect(sortName).toBe(SYSTEM_GROUP_NAME);
        });

        it('should return name for end sorting of new tabs', () => {
            const type = 'granular';
            const url = 'chrome://newtab';
            const sortName = makeSortName({ type, url });
            expect(sortName).toBe('zzz');
        });

        it('should return system group for unlisted urls', () => {
            const type = 'granular';
            const chromeUrl = 'chrome://extensions';
            const chromeName = makeSortName({ type, url: chromeUrl });
            expect(chromeName).toBe(SYSTEM_GROUP_NAME);
            const extensionUrl = 'chrome-extension://123456789';
            const extensionName = makeSortName({ type, url: extensionUrl });
            expect(extensionName).toBe(SYSTEM_GROUP_NAME);
            const filePath = 'file:///path.file.ext';
            const filePathName = makeSortName({ type, url: filePath });
            expect(filePathName).toBe(SYSTEM_GROUP_NAME);
            const ftpPath = 'ftp://path.file.ext';
            const ftpPathName = makeSortName({ type, url: ftpPath });
            expect(ftpPathName).toBe(SYSTEM_GROUP_NAME);
            const unlisted = 'https://domain.unlisted';
            const unlistedName = makeSortName({ type, url: unlisted });
            expect(unlistedName).toBe(SYSTEM_GROUP_NAME);
        });

        it('should return the system group when tld only', () => {
            const type = 'granular';
            const url = 'https://com';
            const sortName = makeSortName({ type, url });
            expect(sortName).toBe(SYSTEM_GROUP_NAME);
        });

        it('should properly sort source code urls', () => {
            const type = 'granular';
            const url = 'view-source:https://domain.com';
            const sortName = makeSortName({ type, url });
            expect(sortName).toBe('domain');
        });

        it('should properly sort valid protocols', () => {
            const type = 'granular';
            const httpUrl = 'http://domain.com';
            const httpUrlName = makeSortName({ type, url: httpUrl });
            expect(httpUrlName).toBe('domain');
            const httpsUrl = 'https://domain.com';
            const httpsUrlName = makeSortName({ type, url: httpsUrl });
            expect(httpsUrlName).toBe('domain');
        });

        it('should return the domain when there are no subdomains', () => {
            const type = 'granular';
            const url = 'https://domain.com';
            const sortName = makeSortName({ type, url });
            expect(sortName).toBe('domain');
        });

        it('should return the domain for if only subdomain is common', () => {
            const type = 'granular';
            const wwwUrl = 'https://www.domain.com';
            const wwwName = makeSortName({ type, url: wwwUrl });
            expect(wwwName).toBe('domain');
            const ww2Url = 'https://ww2.domain.com';
            const ww2Name = makeSortName({ type, url: ww2Url });
            expect(ww2Name).toBe('domain');
        });
    });

    describe('when granular sorting is specified', () => {
        it('should return name with shared subdomain precedence over domain', () => {
            const type = 'granular';
            const oneSubUrl = 'https://sub.domain.com';
            const oneSubdomainName = makeSortName({ type, url: oneSubUrl });
            expect(oneSubdomainName).toBe('subdomain');
            const twoSubUrl = 'https://another.sub.domain.com';
            const twoSubdomainName = makeSortName({ type, url: twoSubUrl });
            expect(twoSubdomainName).toBe('subdomain');
        });
    });

    describe('when shared sorting is specified', () => {
        it('should return name with domain precedence over shared subdomain', () => {
            const type = 'shared';
            const domainUrl = 'https://domain.com';
            const domainName = makeSortName({ type, url: domainUrl });
            expect(domainName).toBe('domain');
            const oneSubUrl = 'https://sub.domain.com';
            const oneSubdomainName = makeSortName({ type, url: oneSubUrl });
            expect(oneSubdomainName).toBe('domainsub');
            const twoSubUrl = 'https://another.sub.domain.com';
            const twoSubdomainName = makeSortName({ type, url: twoSubUrl });
            expect(twoSubdomainName).toBe('domainsub');
        });
    });
});
