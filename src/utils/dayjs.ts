import inst, { PluginFunc } from 'dayjs'

declare module 'dayjs' {
  interface Dayjs {
    ceil(amount: number): inst.Dayjs
  }
}

export const ceil: PluginFunc = (option, dayjsClass) => {
  dayjsClass.prototype.ceil = function (amount) {
    if (this.get('minute') % amount === 0) {
      return this.startOf('minute')
    }
    return this.add(amount - (this.get('minute') % amount), 'minute').startOf('minute')
  }
}
