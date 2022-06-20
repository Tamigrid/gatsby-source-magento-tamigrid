declare module 'camelcase-object-deep' {
  export default function camelcaseObjectDeep(
    obj: Record<string, any> | any[]
  ): Record<string, any> | any[]
}
