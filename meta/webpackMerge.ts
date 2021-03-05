import { CustomizeRule, mergeWithRules } from 'webpack-merge';

/**
 * Custom merge function for webpack configs
 */
export const merge = mergeWithRules({
    plugins: CustomizeRule.Append,
});
