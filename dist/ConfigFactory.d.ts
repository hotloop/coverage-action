import { SyncCoverageOptions } from '@hotloop/hotloop-sdk/dist/Options';
import { InputOptions } from '@actions/core';
import { Context } from '@actions/github/lib/context';
interface Config {
    token: string;
    options: SyncCoverageOptions;
}
declare type InputFunction = (name: string, options?: InputOptions) => string;
declare class ConfigFactory {
    static get(inputFn: InputFunction, githubContext: Context): Promise<Config>;
}
export { ConfigFactory, InputFunction, Config };
