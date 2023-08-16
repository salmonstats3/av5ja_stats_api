import { Decimal as DecimalNumber } from '@prisma/client/runtime/library';

export class Decimal extends DecimalNumber {
    constructor(value = 0) {
        super(value);
    }
}
