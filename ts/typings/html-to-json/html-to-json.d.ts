
declare module 'html-to-json' {
    export function parse(html: string, filter: any, callback?: Function): Promise<any>;
}