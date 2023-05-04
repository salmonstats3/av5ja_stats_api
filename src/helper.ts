import inst, { PluginFunc, UnitType } from "dayjs";

declare module "dayjs" {
  interface Dayjs {
    ceil(unit: UnitType, amount: number): inst.Dayjs;
  }
}

export const ceil: PluginFunc = (option, dayjsClass) => {
  dayjsClass.prototype.ceil = function (unit, amount) {
    if (this.get(unit) % amount === 0) {
      return this.startOf(unit);
    }
    return this.add(amount - (this.get(unit) % amount), unit).startOf(unit);
  };
};
